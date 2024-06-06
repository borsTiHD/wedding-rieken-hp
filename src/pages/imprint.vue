<template>
    <main class="content-flex w-full sm:max-w-xl">
        <Card class="card-primary">
            <template #title>
                <div class="flex flex-col items-center gap-4">
                    <div class="relative inline-block">
                        <ShowUnderline color="text-purple-400">
                            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('welcome.header') }}</h2>
                        </ShowUnderline>
                    </div>
                </div>
            </template>
            <template #content>
                <!-- Subheader -->
                <h3 class="font-bold text-xl md:text-2xl">{{ t('welcome.subheader') }}</h3>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Composables
const { t } = useI18n()
</script>
