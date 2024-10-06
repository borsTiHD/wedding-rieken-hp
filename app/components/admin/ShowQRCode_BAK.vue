<template>
    <Card class="grow" :pt="{ content: { class: 'p-0' } }">
        <template #title>
            <h2>{{ t('admin.qrcode.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col">
                <div class="flex justify-center">
                    <Skeleton v-if="loading" width="10rem" height="10rem" />
                    <canvas :id="canvasId" />
                </div>
                <!-- Download button -->
                <Button
                    :label="t('admin.qrcode.download')"
                    icon="pi pi-download"
                    raised
                    @click="downloadQRCode"
                />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import { useUserStore } from '@/stores/user'

// Composables
const { t } = useI18n()
const { queryByCollectionAndId } = useFirestore()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Data
const loading = ref(false)
const canvasId = 'invitationTokenCanvas'
const invitationToken = ref()

// Clear canvas
const clearCanvas = () => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    const context = canvas.getContext('2d')
    if (!context) return false
    context.clearRect(0, 0, canvas.width, canvas.height)
}

// Create QR code from token
// Returns a promise and resolves true if successful
const createQRCode = async() => {
    return new Promise((resolve, reject) => {
        // TODO: Check later if the url is correct and valid

        // Create url for QR code
        const baseUrl = window.location.origin
        const url = `${baseUrl}/?token=${invitationToken.value}`

        // Create QR code
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement
        const errorCorrectionLevel = 'M' // L, M, Q, H - default: M - https://github.com/soldair/node-qrcode#error-correction-level
        QRCode.toCanvas(canvas, url, { errorCorrectionLevel, color: { dark: '#000000ff', light: '#ffffffff' } }, (error: Error) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                resolve(true)
            }
        })
    })
}

// Download QR code
const downloadQRCode = () => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    const link = document.createElement('a')
    link.download = 'inviteQrCode.png'
    link.href = canvas.toDataURL()
    link.click()
}

// Get invite token
const getInviteToken = async() => {
    // Check if user is logged in
    if (!user.value) {
        throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
        throw new Error(t('admin.notAdminError'))
    }

    // If collection and id is specified, return document from collection
    const response = await queryByCollectionAndId('app', 'admin').catch((error) => {
        const errorMessage = handleFirebaseError(error, 'admin.inviteToken.error')
        throw new Error(errorMessage)
    })


    // Throw error if no response
    if (!response) {
        throw new Error(t('admin.inviteToken.error'))
    }

    // Set token
    invitationToken.value = response.inviteToken as string

    return true
}

// Initilize QR code
const init = async() => {
    loading.value = true

    // Clear canvas
    clearCanvas()

    // Get invite token
    const checkToken = await getInviteToken().catch((error) => {
        console.error(error)
        return false
    })

    // If token is not valid, return
    if (!checkToken) {
        loading.value = false
        return false
    }

    // Create QR code if token is valid
    await createQRCode()
    loading.value = false
}

// Register event to reload qr code if token has changed
useRegisterEvent('invitation-token-updated', init)

// On mounted
onMounted(async() => {
    await init()
})
</script>
