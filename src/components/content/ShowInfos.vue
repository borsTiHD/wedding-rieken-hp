<template>
    <Card class="card-primary grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-lime-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('general.infos.header') }}</h2>
                    </ShowUnderline>
                </div>
                <dl class="space-y-4">
                    <div v-for="info in infos" :key="info.header">
                        <dt class="text-base font-semibold leading-7 text-gray-900">{{ info.header }}</dt>
                        <dd class="text-base leading-7 text-gray-600">
                            <!-- Witnesses: Text with a list of contacts -->
                            <template v-if="info.header === t('general.infos.witnesses')">
                                <span>{{ info.text }}</span>
                                <ul class="list-none list-inside">
                                    <li v-for="contact in info.contacts" :key="contact">{{ contact }}</li>
                                </ul>
                            </template>

                            <!-- Default info text -->
                            <template v-else>
                                {{ info.text }}
                            </template>
                        </dd>
                    </div>
                </dl>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// Localisation
const { t } = useI18n()

const infos = [
    {
        header: t('general.infos.gifts'),
        text: t('general.infos.giftsText')
    },
    {
        header: t('general.infos.accommodation'),
        text: t('general.infos.accommodationText')
    },
    {
        header: t('general.infos.witnesses'),
        text: t('general.infos.witnessesText'),
        contacts: [
            'John Doe Tel.: 0123456789',
            'Jane Doe Tel.: 0123456789'
        ]
    }
]
</script>
