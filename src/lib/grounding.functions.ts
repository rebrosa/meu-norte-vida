import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Lang = "en" | "pt-BR" | "de";

function toLang(value: unknown): Lang {
  return value === "pt-BR" || value === "de" ? value : "en";
}

const LANGUAGE_LINE: Record<Lang, string> = {
  "pt-BR": "Responda em português do Brasil",
  en: "Responda em inglês, com linguagem simples e acolhedora",
  de: 'Responda em alemão (Deutsch), no tratamento informal "du"',
};

const EMERGENCY_LINE: Record<Lang, string> = {
  "pt-BR": "ligar 190 (Polícia Militar) ou Ligue 180 (Central de Atendimento à Mulher)",
  en: "ligar para o número de emergência local: na Europa, 112; na Alemanha, 110 (polícia) ou o Hilfetelefon 116 016 (gratuito, 24 horas); se ela estiver no Brasil, 190 ou 180",
  de: "ligar para o número de emergência local: na Europa, 112; na Alemanha, 110 (polícia) ou o Hilfetelefon 116 016 (gratuito, 24 horas); se ela estiver no Brasil, 190 ou 180",
};

function buildInstructions(lang: Lang) {
  return `Você é uma guia acolhedora de bem-estar emocional. A pessoa descreve o que está sentindo agora.
Sugira UM exercício de aterramento (grounding) personalizado, curto e prático, que ela possa fazer em 2 a 5 minutos, onde estiver.
${LANGUAGE_LINE[lang]}, com tom calmo e caloroso, sem julgamentos e sem diagnósticos.
Use princípios de TCC e cuidado informado por trauma: acolha emoções sem avaliar a pessoa, a veracidade ou a gravidade de um registro. Nunca atribua culpa, rótulos, notas ou diagnósticos; não interprete relatos como distorções cognitivas nem minimize o que aconteceu.
Quando houver um relato, trate-o como experiência da pessoa, não como pedido para julgar. Se for pertinente, convide gentilmente a distinguir um pensamento de uma emoção e escolher um pequeno cuidado agora, sem contestar fatos, justificar quem a machucou ou exigir uma visão positiva.
Priorize autonomia e estabilização no presente. Não peça para reviver lembranças, fazer exposição ao trauma ou detalhar acontecimentos. Não conduza processamento de trauma. Não prometa que a pessoa está segura nem ofereça cura ou substituição de psicoterapia.
Toda prática é opcional: ofereça olhos abertos, respiração natural sem prender o ar, e liberdade de parar se houver desconforto. Sugira observar objetos externos quando focar no corpo ou na respiração incomodar.
Formato:
- Uma frase curta validando o sentimento.
- Título do exercício.
- 3 a 6 passos numerados, simples e concretos (use os sentidos, a respiração ou o corpo).
- Uma frase final gentil.
- Inclua permissão para pausar; diga brevemente que o exercício não substitui acompanhamento psicológico.
Se a pessoa mencionar perigo imediato ou vontade de se machucar, comece dizendo para ${EMERGENCY_LINE[lang]}.
Não use markdown pesado; apenas texto simples com quebras de linha.`;
}

const MSG: Record<
  Lang,
  {
    short: string;
    long: string;
    unavailable: string;
    empty: string;
    rate: string;
    billing: string;
  }
> = {
  "pt-BR": {
    short: "Conte um pouco mais sobre como você está.",
    long: "Texto muito longo (máx. 2000 caracteres).",
    unavailable: "Serviço indisponível no momento.",
    empty: "Não foi possível gerar uma sugestão agora.",
    rate: "Muitas solicitações. Tente de novo em instantes.",
    billing: "O serviço de sugestões está temporariamente indisponível.",
  },
  en: {
    short: "Tell me a little more about how you're feeling.",
    long: "Text too long (max. 2000 characters).",
    unavailable: "Service unavailable right now.",
    empty: "We couldn't generate a suggestion right now.",
    rate: "Too many requests. Please try again in a moment.",
    billing: "The suggestion service is temporarily unavailable.",
  },
  de: {
    short: "Erzähl mir ein bisschen mehr darüber, wie es dir geht.",
    long: "Der Text ist zu lang (max. 2000 Zeichen).",
    unavailable: "Der Dienst ist im Moment nicht verfügbar.",
    empty: "Im Moment konnte kein Vorschlag erstellt werden.",
    rate: "Zu viele Anfragen. Bitte versuche es gleich noch einmal.",
    billing: "Der Vorschlagsdienst ist vorübergehend nicht verfügbar.",
  },
};

// Shown when the person reached the usage limit. A kind note plus a simple exercise that needs no AI.
const LIMIT_TEXT: Record<Lang, string> = {
  "pt-BR":
    "Você já usou todas as sugestões por agora. Tente de novo mais tarde. Enquanto isso, um exercício simples, que não precisa de nada: se for confortável, mantenha os olhos abertos e perceba o apoio dos pés. Olhe ao redor e nomeie três objetos e suas cores. Respire no seu ritmo, sem forçar. Se algo incomodar, pare. Se precisar de ajuda agora, abra “Preciso de ajuda”.",
  en: "You've used all your suggestions for now. Please try again later. In the meantime, a simple exercise that needs nothing: if it feels comfortable, keep your eyes open and notice the support of your feet. Look around and name three objects and their colors. Breathe at your own pace, without forcing it. If anything feels uncomfortable, stop. If you need help right now, open “I need help”.",
  de: "Du hast deine Vorschläge für den Moment aufgebraucht. Versuche es später noch einmal. In der Zwischenzeit eine einfache Übung, für die du nichts brauchst: Wenn es sich angenehm anfühlt, lass die Augen offen und spüre den Halt deiner Füße. Sieh dich um und benenne drei Gegenstände und ihre Farben. Atme in deinem eigenen Rhythmus, ohne Druck. Wenn etwas unangenehm wird, hör auf. Wenn du jetzt Hilfe brauchst, öffne „Ich brauche Hilfe“.",
};

type QuotaRpc = (fn: string) => Promise<{
  data: boolean | null;
  error: { message: string } | null;
}>;

/**
 * Asks the database whether this person may request one more suggestion.
 * Returns true (allowed), false (limit reached) or null (the check itself failed).
 * The generated types.ts does not know the function yet, so the call is typed loosely.
 */
async function consumeQuota(client: { rpc: unknown }): Promise<boolean | null> {
  const rpc = client.rpc as unknown as QuotaRpc;
  const { data, error } = await rpc.call(client, "consume_ai_quota");
  if (error) {
    console.error("ai quota error", error.message);
    return null;
  }
  return data === true;
}

export const suggestGrounding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { feeling: string; lang?: string }) => {
    const lang = toLang(input?.lang);
    const feeling = String(input?.feeling ?? "").trim();
    if (feeling.length < 3) throw new Error(MSG[lang].short);
    if (feeling.length > 2000) throw new Error(MSG[lang].long);
    return { feeling, lang };
  })
  .handler(async ({ data, context }) => {
    const msg = MSG[data.lang];
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { error: msg.unavailable as string, text: null };

    const allowed = await consumeQuota(context.supabase);
    if (allowed === null) return { error: msg.empty, text: null };
    if (!allowed) return { error: null, text: LIMIT_TEXT[data.lang] };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: buildInstructions(data.lang),
        messages: [{ role: "user", content: data.feeling }],
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = (await result.text).trim();
      if (!text) return { error: msg.empty, text: null };
      return { error: null, text };
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode;
      console.error("grounding error", status, err);
      if (status === 429) return { error: msg.rate, text: null };
      if (status === 402 || status === 403) return { error: msg.billing, text: null };
      return { error: msg.empty, text: null };
    }
  });
