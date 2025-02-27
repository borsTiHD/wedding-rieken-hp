<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useRouter } from 'vue-router'

// Composables
const { t } = useI18n()
const router = useRouter()

// Push to homepage
router.push('/')
</script>

<template>
  <main class="content-wrapper">
    <Card :pt="{ title: 'mb-4' }">
      <template #title>
        <div class="flex flex-col items-center">
          <div class="relative inline-block">
            <!-- <ShowUnderline color="text-purple-400"> -->
            <ShowUnderline color="text-[#f0a787]">
              <h1 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
                {{ t('general.404') }}
              </h1>
            </ShowUnderline>
          </div>
        </div>
      </template>
      <template #content>
        <p class="text-center">
          {{ t('ghostGame.secretWrong') }}
        </p>
      </template>
    </Card>
  </main>
</template>
