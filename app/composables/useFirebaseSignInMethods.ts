export default function () {
  const { fetchEmailSignInMethods } = useFirebaseAuth()

  // All sign in methods for a user
  const signInMethods = ref<string[]>()

  // Check if user is only allowed to login with email link
  const emailLinkOnly = computed(() => signInMethods.value?.includes('emailLink') && !signInMethods.value?.includes('password'))

  // Fetch email sign-in methods
  onMounted(async () => {
    signInMethods.value = await fetchEmailSignInMethods()
  })

  return {
    signInMethods,
    emailLinkOnly,
  }
}
