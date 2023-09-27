// Config types
export interface UserProfile {
    role: string
    email: string
    confirmation: 'pending' | boolean
    additionalGuests: number
}
