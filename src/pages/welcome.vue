<template>
    <main class="content-flex w-full sm:max-w-xl">
        <Card class="card-primary">
            <template #title>
                <div class="flex flex-col items-center gap-4">
                    <div class="relative inline-block">
                        <ShowUnderline color="text-purple-400">
                            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('welcome.header') }}</h2>
                        </ShowUnderline>
                    </div>
                </div>
            </template>
            <template #content>
                <i18n-t v-if="isBeforeDeadline" keypath="welcome.welcomeMessage" tag="p">
                    <template #weddingDate>
                        <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                    </template>
                    <template #deadline>
                        <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
                    </template>
                    <template #action>
                        <NuxtLink :to="localePath('/register')" class="font-medium text-blue-600">{{ t('welcome.loginLinkTag') }}</NuxtLink>
                    </template>
                </i18n-t>

                <i18n-t v-else keypath="welcome.welcomeMessageAfterDeadline" tag="p">
                    <template #weddingDate>
                        <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                    </template>
                </i18n-t>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

// Composables
const router = useRouter()
const { t, d } = useI18n()
const localePath = useLocalePath()
const { getInvitationToken } = useInvitationToken()

// App config
const appStore = useAppStore()
const { weddingDate, deadlineDate, isBeforeDeadline } = appStore

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)

// Watch uid and push to home if user is logged in
watch(uid, (newUid) => {
    if (newUid) { router.push(localePath('/user')) }
})

// On mount
onMounted(() => {
    // If user got no invitation token -> push to home
    if (!getInvitationToken()) { router.push(localePath('/')) }
    // If user is logged in -> push to user
    else if (uid.value) { router.push(localePath('/user')) }
})
</script>
