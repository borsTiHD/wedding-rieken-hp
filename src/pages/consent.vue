<template>
    <main>
        <ClientOnly>
            <AppCookieConsent />
        </ClientOnly>
    </main>
</template>

<script setup lang="ts">
import AppCookieConsent from '@/components/layout/AppCookieConsent.vue'
</script>
