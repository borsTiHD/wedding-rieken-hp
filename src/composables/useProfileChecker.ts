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

    // Array with all possible checks
    const allChecks = [
        {
            label: t('profileStepper.index.header'),
            check: () => !!uid.value
        },
        {
            label: t('profileStepper.userInformation.header'),
            check: () => !!displayName.value && !!email.value && !!emailVerified.value && !!phoneNumber.value
        },
        {
            label: t('profileStepper.profilePicture.header'),
            check: () => !!photoURL.value
        },
        {
            label: t('profileStepper.invitationState.header'),
            check: () => ['declined', 'accepted'].includes(invitationState.value) && role.value === 'invited'
        }
    ]

    // Checker function that returns true if the corresponding check function returns true
    function checker(pageLabel: string) {
        // Find the corresponding check function in the array
        const checkFunction = allChecks.find((check) => check.label === pageLabel)

        // If found, call the check function; otherwise, return false
        return checkFunction ? checkFunction.check() : false
    }

    // Checks the state of the profile
    // For that, it loops through all checks and returns a percentage of completion
    const checkState = computed(() => {
        const totalChecks = allChecks.length
        let completedChecks = 0

        for (const check of allChecks) {
            if (check.check()) {
                completedChecks++
            }
        }

        return Math.round((completedChecks / totalChecks) * 100)
    })

    // Max file size for profile picture
    const maxFileSize = 10 * 1000 * 1000 // in bytes (10MB)
    const maxFileSizeInMB = maxFileSize / 1000000

    return { checker, allChecks, checkState, maxFileSize, maxFileSizeInMB }
}
