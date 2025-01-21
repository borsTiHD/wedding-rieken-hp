<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ShowCalendar from '@/components/ShowCalendar.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import { useConfig } from '@/composables/useConfig'
import dayjs from 'dayjs'
import 'add-to-calendar-button'

// Localisation
const { t, locale } = useI18n()

// Switch language based on locale
const calendarLocale = computed(() => {
  switch (locale.value) {
    case 'de':
      return 'de'
    case 'us':
      return 'en'
    default:
      return locale.value
  }
})

// Config
const { configData, bride, groom, street, city, weddingDate, weddingDuration } = useConfig()
const eventTitel = computed(() => t('general.eventTitle', { bride: bride.value, groom: groom.value }))
const eventDescription = computed(() => t('general.eventDescription', { bride: bride.value, groom: groom.value, url: window.location.href }))
const date = computed(() => dayjs(weddingDate.value).format('YYYY-MM-DD'))
const startTime = computed(() => dayjs(weddingDate.value).format('HH:mm'))
const endTime = computed(() => dayjs(weddingDate.value).add(weddingDuration.value, 'hour').format('HH:mm'))
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-heart-fill" />
      <div class="flex flex-col items-center gap-4">
        <div class="relative inline-block">
          <ShowUnderline color="text-yellow-400">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('general.weddingDay') }}
            </h2>
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
              :start-date="date"
              :end-date="date"
              :start-time="startTime"
              :end-time="endTime"
              time-zone="Europe/Berlin"
              button-style="date"
              :label="t('general.addToCalendar')"
              :language="calendarLocale"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
