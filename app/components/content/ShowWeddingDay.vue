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
                    <ShowCalendar :timestamp="configData?.weddingDate.seconds" />
                    <div class="flex flex-col items-center gap-4 order-first sm:order-last">
                        <ShowCountdown :timestamp="configData?.weddingDate.seconds" />
                        <DateDisplay :timestamp="configData?.weddingDate.seconds" />
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
import { useConfig } from '@/composables/useConfig'
import ShowCalendar from '@/components/ShowCalendar.vue'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'

// Localisation
const { t } = useI18n()

// Config
const { configData, bride, groom, street, city, weddingDate, weddingDuration } = useConfig()
const eventTitel = computed(() => t('general.eventTitle', { bride: bride.value, groom: groom.value }))
const eventDescription = computed(() => t('general.eventDescription', { bride: bride.value, groom: groom.value, url: window.location.href }))
const date = computed(() => dayjs(weddingDate.value).format('YYYY-MM-DD'))
const startTime = computed(() => dayjs(weddingDate.value).format('HH:mm'))
const endTime = computed(() => dayjs(weddingDate.value).add(weddingDuration.value, 'hour').format('HH:mm'))
</script>
