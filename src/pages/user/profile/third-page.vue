<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <span>IAM A CHILD - THIRD PAGE</span>
                <span>TODO: Check Profilbild</span>

                <div class="flex">
                    <Button label="Prev page" @click="navPage('prev')" />
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
const emit = defineEmits(['next-page', 'prev-page'])
const navPage = (to: 'next' | 'prev') => emit(`${to}-page`)
</script>
