<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-yellow-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.weddingDay') }}</h2>
                    </ShowUnderline>
                </div>
                <div class="flex flex-col sm:flex-row justify-center items-center gap-8">
                    <ShowCalendar :timestamp="config?.weddingDate.seconds" />
                    <div class="flex flex-col items-center gap-4 order-first sm:order-last">
                        <ShowCountdown :timestamp="config?.weddingDate.seconds" />
                        <DateDisplay :timestamp="config?.weddingDate.seconds" />
                        <add-to-calendar-button
                            :name="eventTitel"
                            :description="eventDescription"
                            options="'Apple','Google','iCal','Outlook.com','Microsoft365'"
                            :location="`${street}, ${city}`"
                            :startDate="date"
                            :endDate="date"
                            :startTime="startTime"
                            :endTime="endTime"
                            timeZone="Europe/Berlin"
                            buttonStyle="date"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import 'add-to-calendar-button'
import dayjs from 'dayjs'
import { useAppStore } from '@/stores/app'
import ShowCalendar from '@/components/ShowCalendar.vue'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'

// Localisation
const { t } = useI18n()

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)
const eventTitel = computed(() => t('general.eventTitle', { bride: bride.value, groom: groom.value }))
const eventDescription = computed(() => t('general.eventDescription', { bride: bride.value, groom: groom.value, url: window.location.href }))
const date = computed(() => dayjs(appStore.weddingDate).format('YYYY-MM-DD'))
const startTime = computed(() => dayjs(appStore.weddingDate).format('HH:mm'))
const endTime = computed(() => dayjs(appStore.weddingDate).add(appStore.weddingDuration, 'hour').format('HH:mm'))
const street = computed(() => appStore.street)
const city = computed(() => appStore.city)
</script>
