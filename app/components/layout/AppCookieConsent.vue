<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { $CookieConsent } = useNuxtApp()

function goToImprint() {
  router.push(localePath('imprint'))
}
</script>

<template>
  <Card>
    <template #title>
      <div class="flex flex-col items-center">
        <div class="relative inline-block">
          <!-- <ShowUnderline color="text-rose-400"> -->
          <ShowUnderline color="text-[#e8b797]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('consent.header') }}
            </h2>
          </ShowUnderline>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <!-- Subheader -->
        <h3 class="font-bold text-xl md:text-2xl">
          {{ t('consent.subheader') }}
        </h3>

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
</template>
