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
    // image: '/favicon.ico',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QEhRXhpZgAASUkqAAgAAAADAA4BAgDXAAAAMgAAABoBBQABAAAACQEAABsBBQABAAAAEQEAAAAAAABCbGFjayBoYW5kIGRyYXduIHZlY3RvciBoZWFydC4gRHJ5IGluayBicnVzaCBpbGx1c3RyYXRpb24uIElzb2xhdGVkIG9uIHdoaXRlIGJhY2tncm91bmQuIGxvdmUgc3ltYm9sIGRlc2lnbiBjb25jZXB0IGVsZW1lbnQgdmVjdG9yLiBWYWxlbnRpbmUgaGVhcnRoIGRlc2lnbiBpbGx1c3RyYXRvciBlbGVtZW50IGZvciB2YWxlbnRpbmUgZGF5LCBnaWZ0LCB3ZWRkaW5nLCBpY29uLiwBAAABAAAALAEAAAEAAAD/4QZQaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcyIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjExNjg1ODUyMzciIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+RWthdGVyaW5hIFB1c2hpbmE8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjxkYzpkZXNjcmlwdGlvbj48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPkJsYWNrIGhhbmQgZHJhd24gdmVjdG9yIGhlYXJ0LiBEcnkgaW5rIGJydXNoIGlsbHVzdHJhdGlvbi4gSXNvbGF0ZWQgb24gd2hpdGUgYmFja2dyb3VuZC4gbG92ZSBzeW1ib2wgZGVzaWduIGNvbmNlcHQgZWxlbWVudCB2ZWN0b3IuIFZhbGVudGluZSBoZWFydGggZGVzaWduIGlsbHVzdHJhdG9yIGVsZW1lbnQgZm9yIHZhbGVudGluZSBkYXksIGdpZnQsIHdlZGRpbmcsIGljb24uPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtMTE2ODU4NTIzNy0/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWdu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',
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
      color: '#f4b89d',
      gradient: {
        type: 'linear' as GradientType, // 'radial'
        rotation: 0.8,
        colorStops: [{ offset: 0, color: '#fad4c4' }, { offset: 1, color: '#f4b89d' }],
      },
    },
    backgroundOptions: {
      color: '#ffffff',
      // gradient: {...}
    },
    cornersSquareOptions: {
      color: '#efa687',
      type: 'extra-rounded' as CornerSquareType,
      gradient: {
        type: 'linear' as GradientType, // 'radial'
        rotation: 0.8,
        colorStops: [{ offset: 0, color: '#fad4c4' }, { offset: 1, color: '#efa687' }],
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
    // width: 300,
    // height: 300,
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
