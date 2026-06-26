# Supabase auth email templates

Dark-themed Workout Spots email templates, imported from the Claude Design project
**"Workout spots"** (`Email Templates.html`). Each file is a self-contained HTML body
ready to paste into the Supabase dashboard — all styles are inlined and the Supabase
Go template variables (`{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}`,
`{{ .NewEmail }}`) are already in place.

## How to apply

Supabase Dashboard → **Authentication → Emails → Templates**. Pick the template,
paste the matching file's full contents into the **Message body** field, set a
**Subject**, and save.

| File | Dashboard template | Variables used | Suggested subject |
|------|--------------------|----------------|-------------------|
| `confirm-signup.html` | Confirm signup | `.ConfirmationURL`, `.Token` | Confirm your email |
| `invite-user.html` | Invite user | `.ConfirmationURL` | You're invited to Workout Spots |
| `magic-link.html` | Magic Link | `.ConfirmationURL`, `.Token` | Your magic link |
| `change-email-address.html` | Change Email Address | `.ConfirmationURL`, `.Token`, `.Email`, `.NewEmail` | Confirm your new email |

## Notes

- **Self-hosted / config-as-code:** these map to the `[auth.email.template.*]` entries
  in `supabase/config.toml` (`content_path`) if you manage templates that way instead of
  the dashboard.
- **`{{ .Token }}` (OTP code):** shown in confirm-signup, magic-link, and
  change-email-address. It only renders a code if the OTP/code flow is enabled; with
  pure link flows the button/`.ConfirmationURL` still works on its own.
- **Fonts:** the Google Fonts `<link>` is ignored by most email clients and falls back
  to Arial/system fonts — expected and safe.
- **Images:** the logo loads from `https://spots.evnja.gg/favicon-512.png`. Keep that URL
  publicly reachable so the header icon renders.
- Reset Password and Reauthentication are **not** included (only the 4 designed templates
  were requested); those two keep Supabase's default styling.
