// Type for the user profile
export interface UserProfile {
    role: 'admin' | 'invited' | 'guest' | 'declined'
    email: string
    phoneNumber: string
    invitation: 'pending' | 'accepted' | 'declined' // 'pending' if the user has not confirmed the invitation
    additionalGuests: number
    highscore: number
}

// Type for the partial user profile
export type PartialUserProfile = Partial<UserProfile>;
