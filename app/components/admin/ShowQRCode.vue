<template>
    <Card class="grow" :pt="{ content: { class: 'p-0' } }">
        <template #title>
            <h2>{{ t('admin.qrcode.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <div class="flex justify-center">
                    <Skeleton v-if="loading" width="10rem" height="10rem" />
                    <div id="qr-code" ref="canvasDiv" />
                </div>

                <!-- Textfield for the QR code token -->
                <div class="flex flex-col gap-1">
                    <label for="token" class="text-sm font-bold text-gray-800">{{ t('admin.qrcode.fullUrl') }}</label>
                    <InputText id="token" v-model="url" type="text" disabled />
                </div>

                <!-- Download button -->
                <div class="flex justify-center gap-4">
                    <Select v-model="selectedExtension" :options="extensions" placeholder="Select a Extension" class="w-full md:w-56" />
                    <Button
                        :label="t('admin.qrcode.download')"
                        icon="pi pi-download"
                        raised
                        @click="downloadQRCode"
                    />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'
import { useUserStore } from '@/stores/user'
import type {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    GradientType
} from 'qr-code-styling'

// Composables
const { t } = useI18n()
const { queryByCollectionAndId } = useFirestore()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Data
const loading = ref(false)
const qrCode = ref()
const canvasDiv = ref()
const invitationToken = ref()
const extensions = ['png', 'svg', 'jpeg']
const selectedExtension = ref('svg')

// Computed url
const url = computed(() => {
    // Create url for QR code based on current url and token
    const baseUrl = window.location.origin
    return `${baseUrl}/?token=${invitationToken.value}`
})

// QR code options
const getOptions = () => {
    // Create url for QR code based on current url and token
    const baseUrl = window.location.origin
    const url = `${baseUrl}/?token=${invitationToken.value}`

    // QR code options for styling
    // See https://qr-code-styling.com/
    const options = {
        width: 300,
        height: 300,
        type: 'svg' as DrawType, // 'canvas' or 'svg'
        image: '/favicon.ico',
        margin: 0,
        qrOptions: {
            typeNumber: 0 as TypeNumber, // 0 to 40
            mode: 'Byte' as Mode, // Numeric, Alphanumeric, Byte, Kanji
            errorCorrectionLevel: 'M' as ErrorCorrectionLevel // L, M, Q, H
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 5,
            crossOrigin: 'anonymous' // 'anonymous' or 'use-credentials'
        },
        dotsOptions: {
            type: 'rounded' as DotType,
            color: '#6a1a4c',
            gradient: {
                type: 'linear' as GradientType, // 'radial'
                rotation: 0.8,
                colorStops: [{ offset: 0, color: '#cf0ac0' }, { offset: 1, color: '#6a1a4c' }]
            }
        },
        backgroundOptions: {
            color: '#ffffff'
        // gradient: {...}
        },
        cornersSquareOptions: {
            color: '#35495E',
            type: 'extra-rounded' as CornerSquareType,
            gradient: {
                type: 'linear' as GradientType, // 'radial'
                rotation: 0.8,
                colorStops: [{ offset: 0, color: '#cf0ac0' }, { offset: 1, color: '#6a1a4c' }]
            }
        },
        cornersDotOptions: {
            color: '#35495E',
            type: 'dot' as CornerDotType
        // gradient: {...}
        }
    }

    return { ...options, data: url }
}

// Create QR code and append to div
const createQRCode = async() => {
    const options = getOptions()
    qrCode.value = new QRCodeStyling(options)
    qrCode.value.append(canvasDiv.value)
}

// Update QR code
const updateQRCode = async() => {
    const options = getOptions()
    qrCode.value.update(options)
}

// Download QR code
const downloadQRCode = () => {
    qrCode.value.download({
        name: 'wedding-invitation-qrcode',
        extension: selectedExtension.value
    })
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

    // Create or update QR code if qr code exists
    if (qrCode.value) {
        await updateQRCode()
    } else {
        await createQRCode()
    }


    loading.value = false
}

// Register event to reload qr code if token has changed
useRegisterEvent('invitation-token-updated', init)

// On mounted
onMounted(async() => {
    await init()
})
</script>
