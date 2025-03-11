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
    header: t('general.infos.dresscode'),
    text: t('general.infos.dresscodeText'),
  },
  {
    header: t('general.infos.gifts'),
    text: t('general.infos.giftsText'),
  },
  {
    header: t('general.infos.accommodation'),
    // text: t('general.infos.accommodationText'),
    text: [
      `Für alle, die den Abend mit uns bis spät ausklingen lassen, folgt nun die Homepage zu einem Hotel ganz in der Nähe unserer Location. Es ist nur wenige Minuten mit dem Taxi entfernt.`,
      `<a href="https://www.ascothotel.de" target="_blank" class="text-blue-500 hover:text-blue-700 underline">https://www.ascothotel.de</a>`,
      `Hier haben wir vorab einige Zimmer reserviert. Bei der Buchung, welche von Euch telefonisch oder per Mail bis spätestens <strong>20.08.2025</strong> erfolgen muss, erwähnt ihr am Besten die <strong>Abrufkontingent-Nummer "G8911"</strong>, um so die Zimmer zu Sonderkonditionen zu erhalten.`,
    ],
  },
]
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-info-circle" />
      <div class="flex flex-col items-center gap-4">
        <div class="relative inline-block">
          <!-- <ShowUnderline color="text-lime-400"> -->
          <ShowUnderline color="text-[#fbdece]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('general.infos.header') }}
            </h2>
          </ShowUnderline>
        </div>
        <dl class="flex flex-col gap-4">
          <!-- Default infos -->
          <div v-for="info in infos" :key="info.header">
            <dt class="text-lg font-semibold leading-7 text-gray-900">
              {{ info.header }}
            </dt>
            <dd v-if="typeof info.text === 'string'" class="text-base text-pretty text-gray-600">
              {{ info.text }}
            </dd>
            <dd v-else class="flex flex-col gap-2 text-base text-pretty text-gray-600">
              <span v-for="line in info.text" :key="line" v-html="line" />
            </dd>
          </div>

          <!-- loading witnesses -->
          <div v-if="isFetching">
            <dt class="text-lg font-semibold leading-7 text-gray-900">
              {{ t('general.infos.witnesses') }}
            </dt>
            <dd class="text-base text-pretty text-gray-600">
              <span>{{ t('general.infos.witnessesText') }}</span>
              <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px" />
            </dd>
          </div>

          <!-- Witnesses -->
          <div v-else>
            <dt class="text-lg font-semibold leading-7 text-gray-900">
              {{ t('general.infos.witnesses') }}
            </dt>
            <dd class="text-base text-gray-600">
              <span class="text-pretty">{{ t('general.infos.witnessesText') }}</span>
              <ul class="list-none list-inside">
                <li v-for="witness in witnesses" :key="witness.name" class="flex gap-1">
                  <span class="font-semibold">{{ witness.name }}</span>
                  <span>(Tel.: {{ witness.phone }})</span>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </Card>
</template>
