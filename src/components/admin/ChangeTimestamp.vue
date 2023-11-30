<template>
    <div class="flex flex-col sm:flex-row gap-4">
        <span class="p-input-icon-right">
            <i class="pi pi-calendar" />
            <Calendar v-model="date" :date-format="t('general.inputDateFormat')" :minDate="minDate" />
        </span>
        <span class="p-input-icon-right">
            <i class="pi pi-clock" />
            <Calendar v-model="time" timeOnly />
        </span>
        <Button type="submit" :label="t('buttons.submit')" raised @click="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
    timestamp?: number
}>()

// Composables
const toast = useToast()
const { t } = useI18n()

// Data
const date = ref()
const time = ref()
const minDate = ref(new Date())

// Events
const emit = defineEmits(['change'])

// Submit button
const handleSubmit = async() => {
    // Check if date is selected
    if (!date.value) {
        toast.add({
            severity: 'error',
            summary: t('admin.changeDate.error'),
            detail: t('admin.changeDate.errorNoDate'),
            life: 5000
        })
        throw new Error(t('admin.changeDate.errorNoDate'))
    }

    // Check if time is selected
    if (!time.value) {
        toast.add({
            severity: 'error',
            summary: t('admin.changeDate.error'),
            detail: t('admin.changeDate.errorNoTime'),
            life: 5000
        })
        throw new Error(t('admin.changeDate.errorNoTime'))
    }

    // Combine date and time
    const newDate = new Date(date.value)
    const newTime = new Date(time.value)
    newDate.setHours(newTime.getHours(), newTime.getMinutes())
    newDate.setSeconds(0) // Set seconds to 0

    // Emit event
    emit('change', newDate)
}

onMounted(() => {
    if (!props.timestamp) {
        console.error(t('admin.changeDate.errorNoDateFound'))
        return false
    }

    // Set default date from timestamp
    date.value = new Date()
    date.value.setTime(props.timestamp * 1000)

    // Set default time from timestamp
    time.value = new Date()
    time.value.setTime(props.timestamp * 1000)
})
</script>
