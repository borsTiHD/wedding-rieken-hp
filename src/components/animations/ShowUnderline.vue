<template>
    <ClientOnly fallback-tag="div">
        <ShowUnderlineClient :color="props.color">
            <slot />
        </ShowUnderlineClient>

        <!-- this will be rendered on server side as fallback -->
        <template #fallback>
            <slot />
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import ShowUnderlineClient from '@/components/animations/ShowUnderlineClient.vue'

type Props = {
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    color: 'text-lime-500'
})
</script>
