<template>
    <Card class="grow">
        <template #content>
            <IconBackground icon="pi-info-circle" />
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-lime-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.infos.header') }}</h2>
                    </ShowUnderline>
                </div>
                <dl class="space-y-1">
                    <!-- Default infos -->
                    <template v-for="info in infos" :key="info.header">
                        <dt class="text-lg font-semibold leading-7 text-gray-900">{{ info.header }}</dt>
                        <dd class="text-base leading-7 text-gray-600">{{ info.text }}</dd>
                    </template>

                    <!-- loading witnesses -->
                    <template v-if="isFetching">
                        <dt class="text-lg font-semibold leading-7 text-gray-900">{{ t('general.infos.witnesses') }}</dt>
                        <dd class="text-base leading-7 text-gray-600">
                            <span>{{ t('general.infos.witnessesText') }}</span>
                            <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px" />
                        </dd>
                    </template>

                    <!-- Witnesses -->
                    <template v-else>
                        <dt class="text-lg font-semibold leading-7 text-gray-900">{{ t('general.infos.witnesses') }}</dt>
                        <dd class="text-base leading-7 text-gray-600">
                            <span>{{ t('general.infos.witnessesText') }}</span>
                            <ul class="list-none list-inside">
                                <li v-for="witness in witnesses" :key="witness.name" class="flex gap-1">
                                    <span class="font-semibold">{{ witness.name }}</span>
                                    <span>(Tel.: {{ witness.phone }})</span>
                                </li>
                            </ul>
                        </dd>
                    </template>
                </dl>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import IconBackground from '@/components/IconBackground.vue'
import { useContent } from '@/composables/useContent'

// Localisation
const { t } = useI18n()

// Content
const { witnesses, isFetching } = useContent()

const infos = [
    {
        header: t('general.infos.gifts'),
        text: t('general.infos.giftsText')
    },
    {
        header: t('general.infos.accommodation'),
        text: t('general.infos.accommodationText')
    }
]
</script>
