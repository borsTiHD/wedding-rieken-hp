<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col gap-4">
            <DatePicker v-model="time" class="grow" timeOnly hourFormat="24" showIcon />
            <FormKit
                type="text"
                name="event"
                :label="t('admin.dailyAgenda.newEvent.formkit.labelEvent')"
                :help="t('admin.dailyAgenda.newEvent.formkit.labelEventHelp')"
                placeholder="zb. Sektempfang..."
                validation="required|length:3"
            />

            <div class="flex gap-2">
                <Button :label="t('admin.dailyAgenda.newEvent.formkit.submit')" icon="pi pi-user-plus" type="submit" raised :loading="loading || isFetching" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useToast } from 'primevue/usetoast'
import { useContent } from '@/composables/useContent'

type FormData = {
    event: string
}

// Composables
const toast = useToast()
const { t } = useI18n()

// Emit event
const emit = defineEmits(['created'])

// Content
const { isFetching, refetch, addDailyAgendaItem } = useContent()

// Data
const loading = ref(false)
const newTime = dayjs().hour(16).minute(0).second(0).toDate() // Set default time to 16:00 for new events
const time = ref(newTime)

// Submit button
const handleSubmit = async(form: FormData) => {
    loading.value = true
    await createNewEvent(form).catch(() => { return false })
    loading.value = false
}

// Create new event function
const createNewEvent = async(form: FormData) => {
    const timeOnly = dayjs(time.value).format('HH:mm')
    const newItem = {
        time: timeOnly,
        event: form.event
    }

    await addDailyAgendaItem(newItem).then(async() => {
        await refetch() // Refresh content
        toast.add({ severity: 'success', summary: t('admin.dailyAgenda.newEvent.success'), life: 3000 })
    }).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'admin.dailyAgenda.newEvent.error')
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 10000 })
        return undefined
    })

    // Emit event to parent
    emit('created')
}
</script>
