<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import createReadableDate from '@/composables/dateHelper'

// Localisation
const { t } = useI18n()

// Content
const dates = [
  {
    date: '2018-05-01',
    event: t('general.ourStory.firstMeeting'),
  },
  {
    date: '2019-09-01',
    event: t('general.ourStory.firstDate'),
  },
  {
    date: '2020-02-01',
    event: t('general.ourStory.livingTogether'),
  },
  {
    date: '2020-07-01',
    event: t('general.ourStory.firstVacation'),
  },
  {
    date: '2023-07-01',
    event: t('general.ourStory.sheSaidYes'),
  },
  {
    date: '2025-09-01',
    event: t('general.ourStory.weddingDay'),
  },
]
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-calendar" position="left" rotate="15deg" />
      <div class="flex flex-col gap-8 items-start px-4">
        <div class="relative inline-block">
          <!-- <ShowUnderline color="text-fuchsia-400"> -->
          <ShowUnderline color="text-[#fbb89b]">
            <h2 class="pr-2 font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('general.ourStory.header') }}
            </h2>
          </ShowUnderline>
        </div>

        <div class="flex justify-end w-full">
          <ul role="list" class="flex flex-col gap-6">
            <li v-for="(event, index) in dates" :key="index" class="relative flex gap-x-4">
              <!-- Event text -->
              <p class="flex-auto py-0.5 leading-5 text-end">
                <span class="text-xl uppercase text-gray-900">{{ createReadableDate(event.date, { year: 'numeric', month: 'long' }) }}</span>
                <span class="block text-gray-500">{{ event.event }}</span>
              </p>
              <!-- Separator line -->
              <div class="absolute right-0 top-0 flex w-6 justify-center" :class="[index === dates.length - 1 ? 'h-6' : '-bottom-6']">
                <div class="w-px bg-gray-200" />
              </div>
              <!-- Bullet point -->
              <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white rounded-full">
                <div class="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>
