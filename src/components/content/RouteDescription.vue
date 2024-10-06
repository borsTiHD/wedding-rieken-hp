<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-rose-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.address.header') }}</h2>
                    </ShowUnderline>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-center font-medium text-lg">{{ street }}, {{ city }}</div>
                    <div class="text-center">
                        <Button as="a" severity="info" :label="t('general.address.viewOnGoogleMap')" :href="googleMapsLink" target="_blank" rel="noopener noreferrer" />
                    </div>
                </div>
                <Image v-if="locationPreviewUrl" :src="locationPreviewUrl" alt="Location Preview" width="250" imageClass="rounded-lg" preview />
                <Skeleton v-else size="12rem" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Localisation
const { t } = useI18n()
const { getFileUrl } = useFirebaseStorage()

// Fetch app config
const appStore = useAppStore()
const street = computed(() => appStore.street)
const city = computed(() => appStore.city)
const locationPreviewFileName = computed(() => appStore.locationPreviewFileName)
const locationPreviewUrl = ref<string | null>(null)

// URL encoded Google maps link for location by street and city
const googleMapsLink = computed(() => {
    const googleMapsLink = 'https://www.google.com/maps'
    if (!street.value || !city.value) return googleMapsLink
    return `${googleMapsLink}/search/?api=1&query=${encodeURIComponent(street.value + ',' + city.value)}`
})

// Watch for changes in location preview file name
watchEffect(async() => {
    if (locationPreviewFileName.value) {
        const path = `app/${locationPreviewFileName.value}`
        locationPreviewUrl.value = await getFileUrl(path)
    } else {
        locationPreviewUrl.value = null
    }
})
</script>
