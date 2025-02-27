import type { User } from '@/types/User'

export function useCheckUser() {
  function isInvited(user: User) {
    return user?.profile?.role === 'invited'
  }

  function isAdminAndInvited(user: User) {
    return user?.profile?.role === 'admin' && user?.profile?.invitation === 'accepted'
  }

  function hasInvitationStatus(user: User, invitation: string) {
    return user?.profile?.invitation === invitation
  }

  return {
    isInvited,
    isAdminAndInvited,
    hasInvitationStatus,
  }
}
