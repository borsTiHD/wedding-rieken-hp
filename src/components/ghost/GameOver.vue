<template>
    <div v-if="show" class="relative m-auto p-4 bg-white rounded-xl flex flex-col justify-between items-center gap-2 select-none pointer-events-none">
        <span class="text-3xl font-bold">{{ t('ghostGame.gameover') }}</span>
        <span class="text-2xl">{{ t('ghostGame.highscore') }}: {{ props.highscore }}</span>
        <span class="text-2xl">{{ t('ghostGame.score') }}: {{ props.score }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    show: boolean
    score: number
    highscore: number
}>()

// Localisation
const { t } = useI18n()
</script>
