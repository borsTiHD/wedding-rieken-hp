<template>
    <Card class="card-primary grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-fuchsia-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.procedure.header') }}</h2>
                    </ShowUnderline>
                </div>
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div class="mx-auto flex flex-col items-center">
                        <i18n-t keypath="general.procedure.ceremony" tag="p" class="whitespace-nowrap">
                            <template #time>
                                <span>{{ d(weddingDate || 0, 'timeOnly') }}</span>
                            </template>
                        </i18n-t>
                        <i18n-t keypath="general.procedure.reception" tag="p" class="whitespace-nowrap">
                            <template #time>
                                <span>16:00</span>
                            </template>
                        </i18n-t>
                        <i18n-t keypath="general.procedure.dinner" tag="p" class="whitespace-nowrap">
                            <template #time>
                                <span>18:00</span>
                            </template>
                        </i18n-t>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Localisation
const { t, d } = useI18n()

// Fetch app config
const appStore = useAppStore()
const { weddingDate } = appStore
</script>
