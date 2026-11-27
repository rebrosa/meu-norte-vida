<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- App data is read/written from the browser with the publishable-key client only, scoped by the existing per-user RLS policies; never use the service-role key or change the schema without the owner's approval (owner's security requirement).
- Data that has no column in the fixed schema (e.g. the separation date) is kept in the user's own auth `user_metadata`, so it follows the account and is never shared.
- Signed-in pages wrap their content in `AppShell` (bottom tab bar); focused flows (safety check, urge flow) render without it.
- Record reflection is opt-in, local component state only, and never edits or transmits journal entries; this preserves the fixed schema and the person's original words.
- The pause clock starts on entering its step and calculates remaining time from a wall-clock deadline, including tab focus/visibility changes, to avoid background timer drift.
- Account deletion goes through the `public.delete_my_account()` database function (security definer, only for `authenticated`). It removes the diary, the Community rows and the login; Community audit rows are kept anonymized (`actor_id` set to the nil UUID). The app asks the person to type a confirmation word first.
- New languages: all fixed interface text goes through `t()` from `src/lib/i18n.tsx` (Portuguese text is the key). Never translate personal writing. Entries and tags are stored in Portuguese and only displayed translated.
- Community stays hidden (`COMMUNITY_ENABLED = false` in `src/lib/features.ts`) and only shows a nickname or the first letter of the name.
- The "Respirar" AI is rate limited per person by the database function `public.consume_ai_quota()` (10 per hour, 30 per day; table `public.ai_usage` stores only user id and time, never the text). `suggestGrounding` calls it before the AI; over the limit it returns a kind message with a simple exercise, and if the check itself fails the request is refused. Change the limits in the SQL function, not in the client.
