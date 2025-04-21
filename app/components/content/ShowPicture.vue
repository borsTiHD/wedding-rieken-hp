<script setup lang="ts">
import ShowImage from '@/components/gallery/ShowImage.vue'
import { useImages } from '@/composables/useImages'

const props = defineProps<{
  number?: number
}>()

const { number } = toRefs(props)
const { images } = useImages()

// Get specific or random image
const getImage = computed(() => images[number.value ?? Math.floor(Math.random() * images.length)])
</script>

<template>
  <ShowImage :image="getImage" rounded-class="!rounded-3xl" mode="single" />
</template>
