import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveOverlay } from '~/components/ui/ResponsiveOverlay'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { Textarea } from '~/components/ui/Field'
import { useReport, type ReportTargetType } from './mutations'

interface ReportDialogProps {
  open: boolean
  onClose: () => void
  targetType: ReportTargetType
  targetId: string
}

const MAX_REASON = 500

export function ReportDialog({ open, onClose, targetType, targetId }: ReportDialogProps) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')
  const { report, pending, success, reset } = useReport()

  const titleId = 'report-dialog-title'

  // Reset local + mutation state whenever the dialog opens for a fresh target.
  useEffect(() => {
    if (open) {
      setReason('')
      reset()
    }
  }, [open, targetType, targetId, reset])

  // After a successful report, briefly show confirmation then close.
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(onClose, 1500)
    return () => clearTimeout(timer)
  }, [success, onClose])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending || success) return
    report({ targetType, targetId, reason })
  }

  return (
    <ResponsiveOverlay open={open} onClose={onClose} labelledBy={titleId} desktopClassName="w-[440px]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
        <h2 id={titleId} className="m-0 text-[17px] font-semibold tracking-[-0.01em]">
          {t('report.title')}
        </h2>
        <button
          type="button"
          className="grid size-[30px] place-items-center rounded-[8px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text"
          aria-label={t('common.cancel')}
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto px-[22px] py-[18px]">
        {success ? (
          <p className="m-0 text-[13.5px] leading-[1.5] text-text-2">{t('report.success')}</p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Textarea
              value={reason}
              maxLength={MAX_REASON}
              placeholder={t('report.reasonPlaceholder')}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onClose}
                disabled={pending}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={pending}>
                {t('report.submit')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ResponsiveOverlay>
  )
}
