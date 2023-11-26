<template>
    <!-- You are not an admin -->
    <Card class="card-primary w-full">
        <template #content>
            <h2 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h2>
        </template>
    </Card>
</template>

<script setup lang="ts">
// Localisation
const { t } = useI18n()

// TODO: Adding a pulse animation to the emoji
// Adding more easter eggs?
</script>
