<template>
    <!-- You are not an admin -->
    <Card class="card-primary w-full">
        <template #content>
            <i18n-t keypath="user.userRole.notAdmin" tag="h2" class="text-2xl text-center whitespace-pre-line">
                <template #ghost>
                    <span class="ml-4 inline-block wobble-hor-bottom">{{ t('user.userRole.ghost') }}</span>
                </template>
            </i18n-t>
        </template>
    </Card>

    <FlyingGhosts />
</template>

<script setup lang="ts">
import FlyingGhosts from '@/components/admin/FlyingGhosts.vue'

// Localisation
const { t } = useI18n()

// TODO: Adding cute ghosts flying around the page
</script>
