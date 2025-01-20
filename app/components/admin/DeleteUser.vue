<script setup lang="ts">
import useBackendApi from '@/composables/useBackendApi'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

interface Props { uid: string }
const props = defineProps<Props>()

// Emit event
const emit = defineEmits(['deleted'])

// Composables
const confirm = useConfirm()
const toast = useToast()
const { t } = useI18n()
const { deleteUser } = useBackendApi()

// Data
const loading = ref(false)

// Confirm dialog
async function onClick(event: MouseEvent) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t('admin.listUsers.deleteUser.confirmMessage'),
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
      await deleteUserAccount().catch(() => { return false })
      loading.value = false
    },
  })
}

async function deleteUserAccount() {
  // Check if uid is set
  if (!props.uid) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.listUsers.deleteUser.errorNoUid'), life: 10000 })
    throw new Error(t('admin.listUsers.deleteUser.errorNoUid'))
  }

  // Send request to API to delete user
  const response = await deleteUser(props.uid).catch((error: { statusMessage: string }) => {
    toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
    console.error(error)
    throw error
  })

  // Check if response is ok
  if (!response.success) {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.listUsers.deleteUser.error'), life: 10000 })
    throw new Error(t('admin.listUsers.deleteUser.error'))
  }

  // Show toast
  toast.add({ severity: 'success', summary: t('admin.listUsers.deleteUser.success'), life: 3000 })

  // Emit event to parent
  emit('deleted')
}
</script>

<template>
  <ConfirmPopup />
  <Button
    v-tooltip.left="t('admin.listUsers.deleteUser.tooltip')"
    icon="pi pi-user-minus"
    size="small"
    severity="danger"
    outlined
    @click="onClick($event)"
  />
</template>
