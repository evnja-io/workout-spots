import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import { Stars } from '~/components/ui/Stars'
import { Button } from '~/components/ui/Button'
import { useSubmitReview } from './mutations'
import { reviewSchema } from './schema'

export function ReviewForm({ spotId }: { spotId: string }) {
  const { t } = useTranslation()
  const { submit, pending } = useSubmitReview(spotId)

  const form = useForm({
    defaultValues: {
      rating: 0,
      text: '',
    },
    onSubmit: ({ value }) => {
      // Validate before submitting — rating must be >= 1
      const parsed = reviewSchema.safeParse(value)
      if (!parsed.success) return
      submit(parsed.data)
      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      style={{ marginTop: 12 }}
    >
      <form.Field name="rating">
        {(field) => (
          <div style={{ marginBottom: 8 }}>
            <label
              style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}
            >
              {t('review.ratingLabel')}
            </label>
            <Stars
              value={field.state.value}
              size={20}
              interactive
              onChange={(v) => field.handleChange(v)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="text">
        {(field) => (
          <div style={{ marginBottom: 8 }}>
            <textarea
              className="textarea"
              maxLength={1000}
              placeholder={t('review.placeholder')}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.values.rating, state.isSubmitting]}
      >
        {([rating, isSubmitting]) => {
          const canSubmit =
            typeof rating === 'number' && rating >= 1 && !isSubmitting && !pending
          return (
            <Button type="submit" variant="primary" disabled={!canSubmit}>
              {t('review.submit')}
            </Button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}
