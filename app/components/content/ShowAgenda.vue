<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col gap-8 items-center">
                <div class="relative inline-block">
                    <ShowUnderline color="text-fuchsia-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.procedure.header') }}</h2>
                    </ShowUnderline>
                </div>

                <!-- Time schedule -->
                <ProgressSpinner v-if="isFetching" class="size-12" />
                <ul v-else role="list" class="space-y-6">
                    <li v-for="(event, index) in dailyAgenda" :key="index" class="relative flex gap-x-4">
                        <!-- Seperator line -->
                        <div :class="[index === dailyAgenda.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center']">
                            <div class="w-px bg-gray-200" />
                        </div>
                        <!-- Bullet point -->
                        <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                            <div class="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        </div>
                        <!-- Event text -->
                        <p class="flex-auto py-0.5 leading-5">
                            <span class="font-medium text-gray-900">{{ event.time }} Uhr</span>
                            <span class="block text-gray-500">{{ event.event }}</span>
                        </p>
                    </li>
                </ul>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useContent } from '@/composables/useContent'

// Localisation
const { t } = useI18n()

// Content
const { dailyAgenda, isFetching } = useContent()
</script>
