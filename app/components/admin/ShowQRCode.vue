<script setup lang="ts">
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  GradientType,
  Mode,
  TypeNumber,
} from 'qr-code-styling'
import { useJSON } from '@/composables/useJSON'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'
import QRCodeStyling from 'qr-code-styling'

// Composables
const { t } = useI18n()
const toast = useToast()
const { queryByCollectionAndId, update } = useFirestore()
const { parseJSON, stringifyJSON } = useJSON()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Data
const loading = ref(false)
const qrCode = ref()
const canvasDiv = ref()
const invitationToken = ref()
const qrCodeSettings = ref()
const extensions = ['png', 'svg', 'jpeg']
const selectedExtension = ref('svg')

// Form
const formId = 'changeQrSettingsForm'

// Computed url
const url = computed(() => {
  // Create url for QR code based on current url and token
  const baseUrl = window.location.origin
  return `${baseUrl}/?token=${invitationToken.value}`
})

async function setDefaultSettings() {
  // QR code options for styling
  // See https://qr-code-styling.com/
  const defaultOptions = {
    width: 300,
    height: 300,
    type: 'svg' as DrawType, // 'canvas' or 'svg'
    image: '/favicon.ico',
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber, // 0 to 40
      mode: 'Byte' as Mode, // Numeric, Alphanumeric, Byte, Kanji
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel, // L, M, Q, H
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: 'anonymous', // 'anonymous' or 'use-credentials'
    },
    dotsOptions: {
      type: 'rounded' as DotType,
      color: '#6a1a4c',
      gradient: {
        type: 'linear' as GradientType, // 'radial'
        rotation: 0.8,
        colorStops: [{ offset: 0, color: '#cf0ac0' }, { offset: 1, color: '#6a1a4c' }],
      },
    },
    backgroundOptions: {
      color: '#ffffff',
      // gradient: {...}
    },
    cornersSquareOptions: {
      color: '#35495E',
      type: 'extra-rounded' as CornerSquareType,
      gradient: {
        type: 'linear' as GradientType, // 'radial'
        rotation: 0.8,
        colorStops: [{ offset: 0, color: '#cf0ac0' }, { offset: 1, color: '#6a1a4c' }],
      },
    },
    cornersDotOptions: {
      color: '#35495E',
      type: 'dot' as CornerDotType,
      // gradient: {...}
    },
  }

  const settings = stringifyJSON(defaultOptions)

  if (!settings) {
    loading.value = false
    throw new Error(t('admin.qrcode.errorSettings'))
  }

  loading.value = true
  await changeSettings(settings).catch(() => false)
  loading.value = false
}

// QR code options
function getOptions() {
  // Create url for QR code based on current url and token
  const baseUrl = window.location.origin
  const url = `${baseUrl}/?token=${invitationToken.value}`

  // Parse settings
  const settings = parseJSON(qrCodeSettings.value)

  if (!settings) {
    loading.value = false
    throw new Error(t('admin.qrcode.errorSettings'))
  }

  // Persistent settings
  const persistentSettings = {
    data: url,
    width: 300,
    height: 300,
    type: 'svg' as DrawType, // 'canvas' or 'svg'
    qrOptions: {
      typeNumber: 0 as TypeNumber, // 0 to 40
      mode: 'Byte' as Mode, // Numeric, Alphanumeric, Byte, Kanji
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel, // L, M, Q, H
    },
  }

  return { ...settings, ...persistentSettings }
}

// Create QR code and append to div
async function createQRCode() {
  const options = getOptions()
  qrCode.value = new QRCodeStyling(options)
  qrCode.value.append(canvasDiv.value)
}

// Update QR code
async function updateQRCode() {
  const options = getOptions()
  qrCode.value.update(options)
}

// Download QR code
function downloadQRCode() {
  qrCode.value.download({
    name: 'wedding-invitation-qrcode',
    extension: selectedExtension.value,
  })
}

// Get invite token
async function getInviteToken() {
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

  // Set qr code settings
  qrCodeSettings.value = response.qrCodeSettings as string

  return true
}

// Initialize QR code
async function init() {
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
    // await updateQRCode().catch((error) => {
    //   console.error(error)
    //   loading.value = false

    //   toast.add({
    //     severity: 'error',
    //     summary: t('admin.qrcode.errorQrCodeCreate'),
    //     detail: error.message,
    //     life: 5000,
    //   })
    //   return false
    // })
  }
  else {
    await createQRCode()
    // await createQRCode().catch((error) => {
    //   console.error(error)
    //   loading.value = false

    //   toast.add({
    //     severity: 'error',
    //     summary: t('admin.qrcode.errorQrCodeCreate'),
    //     detail: error.message,
    //     life: 5000,
    //   })
    //   return false
    // })
  }

  loading.value = false
}

// Submit button
async function handleSubmit(form: { settings: string }) {
  loading.value = true
  await changeSettings(form?.settings).catch((error) => {
    console.error(error)
    loading.value = false
  })
  loading.value = false
}

// Change qr code settings
async function changeSettings(newSettings: string) {
  // Check if user is logged in
  if (!user.value) {
    throw new Error(t('firebase.custom.noUserLoggedIn'))
  }

  // Check if user is admin
  // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
  if (userProfile.value && userProfile.value.role !== 'admin') {
    throw new Error(t('admin.notAdminError'))
  }

  // Update settings
  await update('app', 'admin', 'qrCodeSettings', newSettings).catch((error: { message: string }) => {
    toast.add({
      severity: 'error',
      summary: t('admin.qrcode.errorUpdateSettings'),
      detail: error.message,
      life: 5000,
    })
    throw new Error(error.message)
  })

  // Show toast
  toast.add({
    severity: 'success',
    summary: t('admin.qrcode.successUpdateSettings'),
    detail: t('admin.qrcode.successUpdateSettingsDetail'),
    life: 3000,
  })

  await init()
}

// Register event to reload qr code if token has changed
useRegisterEvent('invitation-token-updated', init)

// On mounted
onMounted(async () => {
  await init()
})
</script>

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

        <!-- Change QR code settings -->
        <div class="flex flex-col gap-1">
          <FormKit
            :id="formId"
            v-slot="{ state: { valid } }"
            type="form"
            :actions="false"
            @submit="handleSubmit"
          >
            <div class="flex flex-col items-center gap-4">
              <Message severity="info" class="w-full">
                {{ t('admin.qrcode.infoText') }}
              </Message>
              <FormKit
                v-model="qrCodeSettings"
                type="text"
                name="settings"
                outer-class="w-full"
                :label="t('admin.qrcode.settings')"
                validation="required"
              />

              <div class="flex flex-wrap gap-4 w-full">
                <Button :label="t('admin.qrcode.formkit.default')" class="basis-36 grow" icon="pi pi-refresh" severity="secondary" :loading="loading" :disabled="loading" type="button" @click="setDefaultSettings" />
                <Button :label="t('admin.qrcode.formkit.submit')" class="basis-36 grow" icon="pi pi-check" severity="info" :loading="loading" :disabled="!valid || loading" type="submit" />
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Download button -->
        <div class="flex flex-wrap justify-center gap-4">
          <Select v-model="selectedExtension" :options="extensions" placeholder="Select a file extension" class="basis-48 grow" />
          <Button
            :label="t('admin.qrcode.download')"
            icon="pi pi-download"
            class="basis-48 grow"
            raised
            @click="downloadQRCode"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
