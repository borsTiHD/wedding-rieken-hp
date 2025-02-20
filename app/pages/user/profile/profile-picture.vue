<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import { useUserStore } from '@/stores/user'

// Emit events to parent to navigate between pages
const emit = defineEmits(['next-page', 'prev-page'])

definePageMeta({
  key: route => route.fullPath,
})

const navPage = (to: 'next' | 'prev') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.profilePicture.header')))

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)
</script>

<template>
  <Card>
    <template #title>
      <div class="flex gap-4">
        <h2>{{ t('profileStepper.profilePicture.header') }}</h2>
        <i v-if="checkState" v-tooltip.bottom="t('profileStepper.stateComplete')" class="text-2xl pi pi-verified text-green-600" />
        <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="text-2xl pi pi-exclamation-circle text-sky-600" />
      </div>
    </template>
    <template #content>
      <IconBackground icon="pi-camera" />
      <div class="flex flex-col gap-4">
        <!-- State incomplete -->
        <div v-if="!checkState" class="flex gap-4">
          <p>{{ t('profileStepper.profilePicture.text') }}</p>
        </div>

        <!-- State complete -->
        <div v-else class="flex gap-4">
          <p>{{ t('profileStepper.profilePicture.textComplete') }}</p>
        </div>

        <!-- User avatar -->
        <div class="flex items-center justify-center gap-4">
          <div class="col-span-full flex flex-col sm:flex-row items-center gap-8">
            <DisplayAvatar v-if="photoURL" size="3xl" shadow preview />
            <div v-else class="h-64 w-64 flex text-center justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <i class="pi pi-image text-6xl text-gray-300" />
            </div>
            <UploadProfilePicture />
          </div>
        </div>

        <div class="flex">
          <Button :label="t('profileStepper.buttons.back')" @click="navPage('prev')" />
          <Button :label="t('profileStepper.buttons.next')" class="ml-auto" @click="navPage('next')" />
        </div>
      </div>
    </template>
  </Card>
</template>
