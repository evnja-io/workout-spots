import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { isSupabaseConfigured } from '~/lib/supabase/browser'
import { unsubscribeByToken } from '~/features/auth/unsubscribe'

// Lenient: a malformed link must render the page, never 500. Unknown `type`
// falls back to turning off both streams.
const unsubscribeSearchSchema = z.object({
  token: z.string().optional().catch(undefined),
  type: z.enum(['marketing_email', 'partner_offers', 'all']).catch('all'),
})

export const Route = createFileRoute('/unsubscribe')({
  validateSearch: unsubscribeSearchSchema,
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const { t } = useTranslation()
  const { token, type } = Route.useSearch()

  const { data, isError } = useQuery({
    queryKey: ['unsubscribe', token, type],
    enabled: !!token && isSupabaseConfigured(),
    queryFn: () => unsubscribeByToken(token as string, type),
    retry: false,
    staleTime: Infinity,
  })

  let title: string
  let message: string
  if (!token) {
    title = t('unsubscribe.invalidTitle')
    message = t('unsubscribe.invalid')
  } else if (isError) {
    title = t('unsubscribe.errorTitle')
    message = t('unsubscribe.error')
  } else if (data === undefined) {
    title = t('unsubscribe.workingTitle')
    message = t('unsubscribe.working')
  } else if (data) {
    title = t('unsubscribe.successTitle')
    message = t('unsubscribe.success')
  } else {
    title = t('unsubscribe.invalidTitle')
    message = t('unsubscribe.notFound')
  }

  return (
    <div className="mx-auto flex h-screen max-w-[480px] flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-[20px] font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="text-[14px] leading-[1.5] text-text-2">{message}</p>
    </div>
  )
}
