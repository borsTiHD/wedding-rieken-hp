<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useConfig } from '@/composables/useConfig'
import { useGoogleMaps } from '@/composables/useGoogleMaps'

const { t } = useI18n()

// Config
const { street, city, locationPreviewUrl } = useConfig()

// Google Maps
const address = computed(() => `${street.value}, ${city.value}`)
const { link: googleMapsLink } = useGoogleMaps(address)
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-map-marker" />
      <div class="flex flex-col items-center gap-4">
        <div class="relative inline-block">
          <ShowUnderline color="text-rose-400">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('general.address.header') }}
            </h2>
          </ShowUnderline>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-center font-medium text-lg">
            {{ street }}, {{ city }}
          </div>
          <div class="text-center">
            <Button
              as="a"
              severity="info"
              icon="pi pi-map-marker"
              :label="t('general.address.viewOnGoogleMap')"
              :href="googleMapsLink"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
        <Image v-if="locationPreviewUrl" :src="locationPreviewUrl" alt="Location Preview" width="250" image-class="rounded-lg" preview />
        <Skeleton v-else size="12rem" />
      </div>
    </template>
  </Card>
</template>
