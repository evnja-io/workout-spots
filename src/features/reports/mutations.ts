import { useMutation } from '@tanstack/react-query'
import { useSession } from '~/features/auth/session'
import { useAuthGate } from '~/features/auth/useAuthGate'
import { getBrowserSupabase, isSupabaseConfigured } from '~/lib/supabase/browser'
import { trackEvent } from '~/features/analytics/gtag'

export type ReportTargetType = 'spot' | 'comment'

export interface ReportInput {
  targetType: ReportTargetType
  targetId: string
  reason?: string
}

export function useReport(): {
  report: (input: ReportInput) => void
  pending: boolean
  success: boolean
  reset: () => void
} {
  const { userId } = useSession()
  const gate = useAuthGate()

  const mutation = useMutation({
    mutationFn: async (input: ReportInput) => {
      if (!userId) throw new Error('Not authenticated')
      if (!isSupabaseConfigured()) return
      const supabase = getBrowserSupabase()
      const { error } = await supabase.from('reports').insert({
        target_type: input.targetType,
        target_id: input.targetId,
        reporter_id: userId,
        reason: input.reason?.trim() || null,
      })
      if (error) throw error
      trackEvent('report_submitted', { target_type: input.targetType })
    },
  })

  const report = (input: ReportInput) => {
    gate(() => mutation.mutate(input))
  }

  return {
    report,
    pending: mutation.isPending,
    success: mutation.isSuccess,
    reset: mutation.reset,
  }
}
