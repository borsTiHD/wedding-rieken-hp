<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <p class="italic">{{ t('riddle.text') }}</p>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
// Localisation
const { t } = useI18n()
</script>
