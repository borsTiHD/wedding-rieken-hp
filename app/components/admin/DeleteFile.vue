<script setup lang="ts">
import useFileServerApi from '@/composables/useFileServerApi'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

interface Props { paths: string[], multiple?: boolean }
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
  // Check if paths are set
  if (!props.paths || props.paths.length === 0) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.deleteGalleryFile.noPath'), life: 10000 })
    throw new Error(t('admin.deleteGalleryFile.noPath'))
  }

  // Send requests to API to delete files
  const results = await Promise.allSettled(props.paths.map(path => deleteFile(path)))

  // Process results
  let hasErrors = false
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      hasErrors = true
      console.error(`Error deleting file at path: ${props.paths[index]}`, result.reason)
      toast.add({ severity: 'error', summary: 'Error', detail: t('admin.deleteGalleryFile.error'), life: 10000 })
    } else if (!result.value?.success) {
      hasErrors = true
      console.error(`Failed to delete file at path: ${props.paths[index]}`)
      toast.add({ severity: 'error', summary: 'Error', detail: t('admin.deleteGalleryFile.error'), life: 10000 })
    }
  })

  // Emit event to parent
  emit('deleted')

  // If there were errors, throw an error
  if (hasErrors) {
    throw new Error(t('admin.deleteGalleryFile.error'))
  }

  // Show success toast if all deletions succeeded
  toast.add({ severity: 'success', summary: t('admin.deleteGalleryFile.success'), detail: t('admin.deleteGalleryFile.successDetail'), life: 3000 })
}
</script>

<template>
  <ConfirmPopup />
  <Button
    v-tooltip.bottom="t('admin.deleteGalleryFile.tooltip')"
    icon="pi pi-trash"
    size="small"
    severity="danger"
    outlined
    :label="multiple ? t('admin.deleteGalleryFile.label') : undefined"
    @click="onClick($event)"
  />
</template>
