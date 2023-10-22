<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Header -->
                <h1 class="text-4xl">{{ t('profileStepper.userInformation.header') }}</h1>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.userInformation.text') }}</p>
                    <span>TODO: Check Email (+ verification), Name and Phone</span>
                </div>

                <!-- State complete -->
                <p v-else>{{ t('profileStepper.userInformation.textComplete') }}</p>

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

// Localisation
const { t } = useI18n()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.userInformation.header')))
</script>
