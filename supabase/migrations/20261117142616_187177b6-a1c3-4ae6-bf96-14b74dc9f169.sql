
CREATE TABLE public.community_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('moderator','tester')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);
GRANT SELECT ON public.community_roles TO authenticated;
GRANT ALL ON public.community_roles TO service_role;
ALTER TABLE public.community_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.community_roles FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.has_community_role(_uid uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_roles WHERE user_id = _uid AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.community_enabled(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_roles WHERE user_id = _uid AND role IN ('moderator','tester'))
$$;

CREATE TABLE public.community_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL DEFAULT auth.uid(),
  pseudonym text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  theme text NOT NULL,
  content_warnings text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','published','rejected','withdrawn')),
  moderator_note text,
  rules_version text,
  consent_at timestamptz,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.community_stories (author_id);
CREATE INDEX ON public.community_stories (status);
GRANT SELECT ON public.community_stories TO authenticated;
GRANT ALL ON public.community_stories TO service_role;
ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "author reads own" ON public.community_stories FOR SELECT TO authenticated USING (author_id = (SELECT auth.uid()));
CREATE POLICY "moderator reads submitted" ON public.community_stories FOR SELECT TO authenticated USING (status <> 'draft' AND public.has_community_role((SELECT auth.uid()), 'moderator'));

CREATE TABLE public.community_published (
  story_id uuid PRIMARY KEY REFERENCES public.community_stories(id) ON DELETE CASCADE,
  pseudonym text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  theme text NOT NULL,
  content_warnings text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.community_published (theme, published_at DESC);
GRANT SELECT ON public.community_published TO authenticated;
GRANT ALL ON public.community_published TO service_role;
ALTER TABLE public.community_published ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enabled readers" ON public.community_published FOR SELECT TO authenticated USING (public.community_enabled((SELECT auth.uid())));

CREATE TABLE public.community_reactions (
  story_id uuid NOT NULL REFERENCES public.community_stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL CHECK (kind IN ('identified','thanks','helped')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, user_id, kind)
);
GRANT SELECT, DELETE ON public.community_reactions TO authenticated;
GRANT ALL ON public.community_reactions TO service_role;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reactions read" ON public.community_reactions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY "own reactions delete" ON public.community_reactions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE public.community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.community_stories(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL DEFAULT auth.uid(),
  reason text NOT NULL CHECK (reason IN ('personal_data','harassment','risk','spam','other')),
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed')),
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT ON public.community_reports TO authenticated;
GRANT ALL ON public.community_reports TO service_role;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moderators read reports" ON public.community_reports FOR SELECT TO authenticated USING (public.has_community_role((SELECT auth.uid()), 'moderator'));

CREATE TABLE public.community_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid NOT NULL,
  action text NOT NULL,
  story_id uuid,
  report_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_audit TO authenticated;
GRANT ALL ON public.community_audit TO service_role;
ALTER TABLE public.community_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moderators read audit" ON public.community_audit FOR SELECT TO authenticated USING (public.has_community_role((SELECT auth.uid()), 'moderator'));

-- helpers
CREATE OR REPLACE FUNCTION public._community_validate(p_title text, p_body text, p_theme text, p_pseudonym text, p_warnings text[])
RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
BEGIN
  IF length(btrim(coalesce(p_title,''))) NOT BETWEEN 3 AND 120 THEN RAISE EXCEPTION 'Título deve ter entre 3 e 120 caracteres'; END IF;
  IF length(btrim(coalesce(p_body,''))) NOT BETWEEN 50 AND 8000 THEN RAISE EXCEPTION 'Texto deve ter entre 50 e 8000 caracteres'; END IF;
  IF length(btrim(coalesce(p_pseudonym,''))) NOT BETWEEN 2 AND 40 THEN RAISE EXCEPTION 'Pseudônimo deve ter entre 2 e 40 caracteres'; END IF;
  IF p_theme NOT IN ('separacao','saudade','filhos','vida_pratica','limites','recomecos') THEN RAISE EXCEPTION 'Tema inválido'; END IF;
  IF p_warnings IS NOT NULL AND NOT (p_warnings <@ ARRAY['violencia','abuso_emocional','filhos','autolesao','luto','dinheiro']::text[]) THEN RAISE EXCEPTION 'Aviso inválido'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.community_save_story(p_id uuid, p_title text, p_body text, p_theme text, p_pseudonym text, p_warnings text[])
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); s public.community_stories; new_status text; nid uuid;
BEGIN
  IF uid IS NULL OR NOT public.community_enabled(uid) THEN RAISE EXCEPTION 'Sem acesso'; END IF;
  PERFORM public._community_validate(p_title, p_body, p_theme, p_pseudonym, p_warnings);
  IF p_id IS NULL THEN
    IF (SELECT count(*) FROM public.community_stories WHERE author_id = uid AND created_at > now() - interval '1 day') >= 5 THEN
      RAISE EXCEPTION 'Limite de novos relatos por dia atingido'; END IF;
    INSERT INTO public.community_stories (author_id, title, body, theme, pseudonym, content_warnings)
    VALUES (uid, btrim(p_title), btrim(p_body), p_theme, btrim(p_pseudonym), coalesce(p_warnings,'{}')) RETURNING id INTO nid;
    INSERT INTO public.community_audit(actor_id, action, story_id) VALUES (uid, 'create_draft', nid);
    RETURN nid;
  END IF;
  SELECT * INTO s FROM public.community_stories WHERE id = p_id AND author_id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Relato não encontrado'; END IF;
  new_status := CASE s.status WHEN 'published' THEN 'pending' WHEN 'pending' THEN 'pending' ELSE 'draft' END;
  DELETE FROM public.community_published WHERE story_id = p_id;
  UPDATE public.community_stories SET title = btrim(p_title), body = btrim(p_body), theme = p_theme,
    pseudonym = btrim(p_pseudonym), content_warnings = coalesce(p_warnings,'{}'), status = new_status,
    published_at = NULL, submitted_at = CASE WHEN new_status = 'pending' THEN now() ELSE submitted_at END,
    updated_at = now() WHERE id = p_id;
  INSERT INTO public.community_audit(actor_id, action, story_id) VALUES (uid, 'edit_' || new_status, p_id);
  RETURN p_id;
END $$;

CREATE OR REPLACE FUNCTION public.community_submit_story(p_id uuid, p_rules_version text, p_accept_rules boolean, p_accept_moderation boolean, p_accept_display boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); s public.community_stories;
BEGIN
  IF uid IS NULL OR NOT public.community_enabled(uid) THEN RAISE EXCEPTION 'Sem acesso'; END IF;
  IF NOT (coalesce(p_accept_rules,false) AND coalesce(p_accept_moderation,false) AND coalesce(p_accept_display,false)) THEN
    RAISE EXCEPTION 'É preciso aceitar os três itens'; END IF;
  IF length(coalesce(p_rules_version,'')) NOT BETWEEN 1 AND 20 THEN RAISE EXCEPTION 'Versão das regras inválida'; END IF;
  SELECT * INTO s FROM public.community_stories WHERE id = p_id AND author_id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Relato não encontrado'; END IF;
  IF s.status <> 'draft' THEN RAISE EXCEPTION 'Só rascunhos podem ser enviados'; END IF;
  IF (SELECT count(*) FROM public.community_audit WHERE actor_id = uid AND action = 'submit' AND created_at > now() - interval '1 day') >= 5 THEN
    RAISE EXCEPTION 'Limite de envios por dia atingido'; END IF;
  UPDATE public.community_stories SET status = 'pending', rules_version = p_rules_version, consent_at = now(),
    submitted_at = now(), moderator_note = NULL, updated_at = now() WHERE id = p_id;
  INSERT INTO public.community_audit(actor_id, action, story_id) VALUES (uid, 'submit', p_id);
END $$;

CREATE OR REPLACE FUNCTION public.community_withdraw_story(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sem acesso'; END IF;
  UPDATE public.community_stories SET status = 'withdrawn', published_at = NULL, updated_at = now()
    WHERE id = p_id AND author_id = uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Relato não encontrado'; END IF;
  DELETE FROM public.community_published WHERE story_id = p_id;
  INSERT INTO public.community_audit(actor_id, action, story_id) VALUES (uid, 'author_withdraw', p_id);
END $$;

CREATE OR REPLACE FUNCTION public.community_delete_draft(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.community_stories WHERE id = p_id AND author_id = auth.uid() AND status IN ('draft','withdrawn','rejected');
  IF NOT FOUND THEN RAISE EXCEPTION 'Só rascunhos, retirados ou não aprovados podem ser apagados'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.community_moderate(p_id uuid, p_action text, p_note text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); s public.community_stories;
BEGIN
  IF uid IS NULL OR NOT public.has_community_role(uid, 'moderator') THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  IF p_action NOT IN ('approve','reject','request_changes','withdraw') THEN RAISE EXCEPTION 'Ação inválida'; END IF;
  IF length(coalesce(p_note,'')) > 1000 THEN RAISE EXCEPTION 'Motivo muito longo'; END IF;
  IF p_action <> 'approve' AND length(btrim(coalesce(p_note,''))) < 3 THEN RAISE EXCEPTION 'Informe o motivo'; END IF;
  SELECT * INTO s FROM public.community_stories WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Relato não encontrado'; END IF;
  IF s.author_id = uid THEN RAISE EXCEPTION 'Você não pode moderar o próprio relato'; END IF;
  IF p_action = 'approve' THEN
    IF s.status <> 'pending' THEN RAISE EXCEPTION 'Só relatos pendentes podem ser aprovados'; END IF;
    UPDATE public.community_stories SET status = 'published', published_at = now(), moderator_note = NULLIF(btrim(p_note),''), updated_at = now() WHERE id = p_id;
    INSERT INTO public.community_published (story_id, pseudonym, title, body, theme, content_warnings, published_at)
      VALUES (s.id, s.pseudonym, s.title, s.body, s.theme, s.content_warnings, now())
      ON CONFLICT (story_id) DO UPDATE SET pseudonym = EXCLUDED.pseudonym, title = EXCLUDED.title, body = EXCLUDED.body,
        theme = EXCLUDED.theme, content_warnings = EXCLUDED.content_warnings, published_at = EXCLUDED.published_at;
  ELSIF p_action = 'reject' THEN
    IF s.status <> 'pending' THEN RAISE EXCEPTION 'Só relatos pendentes podem ser recusados'; END IF;
    UPDATE public.community_stories SET status = 'rejected', moderator_note = btrim(p_note), updated_at = now() WHERE id = p_id;
  ELSIF p_action = 'request_changes' THEN
    IF s.status NOT IN ('pending','published') THEN RAISE EXCEPTION 'Estado inválido'; END IF;
    DELETE FROM public.community_published WHERE story_id = p_id;
    UPDATE public.community_stories SET status = 'draft', published_at = NULL, moderator_note = btrim(p_note), updated_at = now() WHERE id = p_id;
  ELSE
    IF s.status <> 'published' THEN RAISE EXCEPTION 'Só publicados podem ser retirados'; END IF;
    DELETE FROM public.community_published WHERE story_id = p_id;
    UPDATE public.community_stories SET status = 'withdrawn', published_at = NULL, moderator_note = btrim(p_note), updated_at = now() WHERE id = p_id;
  END IF;
  INSERT INTO public.community_audit(actor_id, action, story_id) VALUES (uid, 'mod_' || p_action, p_id);
END $$;

CREATE OR REPLACE FUNCTION public.community_toggle_reaction(p_story uuid, p_kind text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR NOT public.community_enabled(uid) THEN RAISE EXCEPTION 'Sem acesso'; END IF;
  IF p_kind NOT IN ('identified','thanks','helped') THEN RAISE EXCEPTION 'Reação inválida'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.community_published WHERE story_id = p_story) THEN RAISE EXCEPTION 'Relato indisponível'; END IF;
  DELETE FROM public.community_reactions WHERE story_id = p_story AND user_id = uid AND kind = p_kind;
  IF FOUND THEN RETURN false; END IF;
  INSERT INTO public.community_reactions(story_id, user_id, kind) VALUES (p_story, uid, p_kind);
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.community_report(p_story uuid, p_reason text, p_details text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); rid uuid;
BEGIN
  IF uid IS NULL OR NOT public.community_enabled(uid) THEN RAISE EXCEPTION 'Sem acesso'; END IF;
  IF p_reason NOT IN ('personal_data','harassment','risk','spam','other') THEN RAISE EXCEPTION 'Motivo inválido'; END IF;
  IF length(coalesce(p_details,'')) > 1000 THEN RAISE EXCEPTION 'Detalhes muito longos'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.community_published WHERE story_id = p_story) THEN RAISE EXCEPTION 'Relato indisponível'; END IF;
  IF (SELECT count(*) FROM public.community_reports WHERE reporter_id = uid AND created_at > now() - interval '1 day') >= 10 THEN
    RAISE EXCEPTION 'Limite de denúncias por dia atingido'; END IF;
  IF EXISTS (SELECT 1 FROM public.community_reports WHERE reporter_id = uid AND story_id = p_story AND status = 'open') THEN
    RAISE EXCEPTION 'Você já denunciou este relato'; END IF;
  INSERT INTO public.community_reports(story_id, reporter_id, reason, details) VALUES (p_story, uid, p_reason, NULLIF(btrim(p_details),'')) RETURNING id INTO rid;
  INSERT INTO public.community_audit(actor_id, action, story_id, report_id) VALUES (uid, 'report', p_story, rid);
END $$;

CREATE OR REPLACE FUNCTION public.community_review_report(p_report uuid, p_note text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); sid uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_community_role(uid, 'moderator') THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  IF length(coalesce(p_note,'')) > 1000 THEN RAISE EXCEPTION 'Nota muito longa'; END IF;
  UPDATE public.community_reports SET status = 'reviewed', resolution_note = NULLIF(btrim(p_note),''), reviewed_at = now()
    WHERE id = p_report RETURNING story_id INTO sid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Denúncia não encontrada'; END IF;
  INSERT INTO public.community_audit(actor_id, action, story_id, report_id) VALUES (uid, 'review_report', sid, p_report);
END $$;

REVOKE ALL ON FUNCTION public._community_validate(text,text,text,text,text[]) FROM PUBLIC, anon, authenticated;
DO $$ DECLARE f text; BEGIN
  FOREACH f IN ARRAY ARRAY[
    'community_save_story(uuid,text,text,text,text,text[])',
    'community_submit_story(uuid,text,boolean,boolean,boolean)',
    'community_withdraw_story(uuid)','community_delete_draft(uuid)',
    'community_moderate(uuid,text,text)','community_toggle_reaction(uuid,text)',
    'community_report(uuid,text,text)','community_review_report(uuid,text)',
    'has_community_role(uuid,text)','community_enabled(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', f);
  END LOOP;
END $$;
