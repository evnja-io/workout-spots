import { Link, useNavigate } from '@tanstack/react-router'
import { scrollToAnchor } from './hooks'

type Props = {
  /** Section id without the leading '#', e.g. "features". */
  id: string
  variant: 'landing' | 'page'
  className?: string
  children: React.ReactNode
}

/**
 * Links to an on-page section. On the landing page it smooth-scrolls (and moves
 * focus); on content pages it routes home to the matching section.
 */
export function SectionLink({ id, variant, className, children }: Props) {
  const navigate = useNavigate()
  if (variant === 'page') {
    return (
      <Link to="/" hash={id} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        scrollToAnchor(`#${id}`)
        void navigate({ to: '/', hash: id, replace: true })
      }}
    >
      {children}
    </a>
  )
}
