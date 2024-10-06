export default defineEventHandler(async(event) => {
    // Check if the request is to an API endpoint
    // If so, check if the user is signed in
    if (event.node.req.url?.includes('/api/')) {
        const userIdToken = getCookie(event, 'user-id-token')
        if (!userIdToken) {
            throw createError({
                statusCode: 401,
                statusMessage: 'You must be signed in to access to resource.'
            })
        }
    }
})
