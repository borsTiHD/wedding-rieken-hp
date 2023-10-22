import { useUserStore } from '@/stores/user'

// Error handling function
export default function() {
    // Localisation
    const { $i18n } = useNuxtApp()
    const t = $i18n.t

    // User store
    const userStore = useUserStore()
    const uid = computed(() => userStore.uid)

    // Checker
    function checker(pageLabel: string) {
        // TODO: Check the state of the profile completion
        // Push to the specific route/state if not completed

        // Define a mapping of page labels to check functions
        const pageChecks: Record<string, () => boolean> = {
            [t('profileStepper.index.header')]: () => !!uid.value,
            [t('profileStepper.userInformation.header')]: () => {
                // Implement checks for user information completeness and return true/false
                return false
            },
            [t('profileStepper.profilePicture.header')]: () => {
                // Implement checks for profile picture completeness and return true/false
                return false
            },
            [t('profileStepper.invitationState.header')]: () => {
                // Implement checks for invitation state and return true/false
                return false
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
