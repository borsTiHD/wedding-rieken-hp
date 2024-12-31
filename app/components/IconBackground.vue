<template>
    <div
        class="icon-background absolute pointer-events-none"
        :class="iconClass"
        :style="iconStyle"
        aria-hidden="true"
    />
</template>

<script setup lang="ts">
type Props = {
    icon: string
    size?: string
    bottom?: string
    right?: string
    color?: string
    color2?: string
    gradientRotate?: string
    rotate?: string
    scale?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'pi-heart-fill',
    size: '12rem',
    bottom: '-20px',
    right: '-20px',
    color: 'rgba(255, 255, 255, 0.1)',
    color2: 'rgba(0, 0, 0, 0.1)',
    gradientRotate: '135deg',
    rotate: '-15deg',
    scale: '1.2'
})

const iconClass = computed(() => `pi ${props.icon}`)
const iconStyle = computed(() => ({
    fontSize: props.size,
    bottom: props.bottom,
    right: props.right,
    transform: `rotate(${props.rotate}) scale(${props.scale})`,
    backgroundImage: `linear-gradient(${props.gradientRotate}, ${props.color}, ${props.color2})`
}))
</script>

<style scoped>
.icon-background {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
