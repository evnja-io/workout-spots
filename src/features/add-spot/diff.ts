/**
 * Pure helper: compute which IDs to add and which to remove when
 * transitioning from `current` to `next`.
 */
export function diffIds(
  current: string[],
  next: string[],
): { toAdd: string[]; toRemove: string[] } {
  const currentSet = new Set(current)
  const nextSet = new Set(next)
  return {
    toAdd: [...nextSet].filter((id) => !currentSet.has(id)),
    toRemove: [...currentSet].filter((id) => !nextSet.has(id)),
  }
}
