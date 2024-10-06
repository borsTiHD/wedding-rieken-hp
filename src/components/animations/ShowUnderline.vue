<template>
    <ShowUnderlineClient :color="props.color">
        <slot />
    </ShowUnderlineClient>
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
