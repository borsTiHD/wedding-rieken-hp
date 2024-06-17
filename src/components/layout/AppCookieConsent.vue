<template>
    <div class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-opacity-70 bg-body z-50">
        <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
            <Card class="card-primary">
                <template #title>
                    <div class="flex flex-col text-center">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('consent.header') }}</h2>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-4">
                        <!-- Subheader -->
                        <h3 class="font-bold text-xl md:text-2xl">{{ t('consent.subheader') }}</h3>

                        <!-- Message -->
                        <p>{{ t('consent.message') }}</p>

                        <!-- Actions -->
                        <div class="flex flex-wrap gap-4 mt-4">
                            <Button :label="t('imprint.header')" severity="secondary" icon="pi pi-users" class="min-w-fit flex-1" @click="goToImprint" />
                            <Button :label="t('consent.preferences')" severity="info" icon="pi pi-search" class="min-w-fit flex-1" outlined @click="$CookieConsent.showPreferences()" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { $CookieConsent } = useNuxtApp()

function goToImprint() {
    router.push(localePath('imprint'))
}
</script>
