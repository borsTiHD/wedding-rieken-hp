import { auth, db } from '@/server/lib/firebaseAdmin'
import checkAdmin from '@/server/lib/checkAdmin'
import type admin from 'firebase-admin'

export default defineEventHandler(async(event) => {
    await checkAdmin(event)

    // Getting all users
    const listUsers = await auth.listUsers()

    // Create a map of users to combine user data and profiles
    const userMap: Record<string, { user: admin.auth.UserRecord, profile: any }> = {}

    // Loop through all users and get their profiles
    const promises = []
    for (const userRecord of listUsers.users) {
        const userProfilePromise = db.collection('users').doc(userRecord.uid).get()
        promises.push(userProfilePromise)

        userMap[userRecord.uid] = {
            user: userRecord,
            profile: null // This will be filled later
        }
    }

    // Wait for all profile promises to resolve
    const userDocs = await Promise.allSettled(promises)

    // Loop through all userDocs and add them to the userMap
    for (const userDoc of userDocs) {
        if (userDoc.status === 'fulfilled') {
            const userId = userDoc.value.id
            userMap[userId].profile = userDoc.value.data()
        }
    }

    // Konvertieren Sie das userMap-Objekt in ein Array von Benutzern mit Profilen
    const usersWithProfiles: Array<{ user: admin.auth.UserRecord, profile: any }> = []
    for (const userId in userMap) {
        usersWithProfiles.push(userMap[userId])
    }

    // Rückgabe aller Benutzer mit Profilen
    return { result: usersWithProfiles }
})
