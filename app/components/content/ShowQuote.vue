<script setup lang="ts">
const props = defineProps<{
  number?: number
}>()

// Localisation
const { t } = useI18n()

const { number } = toRefs(props)

// Quote array
const quotes = [
  t('quotes.quote0'),
  t('quotes.quote1'),
  t('quotes.quote2'),
]

// Get specific or random quote
const getQuote = computed(() => quotes[number.value ?? Math.floor(Math.random() * quotes.length)])
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-envelope" />
      <div class="flex flex-col items-center gap-4">
        <p class="italic">
          {{ getQuote }}
        </p>
      </div>
    </template>
  </Card>
</template>
