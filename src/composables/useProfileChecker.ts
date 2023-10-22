import { useUserStore } from '@/stores/user'

// Error handling function
export default function() {
    // Localisation
    const { $i18n } = useNuxtApp()
    const t = $i18n.t

    // User store values
    const userStore = useUserStore()
    const uid = computed(() => userStore.uid)
    const displayName = computed(() => userStore.displayName)
    const email = computed(() => userStore.email)
    const photoURL = computed(() => userStore.photoURL)
    const emailVerified = computed(() => userStore.emailVerified)
    const userProfile = computed(() => userStore.userProfile)
    const phoneNumber = computed(() => userProfile.value?.phoneNumber)
    const invitationState = computed(() => userProfile.value?.invitation)
    const role = computed(() => userProfile.value?.role)

    // Checker
    function checker(pageLabel: string) {
        // TODO: Check the state of the profile completion
        // Push to the specific route/state if not completed

        // Define a mapping of page labels to check functions
        const pageChecks: Record<string, () => boolean> = {
            [t('profileStepper.index.header')]: () => !!uid.value,
            [t('profileStepper.userInformation.header')]: () => {
                // Need to check if the user has a display name, email, email verified and phone number
                return !!displayName.value && !!email.value && !!emailVerified.value && !!phoneNumber.value
            },
            [t('profileStepper.profilePicture.header')]: () => {
                // Need to check if the user has a profile picture
                return !!photoURL.value
            },
            [t('profileStepper.invitationState.header')]: () => {
                // Need to check if the user has an invitation state and role is 'invited'
                return ['declined', 'accepted'].includes(invitationState.value) && role.value === 'invited'
            }
        }

        // Check if the page label exists in the mapping, and if it does, call the corresponding check function
        if (pageLabel in pageChecks) {
            return pageChecks[pageLabel]()
        }

        // Return false if no checks are defined for the page
        return false
    }

    return { checker }
}
