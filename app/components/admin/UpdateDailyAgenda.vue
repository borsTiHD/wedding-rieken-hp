<script setup lang="ts">
import type { DailyAgenda } from '@/queries/content/model'
import CreateDailyAgendaEvent from '@/components/admin/CreateDailyAgendaEvent.vue'
import DisplayModal from '@/components/DisplayModal.vue'
import { useContent } from '@/composables/useContent'
import { useModalPosition } from '@/composables/useModalPosition'
import { useToast } from 'primevue/usetoast'

// Composables
const { t } = useI18n()
const toast = useToast()
const { modalPosition } = useModalPosition() // Modal position

// Content
const { dailyAgenda, isFetching, refetch, removeDailyAgendaItem } = useContent()

// Refs
const createEventModal = ref<InstanceType<typeof DisplayModal>>()

// Delete item
async function deleteItem(item: DailyAgenda) {
  await removeDailyAgendaItem(item).catch(() => {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.dailyAgenda.errorDeleteEvent'), life: 10000 })
  })

  await refetch().catch(() => {
    toast.add({ severity: 'error', summary: 'Error', detail: t('admin.dailyAgenda.error'), life: 10000 })
  })

  toast.add({ severity: 'success', summary: t('admin.dailyAgenda.successDeleteEvent'), life: 3000 })
}
</script>

<template>
  <Card class="grow">
    <template #title>
      <h2>{{ t('admin.dailyAgenda.header') }}</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <DataTable
          :value="dailyAgenda"
          table-style="min-width: 50rem"
          :loading="isFetching"
          size="small"
        >
          <template #header>
            <div class="flex flex-wrap sm:items-center gap-2">
              <!-- Refresh content -->
              <Button icon="pi pi-refresh" rounded raised @click="refetch()" />

              <!-- Create Event modal -->
              <DisplayModal
                ref="createEventModal"
                :position="modalPosition"
                :header="t('admin.dailyAgenda.newEvent.header')"
                button-class="w-full sm:w-fit"
                :button-label="t('admin.dailyAgenda.newEvent.addEvent')"
                button-icon="pi pi-plus"
                button-raised
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
                <Button icon="pi pi-trash" severity="danger" :loading="isFetching" rounded @click="deleteItem(slotProps.data as DailyAgenda)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>
