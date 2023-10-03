// Type for the user profile
export interface UserProfile {
    role: 'admin' | 'invited' | 'guest'
    email: string
    phoneNumber: string
    confirmation: 'pending' | boolean // boolean = true | false and 'pending' if the user has not confirmed the invitation
    additionalGuests: number
}

// Type for the partial user profile
export type PartialUserProfile = Partial<UserProfile>;
