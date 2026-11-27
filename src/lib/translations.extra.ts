// Fixed interface copy only. Never translate personal writing.
// Entries here are merged over src/lib/translations.ts.
type Entry = Partial<Record<"pt-BR" | "en" | "de", string>>;

export const FEEDBACK_BODY =
  "Queremos saber o que te ajuda, o que te atrapalha e o que falta. O formulário abre em outro site e está em inglês, mas você pode escrever sua resposta em português.";

export const CONFIDENTIAL_BODY =
  "Seus registros, sua carta e suas pausas ficam guardados na sua conta e não são mostrados a outras usuárias. Só o que você enviar para a Comunidade, depois de aprovado pela moderação, pode ser lido por outras mulheres no app. Proteger sua senha é responsabilidade sua: use um aparelho de confiança, pois quem entrar na sua conta poderá ler tudo o que você escreveu. Ao terminar, saia da conta.";

export const PASSWORD_NOTE =
  "Escolha uma senha que só você conheça. Protegê-la é responsabilidade sua: quem souber sua senha poderá ler tudo o que você escrever aqui.";

export const extraTranslations: Record<string, Entry> = {
  Idioma: { en: "Language", de: "Sprache" },
  "Sua opinião importa": { en: "Your opinion matters", de: "Deine Meinung zählt" },
  [FEEDBACK_BODY]: {
    en: "We want to know what helps you, what gets in your way and what is missing. The form opens on another website and is in English, but you can write your answer in your own language.",
    de: "Wir möchten wissen, was dir hilft, was dich stört und was fehlt. Das Formular öffnet sich auf einer anderen Website und ist auf Englisch, aber du kannst deine Antwort in deiner eigenen Sprache schreiben.",
  },
  "Não inclua nomes, contatos ou trechos do seu diário.": {
    en: "Please don't include names, contact details or excerpts from your journal.",
    de: "Bitte gib keine Namen, Kontaktdaten oder Auszüge aus deinem Tagebuch an.",
  },
  "Enviar feedback": { en: "Send feedback", de: "Feedback senden" },
  "(abre em uma nova aba)": { en: "(opens in a new tab)", de: "(öffnet in einem neuen Tab)" },
  [CONFIDENTIAL_BODY]: {
    en: "Your entries, letter and pauses are stored in your account and are not shown to other users. Only what you submit to the Community, once approved by moderators, can be read by other women in the app. Protecting your password is your responsibility: use a device you trust, because anyone who signs in to your account can read everything you wrote. Sign out when you are done.",
    de: "Deine Einträge, dein Brief und deine Pausen werden in deinem Konto gespeichert und anderen Nutzerinnen nicht angezeigt. Nur was du in die Gemeinschaft einreichst, kann nach der Freigabe durch die Moderation von anderen Frauen in der App gelesen werden. Der Schutz deines Passworts liegt in deiner Verantwortung: Nutze ein Gerät, dem du vertraust, denn wer sich in dein Konto einloggt, kann alles lesen, was du geschrieben hast. Melde dich ab, wenn du fertig bist.",
  },
  [PASSWORD_NOTE]: {
    en: "Choose a password only you know. Protecting it is your responsibility: anyone who knows your password can read everything you write here.",
    de: "Wähle ein Passwort, das nur du kennst. Der Schutz liegt in deiner Verantwortung: Wer dein Passwort kennt, kann alles lesen, was du hier schreibst.",
  },
};
