<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.dailyAgenda.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <DataTable :value="dailyAgenda" tableStyle="min-width: 50rem">
                    <template #header>
                        <div class="flex flex-wrap sm:items-center gap-2">
                            <!-- Refresh content -->
                            <Button icon="pi pi-refresh" rounded raised @click="fetchContent" />

                            <!-- Create Event modal -->
                            <DisplayModal
                                ref="createEventModal"
                                :position="modalPosition"
                                :header="t('admin.dailyAgenda.newEvent.header')"
                                buttonClass="w-full sm:w-fit"
                                :buttonLabel="t('admin.dailyAgenda.newEvent.addEvent')"
                                buttonIcon="pi pi-plus"
                                buttonRaised
                                button
                            >
                                <template #content>
                                    <CreateDailyAgendaEvent @created="createEventModal?.close()" />
                                </template>
                            </DisplayModal>
                        </div>
                    </template>

                    <Column field="time" :header="t('admin.dailyAgenda.time')" />
                    <Column field="event" :header="t('admin.dailyAgenda.event')" />
                    <Column field="actions" :header="t('admin.dailyAgenda.actions')">
                        <template #body="slotProps">
                            <div class="flex gap-1">
                                <Button icon="pi pi-trash" severity="danger" rounded @click="deleteItem(slotProps.data as DailyAgenda)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import CreateDailyAgendaEvent from '@/components/admin/CreateDailyAgendaEvent.vue'
import { useModalPosition } from '@/composables/useModalPosition'
import { useContentStore } from '@/stores/content'
import type { DailyAgenda } from '@/types/AppContent'

// Composables
const { t } = useI18n()
const toast = useToast()
const { modalPosition } = useModalPosition() // Modal position

// Store
const contentStore = useContentStore()
const dailyAgenda = computed(() => {
    // Sort by time
    const items = contentStore.dailyAgenda?.sort((a, b) => {
        return a.time.localeCompare(b.time)
    })
    return items || []
})

// Refs
const createEventModal = ref<InstanceType<typeof DisplayModal>>()

// Delete item
const deleteItem = async(item: DailyAgenda) => {
    await contentStore.removeDailyAgendaItem(item).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.dailyAgenda.errorDeleteEvent'), life: 10000 })
    })

    await fetchContent()

    toast.add({ severity: 'success', summary: t('admin.dailyAgenda.successDeleteEvent'), life: 3000 })
}

// Fetch content
const fetchContent = async() => {
    await contentStore.fetchContent().catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.dailyAgenda.error'), life: 10000 })
    })
}
</script>
