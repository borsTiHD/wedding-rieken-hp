<template>
    <div class="background-wrapper background-image">
        <div class="background-wrapper flex items-center justify-center bg-opacity-70 bg-body z-50">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <Card class="card-primary">
                    <template #title>
                        <div class="flex items-center">
                            <div class="ml-auto flex flex-col items-center gap-4">
                                <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('consent.header') }}</h2>
                            </div>
                            <!-- Language selector -->
                            <ChangeLanguage class="ml-auto" />
                        </div>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-4">
                            <!-- Subheader -->
                            <h3 class="font-bold text-xl md:text-2xl">{{ t('consent.subheader') }}</h3>

                            <!-- Message -->
                            <p>{{ t('consent.message') }}</p>

                            <!-- Actions -->
                            <div class="flex flex-wrap gap-4">
                                <Button :label="t('consent.preferences')" severity="info" icon="pi pi-search" class="min-w-fit flex-1" outlined @click="$CookieConsent.showPreferences()" />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'

const { t } = useI18n()

// Cookie consent
const { $CookieConsent } = useNuxtApp()
</script>

<style scoped>
.background-wrapper {
    @apply fixed top-0 left-0 w-screen h-screen !important;
}
</style>
