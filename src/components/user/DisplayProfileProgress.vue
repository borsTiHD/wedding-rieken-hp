<template>
    <NuxtLink :to="profileCompletionLink">
        <Knob
            v-model="checkState"
            v-tooltip.left="t('user.profileProgress.tooltip')"
            :valueColor="color"
            aria-label="Profile completion progress"
            :size="50"
            readonly
        />
    </NuxtLink>
</template>

<script setup lang="ts">
const { allChecks } = useProfileChecker()

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Refs
const profileCompletionLink = computed(() => localePath('/user/profile/'))

// Checks the state of the profile
// For that, it loops through all checks and returns a percentage of completion
const checkState = computed(() => {
    const totalChecks = allChecks.length
    let completedChecks = 0

    for (const check of allChecks) {
        if (check.check()) {
            completedChecks++
        }
    }

    return Math.round((completedChecks / totalChecks) * 100)
})

// Color of the knob based on the state
const color = computed(() => {
    if (checkState.value === 100) {
        return 'green'
    } else if (checkState.value >= 50) {
        return 'orange'
    } else {
        return 'red'
    }
})
</script>
