<script setup lang="ts">
type Position = 'center' | 'left' | 'top' | 'bottom' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | undefined

interface Props {
  showModal?: boolean
  header?: string
  button?: boolean
  buttonLabel?: string
  buttonIcon?: string
  buttonSeverity?: string
  buttonOutlined?: boolean
  buttonRaised?: boolean
  buttonClass?: string
  position?: Position
  draggable?: boolean
  closeicon?: boolean
  dismissableMask?: boolean
  maximizable?: boolean
  maximizeicon?: boolean
  style?: string | Record<string, string>
  breakpoints?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  header: 'Header',
  button: false,
  buttonLabel: 'Anzeigen',
  buttonIcon: 'pi pi-external-link',
  buttonSeverity: undefined,
  buttonOutlined: false,
  buttonRaised: false,
  buttonClass: undefined,
  position: 'center',
  draggable: false,
  closeicon: true,
  dismissableMask: true,
  maximizable: false,
  maximizeicon: true,
  style: () => { return { width: '30vw', minWidth: 'fit-content', maxWidth: '40rem' } },
  breakpoints: () => { return { '960px': '75vw', '641px': '100vw' } },
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
  if (!value) {
    emit('close', value)
  }
})

// Modal methods
function close() {
  visible.value = false
}
function open() {
  visible.value = true
}
function toggle() {
  visible.value = !visible.value
}

// Expose methods
defineExpose({
  close,
  open,
  toggle,
})
</script>

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
