<template>
    <Card class="card-primary grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <p class="italic">{{ getQuote }}</p>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
    number?: number
}>()

// Localisation
const { t } = useI18n()

// Quote array
const quotes = [
    t('quotes.quote1'),
    t('quotes.quote2'),
    t('quotes.quote3'),
    t('quotes.quote4'),
    t('quotes.quote5'),
    t('quotes.quote6'),
    t('quotes.quote7'),
    t('quotes.quote8'),
    t('quotes.quote9'),
    t('quotes.quote10')
]

// Get specific or random quote
const getQuote = computed(() => props.number ? quotes[props.number-1] : quotes[Math.floor(Math.random() * quotes.length)])
</script>
