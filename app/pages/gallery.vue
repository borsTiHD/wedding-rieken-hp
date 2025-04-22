<script setup lang="ts">
import type { MinioFile } from '@@/shared/types/MinioFile'
import type { SerializeObject } from 'nitropack'
import ShowGalleryLazy from '@/components/gallery/ShowGalleryLazy.vue'
import { useFolderInfiniteQuery } from '@/queries/useFolderInfiniteQuery'

const { refreshToken } = useFirebaseAuth()
refreshToken() // Refresh token to avoid 401 error

const galleryPath = ref('gallery/')

const {
  data: filesData,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isPending,
} = useFolderInfiniteQuery(galleryPath, ref(5))
const loadingData = computed(() => isFetching.value || isFetchingNextPage.value || isPending.value)

function convertResults(items: SerializeObject<MinioFile>[]): string[] {
  // Get only image paths
  // Sort by last modified date
  return items
    ?.slice()
    ?.sort((a, b) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('lastModified' in a?.file && 'lastModified' in b?.file) {
        const aDate = a?.file?.lastModified || ''
        const bDate = b?.file?.lastModified || ''
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      }
      return 0
    })
    ?.map((item) => {
      // Type guard to ensure 'item.file' has a 'name' property
      if ('name' in item?.file) {
        return item.file.name // Complete path for downloading preview
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
      <ShowGalleryLazy :image-paths="imagePaths" :loading="loadingData" @is-ready="handleIsReady" />
    </div>
  </main>
</template>
