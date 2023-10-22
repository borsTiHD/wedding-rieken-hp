<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Header -->
                <h1 class="text-4xl">{{ t('profileStepper.userInformation.header') }}</h1>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.userInformation.text') }}</p>
                    <span>TODO: Check Email (+ verification), Name and Phone</span>

                    <span>Email: {{ email }}
                        <i v-if="emailVerified" v-tooltip.bottom="t('user.email.verified')" class="pi pi-verified text-green-600" />

                        <!-- Email verification button -->
                        <span v-else>NOT VERIFIED</span>
                        <!-- <Button
                            v-else
                            v-tooltip.bottom="t('user.email.tooltipPlzVerifie')"
                            :aria-label="t('user.email.verifieAriaLabel')"
                            icon="pi pi-exclamation-circle"
                            outlined
                            class="p-0"
                            :loading="loadingEmailVerify"
                            @click.prevent="handleVerifyEmail"
                        /> -->
                    </span>
                    <span>Name: {{ displayName }}</span>
                    <span>Phone: {{ phoneNumber }}</span>
                </div>

                <!-- State complete -->
                <!-- State complete -->
                <div v-else class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.userInformation.textComplete') }}</p>

                    <span>Email: {{ email }}
                        <i v-if="emailVerified" v-tooltip.bottom="t('user.email.verified')" class="pi pi-verified text-green-600" />

                        <!-- Email verification button -->
                        <span v-else>NOT VERIFIED</span>
                        <!-- <Button
                            v-else
                            v-tooltip.bottom="t('user.email.tooltipPlzVerifie')"
                            :aria-label="t('user.email.verifieAriaLabel')"
                            icon="pi pi-exclamation-circle"
                            outlined
                            class="p-0"
                            :loading="loadingEmailVerify"
                            @click.prevent="handleVerifyEmail"
                        /> -->
                    </span>
                    <span>Name: {{ displayName }}</span>
                    <span>Phone: {{ phoneNumber }}</span>
                </div>

                <div class="flex">
                    <Button label="Prev page" @click="navPage('prev')" />
                    <Button label="Next page" class="ml-auto" @click="navPage('next')" />
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
const emit = defineEmits(['next-page', 'prev-page'])
const navPage = (to: 'next' | 'prev') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.userInformation.header')))

// User store
const userStore = useUserStore()
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const emailVerified = computed(() => userStore.emailVerified)
const userProfile = computed(() => userStore.userProfile)
const phoneNumber = computed(() => userProfile.value?.phoneNumber)
</script>
