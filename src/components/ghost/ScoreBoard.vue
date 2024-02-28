<template>
    <div v-if="show" class="relative mb-auto mt-8 p-4 bg-white rounded-xl flex flex-col justify-between items-center gap-2 select-none pointer-events-none">
        <span class="text-2xl font-bold">{{ t('ghostGame.secret') }}</span>
        <span class="text-2xl">{{ t('ghostGame.score') }}: {{ props.score }}</span>
        <span class="text-2xl">{{ t('ghostGame.time') }}: {{ props.timer }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    score: number,
    timer: number // in seconds
}>()

// Localisation
const { t } = useI18n()

const show = computed(() => props.score > 0 && props.timer > 0)
</script>
