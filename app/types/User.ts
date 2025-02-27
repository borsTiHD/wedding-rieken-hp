import type { UserProfile } from '@/types/UserProfile'
import type admin from 'firebase-admin'

// Type definition for user
export interface User {
  account: admin.auth.UserRecord
  profile: UserProfile
}

// Type definition for user type
export type UserRole = 'all' | UserProfile['role']

// Type definition for DataTableUser
export interface DataTableUser {
  uid: string
  role: UserProfile['role']
  displayName: string
  email: string
  emailVerified: boolean
  phoneNumber: string
  photoURL: string
  additionalGuests: number
  invitation: string
  creationTime: string
  lastRefreshTime: string
  lastSignInTime: string
  highscore?: number
}
