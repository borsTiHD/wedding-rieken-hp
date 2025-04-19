<script setup lang="ts">
import useFileServerApi from '@/composables/useFileServerApi'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

interface Props { path: string }
const props = defineProps<Props>()

// Emit event
const emit = defineEmits(['deleted'])

// Composables
const confirm = useConfirm()
const toast = useToast()
const { t } = useI18n()
const { deleteFile } = useFileServerApi()

// Data
const loading = ref(false)

// Confirm dialog
async function onClick(event: MouseEvent) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t('admin.deleteGalleryFile.confirmMessage'),
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      loading.value = true
      await deleteFileHandling().catch(() => false)
      loading.value = false
    },
  })
}

async function deleteFileHandling() {
  // Check if uid is set
  if (!props.path) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.deleteGalleryFile.noPath'), life: 10000 })
    throw new Error(t('admin.deleteGalleryFile.noPath'))
  }

  // Send request to API to delete user
  const response = await deleteFile(props.path).catch((error: { statusMessage: string }) => {
    toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
    console.error(error)
    throw error
  })

  // Check if response is ok
  if (!response?.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.deleteGalleryFile.error'), life: 10000 })
    throw new Error(t('admin.deleteGalleryFile.error'))
  }

  // Show toast
  toast.add({ severity: 'success', summary: t('admin.deleteGalleryFile.success'), detail: t('admin.deleteGalleryFile.successDetail'), life: 3000 })

  // Emit event to parent
  emit('deleted')
}
</script>

<template>
  <ConfirmPopup />
  <Button
    v-tooltip.left="t('admin.deleteGalleryFile.tooltip')"
    icon="pi pi-trash"
    size="small"
    severity="danger"
    outlined
    @click="onClick($event)"
  />
</template>
