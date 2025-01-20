<script setup lang="ts">
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/en'
import 'dayjs/locale/de'

const props = defineProps<{
  timestamp?: number
}>()

// Use dayjs plugins
dayjs.extend(localizedFormat)

// Switch language based on locale
const { locale } = useI18n()
switch (locale.value) {
  case 'de':
    dayjs.locale('de')
    break
  case 'us':
    dayjs.locale('en')
    break
  default:
    dayjs.locale('de')
    break
}

// Get date based on timestamp
const timestampDate = computed(() => {
  if (!props.timestamp)
    return '-'

  // Return date based on timestamp and format it
  return dayjs(props.timestamp * 1000).format('LLLL')
})
</script>

<template>
  <span class="text-xl sm:text-2xl">{{ timestampDate }}</span>
</template>
