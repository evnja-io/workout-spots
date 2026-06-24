import { useCallback } from 'react'
import { useSessionContext } from './session'

/**
 * Returns a `gate(action)` function.
 * - If the user is authenticated, `action` is called immediately.
 * - Otherwise, the action is stashed and the sign-in modal is opened;
 *   the action will be replayed automatically once the user becomes authed.
 */
export function useAuthGate(): (action: () => void) => void {
  const { status, openSignIn, pendingActionRef } = useSessionContext()

  return useCallback(
    (action: () => void) => {
      if (status === 'authed') {
        action()
      } else {
        pendingActionRef.current = action
        openSignIn()
      }
    },
    [status, openSignIn, pendingActionRef],
  )
}
