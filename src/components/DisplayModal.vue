<template>
    <Dialog
        v-model:visible="visible"
        modal
        :header="props.header"
        :closeicon="props.closeicon"
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
    <Button v-if="props.button" :label="props.buttonLabel" icon="pi pi-external-link" @click="visible = true" />
</template>

<script setup lang="ts">
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
        default: true
    },
    buttonLabel: {
        type: String,
        default: 'Anzeigen'
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
        default: () => { return { width: '50vw' } }
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
</script>
