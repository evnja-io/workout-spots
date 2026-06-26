/**
 * Version of the Terms of Service the user is agreeing to when they sign up.
 * Stored alongside the acceptance timestamp (public.users.terms_version /
 * terms_accepted_at) so a future terms change can identify stale acceptances.
 *
 * Keep this in sync with the "last updated" date shown on the /terms page
 * (`pages.terms` in i18n) whenever the terms text changes.
 */
export const TERMS_VERSION = '2026-06-26'
