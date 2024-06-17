<template>
    <ClientOnly>
        <ShowCircleClient>
            <slot />
        </ShowCircleClient>
    </ClientOnly>
</template>

<script setup lang="ts">
import ShowCircleClient from '@/components/animations/ShowCircleClient.vue'
</script>
