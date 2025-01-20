<script setup lang="ts">
const { checkState } = useProfileChecker()

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Refs
const profileCompletionLink = computed(() => localePath('/user/profile/'))

// Color of the knob based on the state
const color = computed(() => {
  if (checkState.value === 100) {
    return 'green'
  }
  else if (checkState.value >= 50) {
    return 'orange'
  }
  else {
    return 'red'
  }
})
</script>

<template>
  <NuxtLink :to="profileCompletionLink">
    <Knob
      v-model="checkState"
      v-tooltip.left="t('user.profileProgress.tooltip')"
      :value-color="color"
      aria-label="Profile completion progress"
      :size="50"
      readonly
    />
  </NuxtLink>
</template>
