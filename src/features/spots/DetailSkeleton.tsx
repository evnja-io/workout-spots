import { Skeleton } from '~/components/ui/Skeleton'
import { Sheet } from '~/components/ui/Sheet'
import { useIsMobile } from '~/lib/hooks/useMediaQuery'

/**
 * Loading placeholder mirroring the Detail panel shell — shown while a spot's
 * data is fetched on client-side navigation to an uncached spot. Matches the
 * mobile sheet vs desktop floating-panel split used by Detail.
 */
export function DetailSkeleton() {
  const isMobile = useIsMobile()

  const content = (
    <>
      <Skeleton className="h-[210px] shrink-0" />
      <div className="flex-1 px-5 pt-4.5 pb-5">
        <div className="mb-3 flex items-start justify-between gap-2.5">
          <Skeleton className="h-5 w-1/2 rounded-[4px]" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="mb-3.5 h-3.5 w-2/3 rounded-[4px]" />
        <div className="mb-3.5 flex gap-3.5 border-t border-b border-border py-3">
          <Skeleton className="h-8 w-12 rounded-[4px]" />
          <Skeleton className="h-8 w-12 rounded-[4px]" />
          <Skeleton className="h-8 w-12 rounded-[4px]" />
        </div>
        <Skeleton className="mb-2 h-3 w-1/4 rounded-[4px]" />
        <Skeleton className="mb-1.5 h-3.5 w-full rounded-[4px]" />
        <Skeleton className="mb-1.5 h-3.5 w-full rounded-[4px]" />
        <Skeleton className="h-3.5 w-3/5 rounded-[4px]" />
        <div className="mt-5 flex flex-wrap gap-1.5">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open onClose={() => {}}>
        {content}
      </Sheet>
    )
  }

  return (
    <div className="absolute top-[14px] right-[14px] z-[4] flex max-h-[calc(100vh-28px)] w-[420px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-lg)] animate-[slideIn_0.25s_ease]">
      {content}
    </div>
  )
}
