import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User} from 'firebase/auth'

export default function() {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const user = useState<User | null>('user', () => null) // Create a reactive state for the user (nuxt)

    // Register a new user
    const registerUser = async(email: string, password: string): Promise<boolean> => {
        try {
            const userCreds = await createUserWithEmailAndPassword($auth, email, password)
            if (userCreds) {
                user.value = userCreds.user
                return true
            }
        } catch (error: unknown) {
            console.error(error)
            if (error instanceof Error) {
                // handle error
            }
            return false
        }
        return false
    }

    // Login a user
    const loginUser = async(email: string, password: string): Promise<boolean> => {
        try {
            const userCreds = await signInWithEmailAndPassword($auth, email, password)
            if (userCreds) {
                user.value = userCreds.user
                return true
            }
        } catch (error: unknown) {
            throw error
        }
        throw new Error('Could not login user - unknown error')
    }

    return {
        user,
        registerUser,
        loginUser
    }
}
