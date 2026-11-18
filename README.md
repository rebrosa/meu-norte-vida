# Meu Norte Vida

Build a mobile-first web app (PWA) in Brazilian Portuguese called "Reality Check". It is a private journal where people record episodes from a difficult relationship and write a letter explaining why they decided to leave. Use my EXISTING Supabase project (EU region) and its tables: profiles, decision_letters, episodes, relapse_events, chat_messages. Do not create a new Supabase project and do not change the schema.

SECURITY RULES (mandatory)
- Use only the Supabase publishable key in the frontend. Never use or ask for a service-role or secret key.
- All data access must rely on existing RLS policies. Do not disable RLS.
- No third-party analytics, trackers or ad SDKs.
- Neutral app name, icon and page titles. Never mention abuse, separation or relationship in browser titles or notifications.
- Add a "Apagar todos os meus dados" button that deletes the user account and all rows (cascade).

SCREENS FOR THIS FIRST VERSION
1. Login / sign up with email and password only.
2. Safety check: "Você está em perigo agora?" Yes -> crisis screen with Germany (110, 116 016, TelefonSeelsorge 0800 111 0 111) and Brazil (190, Ligue 180) contacts. No -> continue.
3. Home: greeting, days since separation, large coral button "Estou pensando em voltar", shortcuts "Registrar episódio" and "Minha decisão", small link "Preciso de ajuda" (opens crisis screen).
4. New episode: date, "O que aconteceu?", "Como me senti?", "O que eu quase fiz?", intensity 1-5, tags. Save to episodes.
5. My decision: "Por que decidi me afastar?" and "O que quero para minha vida?". Save to decision_letters (one per user, editable).
6. Relapse button flow: step 1 "Respire. Você não precisa decidir agora." with feeling selector (saudade, culpa, solidão, medo, esperança), saves to relapse_events; step 2 shows the user's own letter and their 3 highest-intensity episodes with dates; step 3 offers a 15-minute pause timer. (No AI chat yet.)

STYLE
Calm and warm. Background #FAF7F2, primary teal #2F6F73, sand #E8DCC8, single coral accent #D9694F for the relapse button, dark text #222B2E. Rounded corners, large readable type, 48px touch targets, bottom tab bar.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://meu-norte-vida.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ccc9c0f0-4561-497c-adaa-c42da3774afd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
