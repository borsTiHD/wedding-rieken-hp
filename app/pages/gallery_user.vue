<script setup lang="ts">
import type { ImageFile } from '@@/shared/types/ImageFile'
import type { SerializeObject } from 'nitropack'
import ShowUserGallery from '@/components/gallery_user/ShowUserGallery.vue'
import { useUserFilesInfiniteQuery } from '@/queries/user-files/useUserFilesInfiniteQuery'

const { refreshToken } = useFirebaseAuth()
refreshToken() // Refresh token to avoid 401 error

const {
  data: filesData,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetching,
  isFetchingNextPage,
  isPending,
} = useUserFilesInfiniteQuery(ref(5))
const loadingData = computed(() => isFetching.value || isFetchingNextPage.value || isPending.value)
const totalImages = computed(() => filesData.value?.pages?.[0]?.total || 0)

function convertResults(files: SerializeObject<ImageFile>[]): string[] {
  // Get only image paths
  // Sort by last modified date
  return files
    ?.slice()
    ?.sort((a, b) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('lastModified' in a && 'lastModified' in b) {
        const aDate = a.lastModified || ''
        const bDate = b.lastModified || ''
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      }
      return 0
    })
    ?.map((item) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('name' in item) {
        return item.name // Complete path for downloading preview
      }
      return null
    })
    ?.filter(file => file !== null)
}

const imagePaths = computed(() => {
  const paths = filesData.value?.pages?.map((page) => {
    const files = page.files
    return convertResults(files)
  })?.flat() || []
  return paths
})

function handleIsReady() {
  if (!isFetchingNextPage.value && hasNextPage.value) {
    // Save the current scroll position
    const scrollTop = window.scrollY

    fetchNextPage().then(() => {
      // Restore the scroll position after fetching
      window.scrollTo(0, scrollTop)
    })
  }
}
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <ShowUserGallery
        :image-paths="imagePaths"
        :loading-more="loadingData"
        :is-loading="isLoading"
        :total="totalImages"
        :count="imagePaths?.length || 0"
        @is-ready="handleIsReady"
      />
    </div>
  </main>
</template>
