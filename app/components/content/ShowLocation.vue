<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useConfig } from '@/composables/useConfig'
import { useGoogleMaps } from '@/composables/useGoogleMaps'
// import L from 'leaflet'
// import type L from 'leaflet'

const { t } = useI18n()

// Config
const {
  street,
  city,
  // locationPreviewUrl
} = useConfig()

// Google Maps
const address = computed(() => `${street.value}, ${city.value}`)
const { link: googleMapsLink } = useGoogleMaps(address)

// Leaflet Map
const map = ref() // ref<L.Map>()
const zoom = ref(16)
const mapReady = computed(() => map.value?.ready)
const coordinates = [51.147440, 7.156428] // [51.146396, 7.1552614]
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-map-marker" />
      <div class="flex flex-col items-center gap-4">
        <div class="relative inline-block">
          <!-- <ShowUnderline color="text-rose-400"> -->
          <ShowUnderline color="text-[#ffd4c3]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('general.address.header') }}
            </h2>
          </ShowUnderline>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-center font-medium text-lg">
            {{ street }}, {{ city }}
          </div>

          <dl class="flex flex-col">
            <dt class="text-lg font-semibold leading-7 text-gray-900">
              {{ t('general.infos.approach') }}
            </dt>
            <dd class="text-base text-gray-600">
              <i18n-t keypath="general.infos.approachText" tag="p" class="text-pretty">
                <template #parking>
                  <strong>Parkplatz P2</strong>
                </template>
                <template #location>
                  <strong>"Grotte"</strong>
                </template>
              </i18n-t>
            </dd>
          </dl>

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
        <div class="h-64 w-full rounded-xl overflow-hidden">
          <Skeleton v-if="!mapReady" size="12rem" />
          <ClientOnly>
            <LMap
              ref="map"
              class="rounded-lg z-[4]"
              :zoom="zoom"
              :center="coordinates"
              :use-global-leaflet="false"
            >
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              />
              <LMarker :lat-lng="coordinates" />
            </LMap>
          </ClientOnly>
        </div>

        <!-- <Image v-if="locationPreviewUrl" :src="locationPreviewUrl" alt="Location Preview" width="250" image-class="rounded-lg" preview /> -->
        <!-- <Skeleton v-else size="12rem" /> -->
      </div>
    </template>
  </Card>
</template>
