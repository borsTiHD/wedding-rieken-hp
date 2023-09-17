<template>
    <div class="flex gap-4">
        <span class="p-input-icon-right">
            <i class="pi pi-calendar" />
            <Calendar v-model="date" date-format="dd.mm.yy" :minDate="minDate" />
        </span>
        <span class="p-input-icon-right">
            <i class="pi pi-clock" />
            <Calendar v-model="time" timeOnly />
        </span>
        <Button type="submit" label="Submit" @click="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useAppStore } from '@/stores/app'

// Composables
const toast = useToast()
const { update } = useFirestore() // Firestore composable

// App config
const appStore = useAppStore()
const config = appStore.config

// Data
const date = ref()
const time = ref()
const minDate = ref(new Date())

// Submit button
const handleSubmit = async() => {
    // Check if date is selected
    if (!date.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Kein Datum ausgewählt.', life: 5000 })
        throw new Error('No date selected')
    }

    // Check if time is selected
    if (!time.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Keine Uhrzeit ausgewählt.', life: 5000 })
        throw new Error('No time selected')
    }

    // Combine date and time
    const newDate = new Date(date.value)
    const newTime = new Date(time.value)
    newDate.setHours(newTime.getHours(), newTime.getMinutes())
    newDate.setSeconds(0) // Set seconds to 0

    // Get timestamp from date
    const timestamp = Math.floor(newDate.getTime() / 1000)

    // Update wedding date
    await update('app', 'config', 'weddingDate', timestamp).catch((error: { message: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 })
        throw new Error(error.message)
    })

    // Show success message
    toast.add({ severity: 'success', summary: 'Success', detail: 'Wedding date updated', life: 5000 })

    // Update app config
    appStore.fetchConfig()
}

onMounted(() => {
    if (!config?.weddingDate) {
        console.error('No wedding date found')
        return false
    }

    // Set default date from timestamp
    date.value = new Date()
    date.value.setTime(config?.weddingDate * 1000)

    // Set default time from timestamp
    time.value = new Date()
    time.value.setTime(config?.weddingDate * 1000)
})
</script>
