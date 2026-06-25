import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveOverlay } from '~/components/ui/ResponsiveOverlay'
import { Icon } from '~/components/ui/Icon'
import { Button } from '~/components/ui/Button'
import { Input, FieldLabel } from '~/components/ui/Field'
import { useUpdatePseudo } from './profile'

interface OnboardingModalProps {
  open: boolean
  /** Dismiss without saving (skip / backdrop / escape). */
  onClose: () => void
  /** Called after the pseudo is successfully saved. */
  onSaved: () => void
}

const MAX_PSEUDO = 100

export function OnboardingModal({ open, onClose, onSaved }: OnboardingModalProps) {
  const { t } = useTranslation()
  const [pseudo, setPseudo] = useState('')
  const { updatePseudo, pending } = useUpdatePseudo()

  const titleId = 'onboarding-modal-title'
  const trimmed = pseudo.trim()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!trimmed) return
    try {
      await updatePseudo(trimmed.slice(0, MAX_PSEUDO))
      onSaved()
    } catch {
      // Saving failed (e.g. RLS not applied yet) — keep the modal open so the
      // user can retry rather than silently losing their input.
    }
  }

  return (
    <ResponsiveOverlay open={open} onClose={onClose} labelledBy={titleId} desktopClassName="w-[440px]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
        <h2 id={titleId} className="m-0 text-[17px] font-semibold tracking-[-0.01em]">
          {t('onboarding.title')}
        </h2>
        <button
          type="button"
          className="grid size-[30px] place-items-center rounded-[8px] text-text-3 transition-colors duration-150 hover:bg-surface-2 hover:text-text"
          aria-label={t('onboarding.skip')}
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto px-[22px] py-[18px]">
        <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
          <p className="m-0 text-[13.5px] leading-[1.5] text-text-3">{t('onboarding.subtitle')}</p>
          <div>
            <FieldLabel htmlFor="onboarding-pseudo">{t('onboarding.nicknameLabel')}</FieldLabel>
            <Input
              id="onboarding-pseudo"
              type="text"
              value={pseudo}
              maxLength={MAX_PSEUDO}
              placeholder={t('onboarding.nicknamePlaceholder')}
              onChange={(e) => setPseudo(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" variant="primary" className="w-full flex-none" disabled={pending || !trimmed}>
            {t('onboarding.save')}
          </Button>
          <button
            type="button"
            className="cursor-pointer self-center border-none bg-none p-0 text-[13px] text-text-3 underline hover:text-text-2"
            onClick={onClose}
          >
            {t('onboarding.skip')}
          </button>
        </form>
      </div>
    </ResponsiveOverlay>
  )
}
