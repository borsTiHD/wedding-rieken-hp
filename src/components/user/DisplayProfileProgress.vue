<template>
    <Knob
        v-model="value"
        v-tooltip.left="'Profil vervollständigen'"
        aria-label="Profile completion progress"
        :size="50"
        readonly
    />
</template>

<script setup lang="ts">
const value = ref(66)

// TODO: Add a completion check for every state and make a progress circle
// Also add a linkt to the profile completion stepper if the profile is not complete
</script>
