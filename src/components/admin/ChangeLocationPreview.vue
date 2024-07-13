<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.changeLocation.previewHeader') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <div class="col-span-full flex items-center gap-x-8 pb-4">
                    <Image :src="locationPreview" alt="Location Preview" width="250" imageClass="rounded-lg" preview />
                    <div>
                        <UploadLocationPicture @uploaded="appStore.fetchConfig()" />
                        <p class="mt-2 text-xs leading-5 text-gray-400">{{ t('user.profilePicture.uploadDescription', { maxFilesize: `xx MB` }) }}</p>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import UploadLocationPicture from '@/components/admin/UploadLocationPicture.vue'

// Composables
const { t } = useI18n() // Localisation

// App config
const appStore = useAppStore()
const locationPreview = computed(() => appStore.locationPreview)
</script>
