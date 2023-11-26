<template>
    <!-- Modal for checking guest -->
    <DisplayModal ref="checkGuestModal" :position="modalPosition" :header="t('admin.listUsers.checkGuest.checkModalHeader')">
        <template #content>
            <div class="flex gap-2 w-full">
                <Button class="grow" :label="t('admin.listUsers.checkGuest.invite')" icon="pi pi-thumbs-up" type="submit" raised :loading="loading" @click="handleSubmit(true)" />
                <Button class="grow" :label="t('admin.listUsers.checkGuest.decline')" icon="pi pi-thumbs-down" type="submit" severity="danger" outlined :loading="loading" @click="handleSubmit(false)" />
            </div>
        </template>
    </DisplayModal>

    <!-- Button for showing the modal -->
    <Button
        v-if="mode === 'default'"
        v-tooltip.left="t('admin.listUsers.checkGuest.checkTooltip')"
        :label="t('admin.listUsers.checkGuest.checkLabel')"
        class="whitespace-nowrap"
        icon="pi pi-user-plus"
        size="small"
        severity="warning"
        raised
        @click="checkGuestModal?.open()"
    />

    <!-- Show another button on different mode -->
    <Button
        v-else-if="mode === 'changeInvitation'"
        v-tooltip.left="t('admin.listUsers.checkGuest.checkTooltipChangeInvitation')"
        class="whitespace-nowrap"
        icon="pi pi-user-edit"
        size="small"
        severity="info"
        outlined
        @click="checkGuestModal?.open()"
    />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import useBackendApi from '@/composables/useBackendApi'
import { useModalPosition } from '@/composables/useModalPosition'

type Props = {
    uid: string
    mode?: 'default' | 'changeInvitation'
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'default'
})

// Emit event
const emit = defineEmits(['changed'])

// Refs
const checkGuestModal = ref<InstanceType<typeof DisplayModal>>()

// Composables
const toast = useToast()
const { t } = useI18n()
const { updateUserRole } = useBackendApi()
const { modalPosition } = useModalPosition() // Modal position

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(value: boolean) => {
    loading.value = true
    await checkGuest(value).catch(() => { return false })
    loading.value = false

    // Close modal
    checkGuestModal.value?.close()
}

// Check guest and set the profile role
const checkGuest = async(value: boolean) => {
    // Set invitation response
    const role = value ? 'invited' : 'declined'

    // Send request to API to set new role
    const response = await updateUserRole(props.uid, role).catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        console.error(error)
        throw error
    })

    // Check if response is ok
    if (!response.result) {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.listUsers.checkGuest.error'), life: 10000 })
        throw new Error(t('admin.listUsers.checkGuest.error'))
    }

    // Show toast
    const successDetail = value ? t('admin.listUsers.checkGuest.successDetailInvited') : t('admin.listUsers.checkGuest.successDetailDeclined')
    toast.add({
        severity: 'success',
        summary: t('admin.listUsers.checkGuest.success'),
        detail: successDetail,
        life: 3000
    })

    // Emit event to parent
    emit('changed')
}
</script>
