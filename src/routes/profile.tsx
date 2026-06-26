import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession, useSessionContext } from '~/features/auth/session'
import {
  currentUserProfileQueryOptions,
  uploadAvatar,
  useUpdateProfile,
} from '~/features/auth/profile'
import { validateImage } from '~/features/add-spot/photos'
import { Button } from '~/components/ui/Button'
import { Input, FieldLabel, FieldHint } from '~/components/ui/Field'
import { Switch } from '~/components/ui/Switch'
import { Icon } from '~/components/ui/Icon'
import { ErrorState } from '~/components/ErrorState'

const MAX_PSEUDO = 100

function ProfileError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState
      title={t('common.errorTitle')}
      message={t('common.errorMessage')}
      onRetry={reset}
    />
  )
}

function ProfilePending() {
  return <div className="px-5 py-10 text-center text-[13px] text-text-3" aria-busy="true" />
}

export const Route = createFileRoute('/profile')({
  pendingComponent: ProfilePending,
  errorComponent: ProfileError,
  component: ProfilePage,
})

function ProfilePage() {
  const { t } = useTranslation()
  const { userId, status } = useSession()
  const { openSignIn } = useSessionContext()

  const { data: profile } = useQuery({
    ...currentUserProfileQueryOptions(userId),
    enabled: status === 'authed' && !!userId,
  })

  const { updateProfile, pending } = useUpdateProfile()

  const [pseudo, setPseudo] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [marketingEmail, setMarketingEmail] = useState(false)
  const [partnerOffers, setPartnerOffers] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Seed the nickname field once the profile loads.
  useEffect(() => {
    if (profile?.pseudo != null) setPseudo(profile.pseudo)
  }, [profile?.pseudo])

  // Seed the communication toggles from the loaded profile.
  useEffect(() => {
    if (!profile) return
    setMarketingEmail(profile.marketingEmailOptIn)
    setPartnerOffers(profile.partnerOffersOptIn)
  }, [profile])

  // Toggles save immediately; revert local state if the write fails.
  function handleToggleMarketing(value: boolean) {
    setMarketingEmail(value)
    void updateProfile({ marketingEmailOptIn: value }).catch(() => setMarketingEmail(!value))
  }
  function handleTogglePartners(value: boolean) {
    setPartnerOffers(value)
    void updateProfile({ partnerOffersOptIn: value }).catch(() => setPartnerOffers(!value))
  }

  // Revoke object URLs to avoid leaks when the preview changes/unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = validateImage(file)
    if (!result.ok) {
      setFileError(t('profile.avatarInvalid'))
      setSelectedFile(null)
      return
    }
    setFileError(null)
    setSaved(false)
    setSelectedFile(file)
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!userId) return
    setSaveError(false)
    setSaved(false)
    const trimmed = pseudo.trim().slice(0, MAX_PSEUDO)
    try {
      let profilePictureUrl: string | undefined
      if (selectedFile) {
        setUploading(true)
        const url = await uploadAvatar(selectedFile, userId)
        setUploading(false)
        if (url) profilePictureUrl = url
      }
      await updateProfile({
        ...(trimmed ? { pseudo: trimmed } : {}),
        ...(profilePictureUrl ? { profilePictureUrl } : {}),
      })
      setSelectedFile(null)
      setSaved(true)
    } catch {
      setUploading(false)
      setSaveError(true)
    }
  }

  if (status === 'loading') {
    return <div className="h-screen" />
  }

  if (status === 'anon') {
    return (
      <div className="mx-auto flex h-screen max-w-[680px] flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">{t('profile.title')}</h1>
        <p className="text-[13px] text-text-3">{t('auth.required')}</p>
        <Button type="button" variant="primary" onClick={openSignIn}>
          {t('auth.signInTitle')}
        </Button>
      </div>
    )
  }

  const shownAvatar = previewUrl ?? profile?.profilePictureUrl ?? null
  const trimmedPseudo = pseudo.trim()

  return (
    <div className="mx-auto flex h-screen max-w-[680px] flex-col overflow-hidden p-6">
      <h1 className="mb-4 text-[20px] font-semibold tracking-[-0.01em]">{t('profile.title')}</h1>

      <form className="flex flex-col gap-5 overflow-y-auto pb-5" onSubmit={(e) => void handleSubmit(e)}>
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#FB7A1E,#E11D48)] text-[22px] font-semibold text-white">
            {shownAvatar ? (
              <img src={shownAvatar} alt="" className="size-full object-cover" />
            ) : trimmedPseudo ? (
              trimmedPseudo.charAt(0).toUpperCase()
            ) : (
              <Icon name="user" size={26} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="image" size={16} />
              {t('profile.changeAvatar')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickFile}
            />
            {fileError ? (
              <FieldHint className="text-[#dc2626]">{fileError}</FieldHint>
            ) : (
              <FieldHint>{t('profile.avatarHint')}</FieldHint>
            )}
          </div>
        </div>

        {/* Nickname */}
        <div>
          <FieldLabel htmlFor="profile-pseudo">{t('profile.nicknameLabel')}</FieldLabel>
          <Input
            id="profile-pseudo"
            type="text"
            value={pseudo}
            maxLength={MAX_PSEUDO}
            placeholder={t('onboarding.nicknamePlaceholder')}
            onChange={(e) => {
              setPseudo(e.target.value)
              setSaved(false)
            }}
          />
        </div>

        {/* Communications */}
        <div className="flex flex-col gap-3 border-t border-border pt-5">
          <h2 className="text-[13px] font-semibold text-text-2">
            {t('profile.communications.title')}
          </h2>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-text-2">
              {t('profile.communications.marketingEmail')}
            </span>
            <Switch
              on={marketingEmail}
              onChange={handleToggleMarketing}
              label={t('profile.communications.marketingEmail')}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-text-2">
              {t('profile.communications.partnerOffers')}
            </span>
            <Switch
              on={partnerOffers}
              onChange={handleTogglePartners}
              label={t('profile.communications.partnerOffers')}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={pending || uploading || (!trimmedPseudo && !selectedFile)}
          >
            {pending || uploading ? t('editSpot.saving') : t('common.save')}
          </Button>
          {saved && <span className="text-[13px] text-text-3">{t('profile.saved')}</span>}
          {saveError && <span className="text-[13px] text-[#dc2626]">{t('profile.saveError')}</span>}
        </div>
      </form>
    </div>
  )
}
