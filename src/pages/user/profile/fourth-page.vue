<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <span>IAM A CHILD - FOURTH PAGE</span>
                <span>TODO: Invitation State (annehmen/ablehnen)</span>
                <span>TODO: Additional Guests</span>

                <div class="flex">
                    <Button label="Prev page" @click="navPage('prev')" />
                    <Button label="Complete" class="ml-auto" @click="navPage('complete')" />
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
const emit = defineEmits(['prev-page', 'complete-page'])
const navPage = (to: 'prev' | 'complete') => emit(`${to}-page`)
</script>
