import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '~/components/ui/Modal'
import { Icon } from '~/components/ui/Icon'
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
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="modal-sm">
      <div className="modal-head">
        <h2 id={titleId}>{t('onboarding.title')}</h2>
        <button
          type="button"
          className="modal-close-btn"
          aria-label={t('onboarding.skip')}
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="modal-body auth-body">
        <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
          <p className="auth-subtitle">{t('onboarding.subtitle')}</p>
          <div className="field">
            <label htmlFor="onboarding-pseudo" className="field-label">
              {t('onboarding.nicknameLabel')}
            </label>
            <input
              id="onboarding-pseudo"
              className="input"
              type="text"
              value={pseudo}
              maxLength={MAX_PSEUDO}
              placeholder={t('onboarding.nicknamePlaceholder')}
              onChange={(e) => setPseudo(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={pending || !trimmed}
          >
            {t('onboarding.save')}
          </button>
          <button type="button" className="auth-skip" onClick={onClose}>
            {t('onboarding.skip')}
          </button>
        </form>
      </div>
    </Modal>
  )
}
