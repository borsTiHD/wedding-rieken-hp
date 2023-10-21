<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <span>IAM A CHILD - INDEX PAGE</span>
                <span>TODO: Prüfen ob man registriert ist, wenn nicht, register Form anzeigen</span>

                <div class="flex">
                    <Button label="Next page" class="ml-auto" @click="navPage('next')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['next-page'])
const navPage = (to: 'next') => emit(`${to}-page`)
</script>
