<script setup lang="ts">
import ShowGallery from '@/components/gallery/ShowGallery.vue'
import { useImages } from '@/composables/useImages'

const { images } = useImages()
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <ShowGallery :images="images" />
    </div>
  </main>
</template>
