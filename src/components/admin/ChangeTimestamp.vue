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
        <Button type="submit" label="Submit" @click="submitBtn" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useAppStore } from '@/stores/app'
import type { DataResults } from '@/types/pages'

// Composables
const toast = useToast()

// App config
const appStore = useAppStore()
const config = appStore.config

// Data
const date = ref()
const time = ref()
const minDate = ref(new Date())

// Submit button
const submitBtn = async() => {
    // Check if date is selected
    if (!date.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No date selected', life: 5000 })
        throw new Error('No date selected')
    }

    // Check if time is selected
    if (!time.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No time selected', life: 5000 })
        throw new Error('No time selected')
    }

    // Combine date and time
    const newDate = new Date(date.value)
    const newTime = new Date(time.value)
    newDate.setHours(newTime.getHours(), newTime.getMinutes())
    newDate.setSeconds(0) // Set seconds to 0

    // Get timestamp from date
    const timestamp = Math.floor(newDate.getTime() / 1000)

    // Send request to API
    const response = await $fetch('/api/weddingdate/update', {
        method: 'POST',
        query: {
            value: timestamp
        }
    })

    // Check if results are good
    const results = response as DataResults
    if (!results) {
        const errorMsg = 'Could not update wedding date'
        console.error('No response found')
        toast.add({ severity: 'error', summary: 'Error', detail: errorMsg, life: 5000 })
    } else if (results.error) {
        const errorMsg = 'Could not update wedding date'
        console.error('Error:', results.error)
        toast.add({ severity: 'error', summary: 'Error', detail: errorMsg, life: 5000 })
    }

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
