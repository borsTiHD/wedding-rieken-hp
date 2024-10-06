<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.changeLocation.previewHeader') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <div class="col-span-full flex items-center gap-x-8 pb-4">
                    <Image v-if="locationPreviewUrl" :src="locationPreviewUrl" alt="Location Preview" width="250" imageClass="rounded-lg" preview />
                    <Skeleton v-else size="12rem" />
                    <UploadLocationPicture @uploaded="appStore.fetchConfig()" />
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
const { getFileUrl } = useFirebaseStorage()

// App config
const appStore = useAppStore()
const locationPreviewFileName = computed(() => appStore.locationPreviewFileName)
const locationPreviewUrl = ref<string | null>(null)

// Watch for changes in location preview file name
watchEffect(async() => {
    if (locationPreviewFileName.value) {
        const path = `app/${locationPreviewFileName.value}`
        locationPreviewUrl.value = await getFileUrl(path)
    } else {
        locationPreviewUrl.value = null
    }
})
</script>
