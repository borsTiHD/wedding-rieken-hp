<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Header -->
                <h1 class="text-4xl">{{ t('profileStepper.invitationState.header') }}</h1>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.invitationState.text') }}</p>
                    <span>TODO: Invitation State (annehmen/ablehnen)</span>
                    <span>TODO: Additional Guests</span>

                    <span>invitationState: {{ invitationState }}</span>
                    <span>role: {{ role }}</span>
                    <span>additionalGuests: {{ additionalGuests }}</span>
                </div>

                <!-- State complete -->
                <div v-else class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.invitationState.textComplete') }}</p>

                    <span>invitationState: {{ invitationState }}</span>
                    <span>role: {{ role }}</span>
                    <span>additionalGuests: {{ additionalGuests }}</span>
                </div>

                <div class="flex">
                    <Button label="Prev page" @click="navPage('prev')" />
                    <Button label="Complete" class="ml-auto" @click="navPage('complete')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['prev-page', 'complete-page'])
const navPage = (to: 'prev' | 'complete') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.invitationState.header')))


// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const invitationState = computed(() => userProfile.value?.invitation)
const role = computed(() => userProfile.value?.role)
const additionalGuests = computed(() => userProfile.value?.additionalGuests)
</script>
