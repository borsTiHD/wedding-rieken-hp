<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-rose-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.address.header') }}</h2>
                    </ShowUnderline>
                </div>
                <dl>
                    <dt class="text-base font-semibold leading-7 text-gray-900">{{ street }}</dt>
                    <dd class="text-base leading-7 text-gray-600">{{ city }}</dd>
                </dl>
                <img class="w-full h-auto rounded-lg" :src="locationPicture" alt="Location">
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import locationPicture from '@/assets/img/location/location.jpg'
import { useAppStore } from '@/stores/app'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Localisation
const { t } = useI18n()

// Fetch app config
const appStore = useAppStore()
const street = computed(() => appStore.street)
const city = computed(() => appStore.city)
</script>
