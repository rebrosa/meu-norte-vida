# Roadmap

> Arquivo central de features e backlog. Mantém o conteúdo anterior e acrescenta o histórico do git e as pendências discutidas no projeto.

## Prioridade alta
- [ ] IA do Acalmar/Respirar no Cloudflare, independente do Lovable (decisão de 27/11/2026): hoje a função lê LOVABLE_API_KEY (src/lib/grounding.functions.ts), chave que só existe dentro do Lovable e é cobrada nos créditos dele. Motivo: deixar o app mais confiável e não depender de um plano pago do Lovable, que ainda não está decidido. Passos: (1) escolher o provedor (OpenAI, Gemini ou Claude); (2) trocar a chamada em grounding.functions.ts pelo provedor escolhido e aproveitar para trocar inputValidator() (obsoleto, aviso no build, linha 105) por validator(); (3) cadastrar a chave como Secret no Worker realitycheck, junto com SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY e SUPABASE_SERVICE_ROLE_KEY; (4) novo deploy e teste do Acalmar em janela anônima. Enquanto isso, o Lovable (meu-norte-vida.lovable.app) segue como endereço principal e o Cloudflare como alternativo, sem o Acalmar funcionando.

## Em andamento
- [ ] Add German and English versions with a language selector, preserving original personal writing and Brazilian crisis contacts. (Parcialmente entregue: ver "Concluído" > i18n; falta revisar a cobertura de todas as telas e a preservação dos textos pessoais.)
- [ ] Test account: sign up, confirm, save episode + letter, verify only that user sees them (blocked: external Supabase has no managed test session)

## Concluído
- [x] Add optional nonjudgmental CBT reflection and trauma-informed grounding for records.
- [x] Make the 15-minute pause count down and display actual remaining time.
- [x] Community v1 screens (disabled for real users until review).
- [x] Fluxo de exercício de aterramento (grounding) e tela Respirar (nov/2026).
- [x] Conexão com projeto Supabase externo, login e salvamento de registros.
- [x] i18n EN/PT/DE com seletor de idioma, idioma padrão inglês, contatos de emergência, confidencialidade e feedback traduzidos; Respirar com IA por idioma.
- [x] Comunidade: apelido ou só a inicial do nome; mural, relato, meus relatos e moderação traduzidos.
- [x] Formulário de feedback (prévia local e link para formulário externo Tally).
- [x] Apagar a conta inteira (delete_my_account) com confirmação por palavra.
- [x] Limite de uso da IA do Respirar: 10 por hora e 30 por dia, por pessoa.
- [x] Aviso de senha com 10+ caracteres no cadastro.
- [x] Publicação na Cloudflare ligada ao repositório meu-norte-vida (build a cada commit na main), em https://realitycheck.rebrosa.workers.dev — nome neutro e adequado para as três línguas (EN/PT/DE). Atualização de 27/11: passa a ser o endereço alternativo; o Acalmar ainda não funciona nele (ver Prioridade alta).
- [x] Decisão de 27/11/2026: o Lovable (https://meu-norte-vida.lovable.app) volta a ser o endereço principal; README atualizado.
- [x] Worker antigo meu-norte apagado no Cloudflare (27/11/2026).
- [x] Supabase: Site URL e Redirect URLs atualizados (27/11/2026).
- [x] PRs nº 1 a 4 mesclados na main em 27/11/2026 (feedback em prévia, i18n, exclusão de conta, limite de IA).
- [x] Verificações automáticas na feat/ai-limit em 27/11/2026: 22 de 22 testes, tsc sem erros, lint com 0 erros e 9 avisos, build concluído.
- [x] Lista de 10 cenários de teste manual criada em docs/mvp-test-scenarios.md (27/11/2026).

## Backlog de produto
- [ ] Comunidade “Você não está sozinha”: revisar segurança e capacidade de moderação; começar com relatos moderados e avaliar um fórum interativo depois.
- [ ] Apelidos na comunidade: exibir um apelido em vez do nome real; não prometer anonimato absoluto. (Primeira versão entregue com apelido ou inicial; revisar o texto de privacidade.)
- [ ] Artigos sobre filhos e separação: como conversar com eles e apoiá-los nessa fase.
- [ ] Apoio profissional: reunir links para OAB e Vittude.
- [ ] Segurança e emergência: orientar para canais oficiais. Avaliar compartilhamento de localização com a polícia apenas como etapa futura, condicionada à viabilidade e à parceria institucional.
- [ ] Monetização: avaliar freemium mantendo o núcleo gratuito, testar a hipótese de R$ 24,90/mês e considerar um piloto institucional patrocinado.
- [ ] Feedback das usuárias: canal opcional para saber o que ajuda, o que atrapalha e o que falta no app.
- [ ] Chat de reflexão com RAG sobre os registros da própria pessoa (Edge Function no servidor, chave da LLM só no backend; sem diagnóstico do parceiro e sem decidir pela pessoa).
- [ ] Recursos de ajuda por país (Alemanha e Brasil) com seleção de país na tela de ajuda.
- [ ] Pesquisa com possíveis usuárias: usar o roteiro v2 (Google Drive).

### Feedback das usuárias — proposta para o piloto
- Disponibilizar “Enviar feedback” nas configurações. Considerar convites em outros momentos só após testar o fluxo, sem interromper a escrita nem enviar notificações insistentes.
- Oferecer avaliação rápida de 1 a 5, comentário opcional e categorias Ideia, Problema e Elogio.
- Permitir envio sem pedir nome ou e-mail. Não anexar conteúdo do diário nem vincular o feedback ao histórico pessoal. Explicar o que é coletado e para quê, e orientar a não incluir dados pessoais no texto.
- Agradecer após o envio e disponibilizar uma visão restrita à equipe responsável, com filtro por categoria.
- Prioridade sugerida: média, para o piloto com as primeiras usuárias. Validar com um formulário simples antes de investir em um painel próprio.

## Segurança e privacidade (antes de usuárias reais)
- [ ] Verificar RLS ativa e políticas em todas as tabelas (profiles, decision_letters, episodes, relapse_events, chat_messages) e testar isolamento entre duas contas, inclusive nas requisições diretas ao banco.
- [ ] Confirmar região do projeto Supabase na UE (Frankfurt).
- [ ] Revisar o arquivo .env versionado no repositório público: manter somente valores públicos (URL e chave publishable); nunca service-role, secret ou senha do banco.
- [ ] Revisão por psicóloga(o) dos textos sensíveis e por especialista em proteção de dados (LGPD/GDPR).
- [ ] Nome, ícone e títulos neutros; sem rastreadores ou analytics de terceiros.
- [ ] Política de privacidade: citar que o texto do Respirar vai para um serviço de IA externo e a regra de exclusão de conta.

## Ajustes de interface e texto
- [ ] Tela de ajuda: diferenciar 190 (emergência ou perigo imediato) de 180 (orientação e denúncia, gratuito, 24 horas).
- [ ] Novo registro: trocar “O que eu quase fiz?” por “Senti vontade de fazer algo? (opcional)” e indicar que os marcadores são opcionais.
- [ ] Verificar quando o botão “Salvar registro” fica habilitado e quais campos são obrigatórios.
- [ ] Mostrar o acesso “Preciso de ajuda” também na home.
- [ ] Mensagem amigável quando o exercício do Respirar falhar; nunca exibir erro técnico (ex.: variáveis do Supabase ausentes) à usuária. Em 27/11 o erro de SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY apareceu no Cloudflare, porque o Worker realitycheck não tem variáveis cadastradas; no Lovable elas já existem.

## Infraestrutura e testes
- [ ] Desativar ou apagar o repositório cópia meu-norte, se não for mais usado (o Worker antigo já foi apagado).
- [ ] Testar login e navegação das rotas públicas (/ e /seguranca) e do fluxo logado nos dois endereços (Lovable e Cloudflare), após a atualização das URLs do Supabase.
- [ ] Cenários de teste: executar os 10 cenários de docs/mvp-test-scenarios.md e preencher a coluna Resultado (lista criada em 27/11/2026; nenhum executado ainda).
