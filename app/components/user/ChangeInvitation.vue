<script setup lang="ts">
import type { PartialUserProfile } from '@/types/UserProfile'
import { useConfig } from '@/composables/useConfig'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

// Emit event
const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { t, d } = useI18n()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()

// Config
const { deadlineDate, isBeforeDeadline } = useConfig()

// Data
const loading = ref(false)

// Submit button
async function handleSubmit(value: boolean) {
  // Start loading
  loading.value = true

  // Set invitation response
  const userResponse = value ? 'accepted' : 'declined'

  // Update users profile
  const data: PartialUserProfile = { invitation: userResponse }
  const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.invitation.error'),
      detail: error.message,
      life: 10000,
    })
    return false
  })

  // Update user
  userStore.refreshUserProfile()

  // Stop loading
  loading.value = false

  // Show success toast
  if (response) {
    toast.add({
      severity: 'success',
      summary: t('user.invitation.success'),
      detail: t('user.invitation.successDetail'),
      life: 10000,
    })

    // Emit event to parent
    emit('changed')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <template v-if="isBeforeDeadline">
      <i18n-t keypath="user.invitation.deadlineInfo" tag="p" class="max-w-xl">
        <template #date>
          <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
        </template>
      </i18n-t>

      <div class="flex gap-2 w-full">
        <Button class="grow" :label="t('user.invitation.labelAccept')" icon="pi pi-thumbs-up" type="submit" raised :loading="loading" @click="handleSubmit(true)" />
        <Button class="grow" :label="t('user.invitation.labelDecline')" icon="pi pi-thumbs-down" type="submit" severity="danger" outlined :loading="loading" @click="handleSubmit(false)" />
      </div>
    </template>

    <p v-else-if="deadlineDate" class="max-w-xl">
      {{ t('user.invitation.deadlinePassedInfo') }}
    </p>

    <p v-else class="max-w-xl">
      {{ t('user.invitation.notInvitedInfo') }}
    </p>
  </div>
</template>
