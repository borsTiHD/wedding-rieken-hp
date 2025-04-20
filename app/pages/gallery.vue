<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowGallery from '@/components/gallery/ShowGallery.vue'
import { useFilesQueries } from '@/queries/useFilesQueries'
import { useFolderQuery } from '@/queries/useFolderQuery'

const galleryPath = ref('gallery/')
const { data: filesData, isLoading: isLoadingFolder, isFetching: isFetchingFolder } = useFolderQuery(galleryPath)
const loadingFolder = computed(() => isLoadingFolder.value || isFetchingFolder.value)
const imagePaths = computed(() => {
  return filesData?.value?.files?.map((item) => {
    // Type guard to ensure 'item.file' has a 'name' property
    if ('name' in item?.file) {
      return item.file.name // Complete path for downloading preview
    }
    return null // Handle cases where 'name' doesn't exist
  }).filter(file => file !== null) as string[] // Remove null entries and assert type
})

const imageDataQueries = useFilesQueries(imagePaths, ref(true))
// const loadingImages = computed(() => imageDataQueries.value.isLoading)
const images = computed<Image[]>(() => {
  return imageDataQueries.value.data?.map((item) => {
    if (!item?.previewUrl) {
      return null // Handle cases where 'previewUrl' doesn't exist
    }
    return {
      src: item?.previewUrl,
      thumbnailSrc: item?.previewUrl,
      alt: item?.file?.path || '',
      title: item?.file?.name,
      lastModified: item?.file?.metadata?.lastModified,
      size: item?.file?.metadata?.size,
    }
  })?.filter(file => file !== null)?.sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  })
})
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <div v-if="loadingFolder" class="flex items-center justify-center">
        <i class="pi pi-spin pi-spinner text-gray-500 text-2xl" />
      </div>
      <ShowGallery v-else :images="images" />
    </div>
  </main>
</template>
