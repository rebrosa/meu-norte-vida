import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { primaryBtn, secondaryBtn } from "@/components/app/AppShell";
import { IntensityDots } from "@/components/app/IntensityDots";
import { formatCountdown, formatDateBR, PAUSE_MINUTES } from "@/lib/dates";
import { createRelapseEvent, FEELINGS, letterQuery, setRelapseOutcome, topEpisodesQuery, type Feeling } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/voltar")({
  head: () => ({
    meta: [
      { title: "Pausa — Reality Check" },
      { name: "description", content: "Um momento para respirar." },
      { property: "og:title", content: "Pausa — Reality Check" },
      { property: "og:description", content: "Um momento para respirar." },
    ],
  }),
  component: Voltar,
});

function Voltar() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [eventId, setEventId] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Passo {step} de 3</span>
        <Link to="/inicio" className="inline-flex min-h-12 items-center px-2 text-base text-muted-foreground underline">
          Início
        </Link>
      </header>
      {step === 1 && (
        <StepBreathe
          onDone={(id) => {
            setEventId(id);
            setStep(2);
          }}
        />
      )}
      {step === 2 && <StepRemember onNext={() => setStep(3)} />}
      {step === 3 && <StepPause eventId={eventId} />}
    </main>
  );
}

function StepBreathe({ onDone }: { onDone: (id: string | null) => void }) {
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [saving, setSaving] = useState(false);

  async function next() {
    if (!feeling) return;
    setSaving(true);
    try {
      onDone(await createRelapseEvent(feeling));
    } catch {
      toast.error("Não consegui salvar, mas vamos continuar.");
      onDone(null);
    }
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl leading-tight text-foreground">Respire. Você não precisa decidir agora.</h1>
        <p className="text-lg text-muted-foreground">Inspire devagar contando até 4. Solte o ar contando até 6. Faça isso três vezes.</p>
      </div>
      <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-secondary" aria-hidden />
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">O que você está sentindo agora?</legend>
        <div className="flex flex-wrap gap-3">
          {FEELINGS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={feeling === f}
              onClick={() => setFeeling(f)}
              className={`min-h-12 rounded-full px-5 text-lg capitalize ring-1 ring-border ${feeling === f ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </fieldset>
      <button onClick={next} disabled={!feeling || saving} className={`${primaryBtn} mt-auto`}>
        Continuar
      </button>
    </section>
  );
}

function StepRemember({ onNext }: { onNext: () => void }) {
  const letter = useQuery(letterQuery);
  const top = useQuery(topEpisodesQuery);
  const hasLetter = !!(letter.data?.why_text || letter.data?.future_goals);

  return (
    <section className="flex flex-1 flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">Lembre do que você escreveu</h1>

      {letter.isPending ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : hasLetter ? (
        <article className="space-y-4 rounded-3xl bg-secondary p-6 text-secondary-foreground">
          {letter.data?.why_text && (
            <div className="space-y-1">
              <h2 className="text-base font-semibold">Por que decidi me afastar</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed">{letter.data.why_text}</p>
            </div>
          )}
          {letter.data?.future_goals && (
            <div className="space-y-1">
              <h2 className="text-base font-semibold">O que quero para minha vida</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed">{letter.data.future_goals}</p>
            </div>
          )}
        </article>
      ) : (
        <p className="rounded-3xl bg-secondary p-6 text-lg text-secondary-foreground">
          Você ainda não escreveu sua carta.{" "}
          <Link to="/decisao" className="font-semibold text-primary underline">Escrever agora</Link>
        </p>
      )}

      <div className="space-y-3">
        <h2 className="font-display text-2xl text-foreground">Momentos que você registrou</h2>
        {top.isPending ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : top.data && top.data.length > 0 ? (
          <ul className="space-y-3">
            {top.data.map((ep) => (
              <li key={ep.id} className="space-y-2 rounded-3xl bg-card p-5 ring-1 ring-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">{formatDateBR(ep.occurred_on) || "Sem data"}</span>
                  <IntensityDots value={ep.intensity} />
                </div>
                <p className="whitespace-pre-line text-lg text-foreground">{ep.what_happened}</p>
                {ep.how_felt && <p className="text-base text-muted-foreground">{ep.how_felt}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-muted-foreground">Nenhum registro ainda.</p>
        )}
      </div>

      <button onClick={onNext} className={`${primaryBtn} mt-auto`}>
        Fazer uma pausa de {PAUSE_MINUTES} minutos
      </button>
    </section>
  );
}

function StepPause({ eventId }: { eventId: string | null }) {
  const navigate = useNavigate();
  const total = PAUSE_MINUTES * 60;
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(total);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => setRemaining(Math.max(0, (endsAt - Date.now()) / 1000));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [endsAt]);

  const finished = endsAt !== null && remaining <= 0;
  const progress = 1 - remaining / total;

  async function finish(outcome: "manteve_decisao" | "em_duvida") {
    setSaving(true);
    try {
      if (eventId) await setRelapseOutcome(eventId, outcome);
    } catch {
      /* the urge was still logged in step 1 */
    }
    toast.success(outcome === "manteve_decisao" ? "Você cuidou de si hoje." : "Tudo bem. Você pode voltar aqui quando quiser.");
    navigate({ to: "/inicio" });
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-foreground">Dê a si mesma {PAUSE_MINUTES} minutos</h1>
        <p className="text-lg text-muted-foreground">
          Não mande mensagem, não ligue. Só espere. A vontade costuma diminuir com o tempo.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-secondary p-8">
        <p className="font-display text-7xl tabular-nums text-primary" aria-live="polite">{formatCountdown(remaining)}</p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full bg-primary transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
        {endsAt === null && (
          <button onClick={() => setEndsAt(Date.now() + total * 1000)} className={primaryBtn}>
            Começar pausa
          </button>
        )}
        {finished && <p className="text-center text-lg text-secondary-foreground">Pronto. Você esperou. Como está agora?</p>}
      </div>
      <div className="mt-auto space-y-3">
        <button disabled={saving} onClick={() => finish("manteve_decisao")} className={primaryBtn}>
          Estou mais calma, mantenho minha decisão
        </button>
        <button disabled={saving} onClick={() => finish("em_duvida")} className={secondaryBtn}>
          Ainda estou em dúvida
        </button>
        <Link to="/ajuda" className="flex min-h-12 items-center justify-center text-base text-muted-foreground underline">
          Preciso de ajuda
        </Link>
      </div>
    </section>
  );
}
