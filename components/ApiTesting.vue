<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold underline text-sky-600">API Testing:</h1>
        <Button label="Get Data" severity="primary" icon="pi pi-check" @click="getData" />
        <Button label="Add random Data" severity="success" icon="pi pi-check" @click="addData" />
        <Button label="Delete random Data" severity="danger" icon="pi pi-check" @click="deleteData" />

        <h1 class="text-3xl font-bold underline text-red-600">Data:</h1>

        <div class="flex flex-col gap-4">
            <div v-for="item in data" :key="item.id" class="p-4 flex flex-col gap-4 border-2 border-gray-400">
                <h1 class="text-2xl font-bold">{{ item.title }}</h1>
                <h2 class="text-xl font-bold">{{ item.name }}</h2>
                <p class="text-lg">{{ item.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
export interface DataResults {
    result: Pages[],
    error?: string
}
export interface Pages {
    title: string
    name: string
    description: string
    id: string
}

// Moment - create timestamp for specific date
import moment from 'moment'
const now = moment().add(1, 'months')
const formatted = now.unix()
console.log('Formatted:', formatted)

const data = ref<Pages[]>([])

const getData = async() => {
    const response = await useFetch('/api/query', {
        query: {
            col: 'pages'
        }
    })

    const results = response.data.value as DataResults

    // Check if results are good
    if (!results) {
        console.error('No results found')
        return false
    } else if (results.error) {
        console.error('Error:', results.error)
        return false
    }

    // Set the data to the results
    data.value = results.result
}

const addData = async() => {
    // Generate a random string and push it to the database
    const colName = 'pages'
    const randomString = Math.random().toString(36).substring(7)
    const response = await $fetch('/api/add', {
        method: 'POST',
        query: {
            col: colName // Collection name
        },
        body: {
            name: `randompage-${randomString}`,
            title: `Random Page - ${randomString}`,
            description: 'This is a random page generated for testing purposes'
        }
    })

    // Check if results are good
    const results = response as DataResults
    if (!results) {
        console.error('No results found')
    } else if (results.error) {
        console.error('Error:', results.error)
    }

    // Refresh the data
    getData()
}

const deleteData = async() => {
    // Delete a random document from the database
    const response = await useFetch('/api/query', {
        query: {
            col: 'pages'
        }
    })

    // Get the results
    const results = response.data.value as DataResults
    const pages = results.result

    // Get a random document from the results
    const randomIndex = Math.floor(Math.random() * pages.length)
    const randomDoc = pages[randomIndex]

    // Delete the document
    const delResponse = await $fetch('/api/delete', {
        method: 'POST',
        query: {
            col: 'pages', // Collection name
            id: randomDoc.id // Document ID
        }
    })

    // Check if results are good
    const delResults = delResponse as DataResults
    if (!delResults) {
        console.error('No results found')
    } else if (delResults.error) {
        console.error('Error:', results.error)
    }

    // Refresh the data
    getData()
}

// Call the getData function on page load
getData()
</script>
