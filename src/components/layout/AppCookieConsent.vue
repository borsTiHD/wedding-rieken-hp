<template>
    <div class="background-wrapper background-image">
        <div class="background-wrapper flex items-center justify-center bg-opacity-70 bg-body z-50">
            <Card class="card-primary">
                <template #title>
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative inline-block">
                            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('welcome.header') }}</h2>
                        </div>
                    </div>
                </template>
                <template #content>
                    <!-- Subheader -->
                    <h3 class="font-bold text-xl md:text-2xl">COOKIE EINSTELLUNGEN NICHT AKZEPTIERT!!!</h3>

                    <!-- Message -->
                    <div class="flex flex-col items-center gap-4">
                        Unsere Website verwendet unbedingt erforderliche Cookies, um ihre ordnungsgemäße Funktion sicherzustellen.
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col items-center gap-4">
                        <Button label="Show preferences modal" severity="info" icon="pi pi-check" class="w-full md:w-1/2" @click="$CookieConsent.showPreferences()" />
                        <Button label="Delete Consent Stuff" severity="danger" icon="pi pi-check" class="w-full md:w-1/2" @click="$CookieConsentActions.reset(true)" />
                    </div>

                    <div class="flex flex-col gap-4">
                        <span class="font-bold text-xl">Cookie:</span>
                        <pre>{{ cookie }}</pre>
                        <span class="font-bold text-xl">Preferences:</span>
                        <pre>{{ preferences }}</pre>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCookieStore } from '@/stores/cookieconsent'

const { t } = useI18n()

// Cookie consent
const { $CookieConsent } = useNuxtApp()
const cookieStore = useCookieStore()

// Computed
const cookie = computed(() => cookieStore.cookie)
const preferences = computed(() => cookieStore.preferences)

// TODO: Add text in language files
</script>

<style scoped>
.background-wrapper {
    @apply fixed top-0 left-0 w-screen h-screen !important;
}
</style>
