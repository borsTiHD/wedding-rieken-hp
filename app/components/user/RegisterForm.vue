<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Composables
const router = useRouter()
const toast = useToast()
const { registerUser } = useFirebaseAuth()
const { changeRoleToInvited } = useFirebaseUserProfile()

// Store
const userStore = useUserStore() // User store

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)

// Data
const loading = ref(false)

// Submit button
async function handleSubmit(form: { email: string, password: string }) {
  loading.value = true

  // Create user
  const response = await registerUser(form.email, form.password).catch((error: { message: string }) => {
    toast.add({
      severity: 'error',
      summary: t('register.error'),
      detail: error.message,
      life: 10000,
    })
    return false
  })

  // If response is true, user is logged in
  if (response) {
    toast.add({
      severity: 'success',
      summary: t('register.success'),
      detail: t('register.successDetail'),
      life: 10000,
    })

    await userStore.fetchUserData() // Fetch user data

    // Check if user has an invitation token
    // And change profile role to 'invited'
    // Firebase will check if the token is valid
    if (token.value && token.value !== '') {
      await changeRoleToInvited(token.value).catch((error: { message: string }) => {
        toast.add({
          severity: 'error',
          summary: t('user.upgradeUserRole.error'),
          detail: error.message,
          life: 10000,
        })
      })
    }

    // Redirect to profile completion page after registration
    router.push(localePath('/user/profile'))
  }

  // Stop loading
  loading.value = false
}
</script>

<template>
  <FormKit
    v-slot="{ state: { valid } }"
    type="form"
    :actions="false"
    @submit="handleSubmit"
  >
    <div class="flex flex-col">
      <FormKit
        type="email"
        name="email"
        :placeholder="t('register.formkit.labelEmail')"
        validation="required|email"
        autofocus
      />
      <FormKit
        type="password"
        name="password"
        :placeholder="t('register.formkit.labelPassword')"
        validation="required"
      />

      <div class="flex justify-between mb-4">
        <!-- Register link -->
        <NuxtLink :to="localePath('/login')">
          <Button class="whitespace-nowrap p-2" :label="t('register.alreadyRegistered')" text size="small" />
        </NuxtLink>
      </div>

      <Button :label="t('register.submit')" icon="pi pi-user-plus" type="submit" raised :loading="loading" :disabled="!valid" />
    </div>
  </FormKit>
</template>
