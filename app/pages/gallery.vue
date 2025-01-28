<script setup lang="ts">
import ShowGallery from '@/components/gallery/ShowGallery.vue'

// TODO: Add thumbnails for images and descriptions
const images = [
  { src: '/img/1-IMG_8097.jpeg', thumbnailSrc: '/img/1-IMG_8097.jpeg', alt: 'Description for Image 1', title: 'Title 1' },
  { src: '/img/1-IMG_8139.jpeg', thumbnailSrc: '/img/1-IMG_8139.jpeg', alt: 'Description for Image 2', title: 'Title 2' },
  { src: '/img/1-IMG_8232.jpeg', thumbnailSrc: '/img/1-IMG_8232.jpeg', alt: 'Description for Image 3', title: 'Title 3' },
  { src: '/img/1-IMG_8400.jpeg', thumbnailSrc: '/img/1-IMG_8400.jpeg', alt: 'Description for Image 4', title: 'Title 4' },
]
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <ShowGallery :images="images" />
    </div>
  </main>
</template>
