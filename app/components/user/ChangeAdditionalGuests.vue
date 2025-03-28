<script setup lang="ts">
import type { PartialUserProfile } from '@/types/UserProfile'
import { useConfig } from '@/composables/useConfig'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

// Emit event
const emit = defineEmits(['changed'])

// Localisation
const { t, d } = useI18n()

// Composables
const toast = useToast()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const additionalGuests = computed(() => userProfile.value.additionalGuests)

// Config
const { deadlineDate, isBeforeDeadline } = useConfig()

// Data
const loading = ref(false)
const defaultAdditionalGuests = ref(String(additionalGuests.value))

// Submit button
async function handleSubmit(form: { additionalGuests: number }) {
  // Cast to number
  form.additionalGuests = Number(form.additionalGuests)

  // Check if additional guests have changed
  if (additionalGuests.value === form.additionalGuests) {
    toast.add({
      severity: 'info',
      summary: t('user.additionalGuests.notChangedInfo'),
      detail: t('user.additionalGuests.notChangedInfoDetail'),
      life: 3000,
    })
    return false
  }

  // TODO: Ask how many guests the user is allowed to bring

  // Start loading
  loading.value = true

  // Update users profile
  const data: PartialUserProfile = { additionalGuests: form.additionalGuests }
  const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.additionalGuests.error'),
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
      summary: t('user.additionalGuests.success'),
      detail: t('user.additionalGuests.successDetail'),
      life: 10000,
    })

    // Emit event to parent
    emit('changed')
  }
}
</script>

<template>
  <FormKit
    v-slot="{ state: { valid } }"
    type="form"
    :actions="false"
    @submit="handleSubmit"
  >
    <div v-if="isBeforeDeadline" class="flex flex-col gap-2">
      <i18n-t keypath="user.additionalGuests.deadlineInfo" tag="p" class="max-w-xl mb-4">
        <template #date>
          <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
        </template>
      </i18n-t>

      <FormKit
        v-model="defaultAdditionalGuests"
        type="number"
        name="additionalGuests"
        :label="t('user.additionalGuests.formkit.label')"
        placeholder="0"
        :help="t('user.additionalGuests.formkit.help')"
        validation="required|min:0|max:10"
        validation-visibility="dirty"
        autofocus
      />

      <div class="flex gap-2">
        <Button :label="t('buttons.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
      </div>
    </div>

    <p v-else-if="deadlineDate" class="max-w-xl">
      {{ t('user.additionalGuests.deadlinePassedInfo') }}
    </p>

    <p v-else class="max-w-xl">
      {{ t('user.additionalGuests.notInvitedInfo') }}
    </p>
  </FormKit>
</template>
