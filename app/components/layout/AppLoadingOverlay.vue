<script setup lang="ts">
interface Props { progress: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="background-wrapper background-image loader">
    <div class="background-wrapper flex items-center justify-center bg-opacity-70 bg-body z-50">
      <div class="relative h-16 w-16">
        <div class="animate-spin rounded-full h-full w-full border-t-4 border-rose-500" />
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600">
          {{ props.progress }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
    z-index: 9999;
}

.background-wrapper {
    @apply fixed top-0 left-0 w-screen h-screen !important;
}
</style>
