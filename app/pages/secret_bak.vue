<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
// import BooBashWrapper from '@/components/BooBashWrapper.vue'
import ShowRiddle from '@/components/content/ShowRiddle.vue'

// Composables
const { t } = useI18n()

// Router
const route = useRoute()
const secret = computed(() => route.params.secret as string)

// Refs
const showSecret = ref(false)

// Check if secret is correct with a few variations - secret is 'boo'
if (/^boo$/i.test(secret.value)) {
  showSecret.value = true
}
</script>

<template>
  <main class="content-wrapper">
    <!-- Show secret if it's correct -->
    <template v-if="showSecret">
      <Card :pt="{ title: 'mb-4' }">
        <template #title>
          <div class="flex flex-col items-center">
            <div class="relative inline-block">
              <!-- <ShowUnderline color="text-purple-400"> -->
              <ShowUnderline color="text-[#f1cdb5]">
                <h1 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
                  {{ t('ghostGame.header') }}
                </h1>
              </ShowUnderline>
            </div>
          </div>
        </template>
        <template #content>
          <p class="text-center">
            {{ t('ghostGame.secret') }}
          </p>
        </template>
      </Card>

      <!-- <BooBashWrapper /> -->
    </template>

    <!-- Hint if the user didn't enter the correct secret -->
    <template v-else>
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
      <ShowRiddle />
    </template>
  </main>
</template>
