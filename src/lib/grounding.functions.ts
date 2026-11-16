import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const INSTRUCTIONS = `Você é uma guia acolhedora de bem-estar emocional. A pessoa descreve o que está sentindo agora.
Sugira UM exercício de aterramento (grounding) personalizado, curto e prático, que ela possa fazer em 2 a 5 minutos, onde estiver.
Responda em português do Brasil, com tom calmo e caloroso, sem julgamentos e sem diagnósticos.
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
Se a pessoa mencionar perigo imediato ou vontade de se machucar, comece dizendo para ligar 190 (Polícia Militar) ou Ligue 180 (Central de Atendimento à Mulher).
Não use markdown pesado; apenas texto simples com quebras de linha.`;

export const suggestGrounding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { feeling: string }) => {
    const feeling = String(input?.feeling ?? "").trim();
    if (feeling.length < 3) throw new Error("Conte um pouco mais sobre como você está.");
    if (feeling.length > 2000) throw new Error("Texto muito longo (máx. 2000 caracteres).");
    return { feeling };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { error: "Serviço indisponível no momento." as string, text: null };

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
        instructions: INSTRUCTIONS,
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
      if (!text) return { error: "Não foi possível gerar uma sugestão agora.", text: null };
      return { error: null, text };
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode;
      console.error("grounding error", status, err);
      if (status === 429) return { error: "Muitas solicitações. Tente de novo em instantes.", text: null };
      if (status === 402 || status === 403)
        return { error: "O serviço de sugestões está temporariamente indisponível.", text: null };
      return { error: "Não foi possível gerar uma sugestão agora.", text: null };
    }
  });
