import { Skeleton } from '~/components/ui/Skeleton'

/** Placeholder matching SpotCard's layout, shown while the spot list loads. */
export function SpotCardSkeleton() {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 rounded-lg border border-transparent p-2.5">
      <Skeleton className="size-[72px] rounded-[10px]" />
      <div className="flex flex-col justify-center gap-2">
        <Skeleton className="h-3.5 w-3/4 rounded-[4px]" />
        <Skeleton className="h-3 w-2/5 rounded-[4px]" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
