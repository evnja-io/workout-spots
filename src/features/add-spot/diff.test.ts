import { describe, expect, it } from 'vitest'
import { diffIds } from './diff'

describe('diffIds', () => {
  it('returns toAdd when next has items not in current', () => {
    expect(diffIds(['a', 'b'], ['a', 'b', 'c'])).toEqual({ toAdd: ['c'], toRemove: [] })
  })

  it('returns toRemove when current has items not in next', () => {
    expect(diffIds(['a', 'b', 'c'], ['a'])).toEqual({ toAdd: [], toRemove: ['b', 'c'] })
  })

  it('returns empty sets when no change', () => {
    expect(diffIds(['a', 'b'], ['a', 'b'])).toEqual({ toAdd: [], toRemove: [] })
  })

  it('handles duplicates (deduped)', () => {
    const result = diffIds(['a', 'a'], ['b', 'b'])
    expect(result.toAdd).toEqual(['b'])
    expect(result.toRemove).toEqual(['a'])
  })

  it('handles empty current', () => {
    expect(diffIds([], ['x', 'y'])).toEqual({ toAdd: ['x', 'y'], toRemove: [] })
  })

  it('handles empty next', () => {
    expect(diffIds(['x', 'y'], [])).toEqual({ toAdd: [], toRemove: ['x', 'y'] })
  })
})
