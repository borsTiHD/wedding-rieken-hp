export default defineNuxtRouteMiddleware(() => {
    // Check if the user is logged in
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const currentUser = $auth.currentUser
    if (!currentUser) {
        return navigateTo('/login')
    }
})
