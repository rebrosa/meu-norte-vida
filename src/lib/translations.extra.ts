// Fixed interface copy only. Never translate personal writing.
// Entries here are merged over src/lib/translations.ts.
type Entry = Partial<Record<"pt-BR" | "en" | "de", string>>;

export const FEEDBACK_BODY =
  "Queremos saber o que te ajuda, o que te atrapalha e o que falta. O formulário abre em outro site e está em inglês, mas você pode escrever sua resposta em português.";

export const CONFIDENTIAL_BODY =
  "Seus registros, sua carta e suas pausas ficam guardados na sua conta e não são mostrados a outras usuárias. Só o que você enviar para a Comunidade, depois de aprovado pela moderação, pode ser lido por outras mulheres no app. Proteger sua senha é responsabilidade sua: use um aparelho de confiança, pois quem entrar na sua conta poderá ler tudo o que você escreveu. Ao terminar, saia da conta.";

export const PASSWORD_NOTE =
  "Escolha uma senha que só você saiba, com 10 caracteres ou mais, e não use a mesma senha em outros lugares. Protegê-la é responsabilidade sua: quem souber sua senha poderá ler tudo o que você escrever aqui.";
export const PASSWORD_SHORT_HINT =
  "Essa senha funciona, mas uma com 10 caracteres ou mais protege melhor o seu diário.";
export const PASSWORD_OK_HINT = "Ótimo: 10 caracteres ou mais.";

export const AUTH_ERR_WEAK =
  "Senha fraca demais. Use pelo menos 6 caracteres; recomendamos 10 ou mais.";
export const AUTH_ERR_EMAIL = "Esse e-mail não parece válido. Confira e tente de novo.";
export const AUTH_ERR_RATE = "Muitas tentativas. Espere um pouco e tente de novo.";
export const AUTH_ERR_GENERIC =
  "Não foi possível criar a conta. Confira os dados ou, se você já tem conta, tente entrar.";

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
    en: "Choose a password only you know, with 10 characters or more, and don't reuse it anywhere else. Protecting it is your responsibility: anyone who knows your password can read everything you write here.",
    de: "Wähle ein Passwort, das nur du kennst, mit mindestens 10 Zeichen, und verwende es nirgendwo sonst. Der Schutz liegt in deiner Verantwortung: Wer dein Passwort kennt, kann alles lesen, was du hier schreibst.",
  },
  [PASSWORD_SHORT_HINT]: {
    en: "This password works, but one with 10 characters or more protects your journal better.",
    de: "Dieses Passwort funktioniert, aber eines mit mindestens 10 Zeichen schützt dein Tagebuch besser.",
  },
  [PASSWORD_OK_HINT]: {
    en: "Great: 10 characters or more.",
    de: "Sehr gut: mindestens 10 Zeichen.",
  },
  [AUTH_ERR_WEAK]: {
    en: "That password is too weak. Use at least 6 characters; we recommend 10 or more.",
    de: "Dieses Passwort ist zu schwach. Verwende mindestens 6 Zeichen, besser 10 oder mehr.",
  },
  [AUTH_ERR_EMAIL]: {
    en: "That email doesn't look valid. Please check it and try again.",
    de: "Diese E-Mail-Adresse scheint ungültig zu sein. Bitte prüfe sie und versuche es erneut.",
  },
  [AUTH_ERR_RATE]: {
    en: "Too many attempts. Please wait a moment and try again.",
    de: "Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.",
  },
  [AUTH_ERR_GENERIC]: {
    en: "We couldn't create your account. Please check your details or, if you already have an account, try signing in.",
    de: "Dein Konto konnte nicht erstellt werden. Bitte prüfe deine Angaben oder melde dich an, falls du schon ein Konto hast.",
  },
  saudade: { en: "longing", de: "Sehnsucht" },
  culpa: { en: "guilt", de: "Schuldgefühl" },
  solidão: { en: "loneliness", de: "Einsamkeit" },
  medo: { en: "fear", de: "Angst" },
  esperança: { en: "hope", de: "Hoffnung" },
  ciúme: { en: "jealousy", de: "Eifersucht" },
  controle: { en: "control", de: "Kontrolle" },
  gritos: { en: "yelling", de: "Anschreien" },
  humilhação: { en: "humiliation", de: "Demütigung" },
  isolamento: { en: "isolation", de: "Isolation" },
  dinheiro: { en: "money", de: "Geld" },
  mentira: { en: "lying", de: "Lügen" },
  ameaça: { en: "threats", de: "Drohungen" },
  "Intensidade {value} de 5": { en: "Intensity {value} of 5", de: "Intensität {value} von 5" },
  "Tempo restante da pausa": { en: "Time left in the pause", de: "Verbleibende Zeit der Pause" },
  "Progresso da pausa": { en: "Pause progress", de: "Fortschritt der Pause" },
  "Os 15 minutos terminaram. Como você está agora?": {
    en: "The 15 minutes are over. How are you feeling now?",
    de: "Die 15 Minuten sind vorbei. Wie geht es dir jetzt?",
  },
  "Sua pausa está em andamento. Um momento de cada vez.": {
    en: "Your pause is in progress. One moment at a time.",
    de: "Deine Pause läuft. Ein Moment nach dem anderen.",
  },
  "Se for confortável, mantenha os olhos abertos e perceba o apoio dos pés. Olhe ao redor e nomeie três objetos e suas cores. Respire no seu ritmo, sem forçar. Se algo incomodar, pare.":
    {
      en: "If it feels comfortable, keep your eyes open and notice the support of your feet. Look around and name three objects and their colors. Breathe at your own pace, without forcing it. If anything feels uncomfortable, stop.",
      de: "Wenn es sich angenehm anfühlt, lass die Augen offen und spüre den Halt deiner Füße. Sieh dich um und benenne drei Gegenstände und ihre Farben. Atme in deinem eigenen Rhythmus, ohne Druck. Wenn etwas unangenehm wird, hör auf.",
    },
  "Tudo bem parar. Você não precisa reler o registro. Perceba onde está agora e escolha o que traz um pouco de conforto.":
    {
      en: "It's okay to stop. You don't need to reread the entry. Notice where you are right now and choose what brings a little comfort.",
      de: "Es ist in Ordnung, aufzuhören. Du musst den Eintrag nicht noch einmal lesen. Nimm wahr, wo du gerade bist, und wähle, was dir ein wenig Trost gibt.",
    },
  "Retomar, se eu quiser": { en: "Resume, if I want to", de: "Fortsetzen, wenn ich möchte" },
  "Um olhar gentil · TCC": { en: "A gentle perspective · CBT", de: "Ein sanfter Blick · KVT" },
  "Um pensamento pode surgir junto de uma emoção, sem definir quem você é. Olhar para ele com cuidado não apaga o que aconteceu nem justifica atitudes que machucaram você.":
    {
      en: "A thought can arise together with an emotion without defining who you are. Looking at it with care doesn't erase what happened or justify actions that hurt you.",
      de: "Ein Gedanke kann zusammen mit einem Gefühl auftauchen, ohne zu bestimmen, wer du bist. Ihn achtsam zu betrachten löscht nicht aus, was geschehen ist, und rechtfertigt keine Handlungen, die dich verletzt haben.",
    },
  "Que pensamento apareceu e que emoção veio com ele?": {
    en: "What thought came up, and what emotion came with it?",
    de: "Welcher Gedanke ist aufgetaucht, und welches Gefühl kam dazu?",
  },
  "O que eu diria a alguém querido que tivesse vivido isso?": {
    en: "What would I say to someone I love who had been through this?",
    de: "Was würde ich einem lieben Menschen sagen, der das erlebt hat?",
  },
  "Do que preciso agora? Qual pequeno cuidado posso escolher?": {
    en: "What do I need right now? What small act of care can I choose?",
    de: "Was brauche ich jetzt? Welche kleine Wohltat kann ich mir gönnen?",
  },
  "Reflexão opcional e temporária: não é salva nem enviada à inteligência artificial. Seu registro permanece como você escreveu.":
    {
      en: "Optional, temporary reflection: it is not saved or sent to artificial intelligence. Your entry stays exactly as you wrote it.",
      de: "Freiwillige, vorübergehende Reflexion: Sie wird weder gespeichert noch an künstliche Intelligenz gesendet. Dein Eintrag bleibt so, wie du ihn geschrieben hast.",
    },
  "Prefiro pausar": { en: "I'd rather pause", de: "Ich möchte lieber pausieren" },
  "Este acolhimento não faz diagnósticos e não substitui acompanhamento psicológico.": {
    en: "This support does not provide diagnoses and does not replace psychological care.",
    de: "Diese Begleitung stellt keine Diagnosen und ersetzt keine psychologische Betreuung.",
  },
};
