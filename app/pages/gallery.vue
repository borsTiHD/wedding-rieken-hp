<script setup lang="ts">
import ShowGalleryLazy from '@/components/gallery/ShowGalleryLazy.vue'
import { useFolderQuery } from '@/queries/useFolderQuery'

const { refreshToken } = useFirebaseAuth()
refreshToken()

const galleryPath = ref('gallery/')
const { data: filesData, isLoading: isLoadingFolder, isFetching: isFetchingFolder } = useFolderQuery(galleryPath)
const loadingFolder = computed(() => isLoadingFolder.value || isFetchingFolder.value)

// Get only image paths
// Sort by last modified date
const imagePaths = computed(() => {
  return filesData?.value
    ?.slice()
    ?.sort((a, b) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('lastModified' in a?.file && 'lastModified' in b?.file) {
        const aDate = a?.file?.lastModified || ''
        const bDate = b?.file?.lastModified || ''
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      }
      return 0
    })
    ?.map((item) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('name' in item?.file) {
        return item.file.name // Complete path for downloading preview
      }
      return null // Handle cases where 'name' doesn't exist
    })
    ?.filter(file => file !== null) as string[] // Remove null entries and assert type
})
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <ShowGalleryLazy :image-paths="imagePaths" :loading="loadingFolder" />
    </div>
  </main>
</template>
