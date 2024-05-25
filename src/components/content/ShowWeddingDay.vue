<template>
    <Card class="card-primary grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline>
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.weddingDay') }}</h2>
                    </ShowUnderline>
                </div>
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <ShowCalendar class="mx-auto" :timestamp="config?.weddingDate.seconds" />
                    <div class="mx-auto flex flex-col items-center gap-4 order-first sm:order-last">
                        <ShowCountdown :timestamp="config?.weddingDate.seconds" />
                        <DateDisplay :timestamp="config?.weddingDate.seconds" />
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowCalendar from '@/components/ShowCalendar.vue'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Localisation
const { t } = useI18n()

// App config
const appStore = useAppStore()
const config = appStore.config
</script>
