// Fixed interface copy only. Never translate personal writing.
import {
  ALIAS_ERR_CONTACT,
  ALIAS_ERR_IDENTITY,
  ERR_ALIAS_LEN,
  ERR_BODY,
  ERR_GENERIC,
  ERR_SESSION,
  ERR_THEME,
  ERR_TITLE,
  PRIVACY_NOTE,
} from "@/lib/community-text";

type Entry = Partial<Record<"pt-BR" | "en" | "de", string>>;

export const communityTranslations: Record<string, Entry> = {
  "Estou pensando em me separar": {
    en: "I'm thinking about separating",
    de: "Ich denke darüber nach, mich zu trennen",
  },
  "Saudade e vontade de voltar": {
    en: "Longing and the urge to go back",
    de: "Sehnsucht und der Wunsch zurückzugehen",
  },
  "Filhos e mudanças na família": {
    en: "Children and family changes",
    de: "Kinder und Veränderungen in der Familie",
  },
  "Dinheiro, moradia e vida prática": {
    en: "Money, housing and practical life",
    de: "Geld, Wohnen und Alltagspraktisches",
  },
  "Limites e situações difíceis": {
    en: "Boundaries and difficult situations",
    de: "Grenzen und schwierige Situationen",
  },
  "Recomeços e pequenas conquistas": {
    en: "New beginnings and small wins",
    de: "Neuanfänge und kleine Erfolge",
  },
  Violência: { en: "Violence", de: "Gewalt" },
  "Violência psicológica": { en: "Psychological abuse", de: "Psychische Gewalt" },
  Filhos: { en: "Children", de: "Kinder" },
  "Pensamentos de se machucar": { en: "Thoughts of self-harm", de: "Gedanken an Selbstverletzung" },
  Luto: { en: "Grief", de: "Trauer" },
  Dinheiro: { en: "Money", de: "Geld" },
  "Me identifiquei": { en: "I relate to this", de: "Ich erkenne mich wieder" },
  "Obrigada por compartilhar": { en: "Thank you for sharing", de: "Danke fürs Teilen" },
  "Sua história me ajudou": { en: "Your story helped me", de: "Deine Geschichte hat mir geholfen" },
  "Exposição de dados pessoais": {
    en: "Personal data exposed",
    de: "Offenlegung persönlicher Daten",
  },
  "Assédio ou culpabilização": {
    en: "Harassment or blaming",
    de: "Belästigung oder Schuldzuweisung",
  },
  "Ameaça ou conteúdo de risco": {
    en: "Threat or risky content",
    de: "Drohung oder riskante Inhalte",
  },
  "Publicidade ou pedido de dinheiro": {
    en: "Advertising or requests for money",
    de: "Werbung oder Geldforderung",
  },
  "Outro motivo": { en: "Other reason", de: "Anderer Grund" },
  Rascunho: { en: "Draft", de: "Entwurf" },
  "Pendente de revisão": { en: "Pending review", de: "Wartet auf Prüfung" },
  Publicado: { en: "Published", de: "Veröffentlicht" },
  "Não aprovado": { en: "Not approved", de: "Nicht freigegeben" },
  Retirado: { en: "Withdrawn", de: "Zurückgezogen" },
  [ERR_TITLE]: {
    en: "The title must be between 3 and 120 characters.",
    de: "Der Titel muss zwischen 3 und 120 Zeichen lang sein.",
  },
  [ERR_BODY]: {
    en: "The text must be between 50 and 8000 characters.",
    de: "Der Text muss zwischen 50 und 8000 Zeichen lang sein.",
  },
  [ERR_ALIAS_LEN]: {
    en: "The nickname must be between 2 and 40 characters.",
    de: "Der Spitzname muss zwischen 2 und 40 Zeichen lang sein.",
  },
  [ERR_THEME]: { en: "Choose a topic.", de: "Wähle ein Thema." },
  [ERR_SESSION]: {
    en: "Your session has expired. Please sign in again.",
    de: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
  },
  [ERR_GENERIC]: {
    en: "We couldn't complete this right now.",
    de: "Das konnte gerade nicht abgeschlossen werden.",
  },
  [ALIAS_ERR_CONTACT]: {
    en: "Your nickname can't include an email, a website or long number sequences such as a phone number.",
    de: "Der Spitzname darf keine E-Mail-Adresse, Website oder langen Zahlenfolgen wie eine Telefonnummer enthalten.",
  },
  [ALIAS_ERR_IDENTITY]: {
    en: "Your nickname can't be your name or email. Choose another one or use only your initial.",
    de: "Der Spitzname darf nicht dein Name oder deine E-Mail-Adresse sein. Wähle einen anderen oder verwende nur den Anfangsbuchstaben.",
  },
  [PRIVACY_NOTE]: {
    en: "Avoid real names, addresses, contact details and information that could identify you, your children or others. A nickname or the first letter of your name does not guarantee anonymity.",
    de: "Vermeide echte Namen, Adressen, Kontaktdaten und Angaben, die dich, deine Kinder oder andere identifizieren könnten. Ein Spitzname oder der Anfangsbuchstabe deines Namens garantiert keine Anonymität.",
  },
  "Como seu nome aparece na comunidade": {
    en: "How your name appears in the community",
    de: "Wie dein Name in der Gemeinschaft erscheint",
  },
  "Usar um apelido": { en: "Use a nickname", de: "Einen Spitznamen verwenden" },
  "Usar só a inicial do meu nome": {
    en: "Use only the first letter of my name",
    de: "Nur den Anfangsbuchstaben meines Namens verwenden",
  },
  Apelido: { en: "Nickname", de: "Spitzname" },
  "Escolha um apelido que não revele seu nome, e-mail, cidade ou qualquer detalhe que identifique você.":
    {
      en: "Choose a nickname that doesn't reveal your name, email, city or any detail that could identify you.",
      de: "Wähle einen Spitznamen, der weder deinen Namen noch deine E-Mail-Adresse, deine Stadt oder andere identifizierende Angaben verrät.",
    },
  "Para usar a inicial, preencha seu nome na tela Conta.": {
    en: "To use your initial, add your name on the Account screen.",
    de: "Um deinen Anfangsbuchstaben zu verwenden, trage deinen Namen im Bereich Konto ein.",
  },
  "Assim vai aparecer:": { en: "It will appear like this:", de: "So wird es angezeigt:" },
  "Ainda não disponível": { en: "Not available yet", de: "Noch nicht verfügbar" },
  "Esta área é só para a moderação.": {
    en: "This area is for moderators only.",
    de: "Dieser Bereich ist nur für die Moderation.",
  },
  "Este espaço ainda está em preparação e será aberto com cuidado.": {
    en: "This space is still being prepared and will open with care.",
    de: "Dieser Bereich wird noch vorbereitet und mit Sorgfalt geöffnet.",
  },
};
