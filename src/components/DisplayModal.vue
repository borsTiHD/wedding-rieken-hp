<template>
    <Dialog
        v-model:visible="visible"
        modal
        :header="props.header"
        :closeicon="props.closeicon"
        :position="props.position"
        :maximizable="props.maximizable"
        :maximizeicon="props.maximizeicon"
        :style="props.style"
        :breakpoints="props.breakpoints"
        :draggable="props.draggable"
        :dismissable-mask="props.dismissableMask"
    >
        <template v-if="slots.header" #header>
            <slot name="header" />
        </template>
        <slot name="content" />
        <template v-if="slots.footer" #footer>
            <slot name="footer" />
        </template>
    </Dialog>
    <Button
        v-if="props.button"
        :class="props.buttonClass"
        :severity="props.buttonSeverity"
        :label="props.buttonLabel"
        :outlined="props.buttonOutlined"
        :icon="props.buttonIcon"
        :raised="props.buttonRaised"
        @click="visible = true"
    />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type Position = 'center' | 'left' | 'top' | 'bottom' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | undefined

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    header: {
        type: String,
        default: 'Header'
    },
    button: {
        type: Boolean,
        default: false
    },
    buttonLabel: {
        type: String,
        default: 'Anzeigen'
    },
    buttonIcon: {
        type: String,
        default: 'pi pi-external-link'
    },
    buttonSeverity: {
        type: String,
        default: undefined
    },
    buttonOutlined: {
        type: Boolean,
        default: false
    },
    buttonRaised: {
        type: Boolean,
        default: false
    },
    buttonClass: {
        type: String,
        default: undefined
    },
    position: {
        type: String as PropType<Position>,
        default: 'center'
    },
    draggable: {
        type: Boolean,
        default: false
    },
    closeicon: {
        type: Boolean,
        default: true
    },
    dismissableMask: {
        type: Boolean,
        default: true
    },
    maximizable: {
        type: Boolean,
        default: false
    },
    maximizeicon: {
        type: Boolean,
        default: true
    },
    style: {
        type: [String, Object],
        default: () => { return { width: '30vw', minWidth: 'fit-content', maxWidth: '40rem' } }
    },
    breakpoints: {
        type: Object,
        default: () => { return { '960px': '75vw', '641px': '100vw' } }
    }
})

// Events
const emit = defineEmits(['close'])

// Composables
const slots = useSlots()

// Show modal
const visible = ref(false)

// Watch for changes in props.showModal and update visible
watch(() => props.showModal, (value) => {
    visible.value = value
})

// Watch for changes in visible and emit close event
watch(() => visible.value, (value) => {
    if (!value) { emit('close', value) }
})

// Modal methods
const close = () => { visible.value = false } // Close
const open = () => { visible.value = true } // Open
const toggle = () => { visible.value = !visible.value } // Toggle visibility

// Expose methods
defineExpose({
    close,
    open,
    toggle
})
</script>
