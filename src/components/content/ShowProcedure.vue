<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col gap-8 items-center">
                <div class="relative inline-block">
                    <ShowUnderline color="text-fuchsia-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.procedure.header') }}</h2>
                    </ShowUnderline>
                </div>

                <!-- Time schedule -->
                <ul role="list" class="space-y-6">
                    <li v-for="(eventItem, eventItemIdx) in events" :key="eventItemIdx" class="relative flex gap-x-4">
                        <!-- Seperator line -->
                        <div :class="[eventItemIdx === events.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center']">
                            <div class="w-px bg-gray-200" />
                        </div>
                        <!-- Bullet point -->
                        <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                            <div class="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        </div>
                        <!-- Event text -->
                        <p class="flex-auto py-0.5 leading-5 text-gray-500">
                            <i18n-t :keypath="eventItem.status" tag="p">
                                <template #time>
                                    <span class="font-medium text-gray-900">{{ eventItem.date }}</span>
                                </template>
                            </i18n-t>
                        </p>
                    </li>
                </ul>
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

// Calculate event time based on wedding date
const calcEventTime = (date: Date | undefined, time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return new Date(date || 0).setHours(hours, minutes)
}

// Time schedule
// TODO: ASK FOR SCHEDULE
const events = [
    { date: d(weddingDate || 0, 'timeOnly'), status: 'general.procedure.ceremony' },
    { date: d(calcEventTime(weddingDate, '16:00'), 'timeOnly'), status: 'general.procedure.reception' },
    { date: d(calcEventTime(weddingDate, '18:00'), 'timeOnly'), status: 'general.procedure.dinner' }
]
</script>
