<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.witnesses.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <DataTable
                    :value="witnesses"
                    tableStyle="min-width: 50rem"
                    :loading="isFetching"
                    size="small"
                >
                    <template #header>
                        <div class="flex flex-wrap sm:items-center gap-2">
                            <!-- Refresh content -->
                            <Button icon="pi pi-refresh" rounded raised @click="refetch()" />

                            <!-- Create Witness modal -->
                            <DisplayModal
                                ref="createWitnessModal"
                                :position="modalPosition"
                                :header="t('admin.witnesses.newWitness.header')"
                                buttonClass="w-full sm:w-fit"
                                :buttonLabel="t('admin.witnesses.newWitness.addWitness')"
                                buttonIcon="pi pi-plus"
                                buttonRaised
                                button
                            >
                                <template #content>
                                    <CreateWitness @created="createWitnessModal?.close()" />
                                </template>
                            </DisplayModal>
                        </div>
                    </template>

                    <Column field="name" :header="t('admin.witnesses.name')" />
                    <Column field="phone" :header="t('admin.witnesses.phone')" />
                    <Column field="actions" :header="t('admin.witnesses.actions')">
                        <template #body="slotProps">
                            <div class="flex gap-1">
                                <Button icon="pi pi-trash" severity="danger" :loading="isFetching" rounded @click="deleteItem(slotProps.data as Witness)" />
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
import CreateWitness from '@/components/admin/CreateWitness.vue'
import { useModalPosition } from '@/composables/useModalPosition'
import { useContent } from '@/composables/useContent'
import type { Witness } from '@/queries/content/model'

// Composables
const { t } = useI18n()
const toast = useToast()
const { modalPosition } = useModalPosition()

// Content
const { witnesses, isFetching, refetch, removeWitness } = useContent()

// Refs
const createWitnessModal = ref<InstanceType<typeof DisplayModal>>()

// Delete item
const deleteItem = async(item: Witness) => {
    await removeWitness(item).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.witnesses.errorDeleteWitness'), life: 10000 })
    })

    await refetch().catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.witnesses.error'), life: 10000 })
    })

    toast.add({ severity: 'success', summary: t('admin.witnesses.successDeleteWitness'), life: 3000 })
}
</script>
