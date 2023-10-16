import { db } from '@/server/lib/firebaseAdmin'
import checkAdmin from '@/server/lib/checkAdmin'
import type { UserProfile, PartialUserProfile } from '@/types/UserProfile'

export default defineEventHandler(async(event) => {
    // Check if user is admin
    await checkAdmin(event)

    // Get data from request body
    // body: {
    //     uid: User ID of the user to update,
    //     profile: PartialUserProfile
    // }
    const { uid, profile }: { uid: string, profile: PartialUserProfile } = await readBody(event)

    // List of allowed properties from type UserProfile
    const allowedProperties: (keyof UserProfile)[] = ['role', 'email', 'phoneNumber', 'invitation', 'additionalGuests']

    // Check if all properties are allowed
    const invalidProperties = Object.keys(profile).filter((property) => !allowedProperties.includes(property as keyof UserProfile))
    if (invalidProperties.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Invalid Properties: ${invalidProperties.join(', ')}`
        })
    }

    // Helper function to validate a property
    function validateProperty(value: string | undefined, allowedValues: string[], propertyName: string): void {
        if (value && !allowedValues.includes(value)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Invalid value for "${propertyName}": ${value}`
            })
        }
    }

    // Validate properties
    validateProperty(profile.role, ['admin', 'invited', 'guest', 'declined'], 'role') // Secure role property
    validateProperty(profile.invitation, ['pending', 'accepted', 'declined'], 'invitation') // Secure invitation property

    // Update user profile
    await db.collection('users').doc(uid).update(profile).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Return success message
    return { result: 'success' }
})
