<template>
    <div class="flex">
        <Dropdown v-model="locale" :options="availableLocales" optionLabel="label" optionValue="code" @change="onLanguageChange">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center gap-2">
                    <span :class="`fi fi-${slotProps.value}`" />
                    <!-- <div>{{ slotProps.value.label }}</div> -->
                </div>
                <span v-else>-</span>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center gap-2">
                    <span :class="`fi fi-${slotProps.option.code}`" />
                    <div>{{ slotProps.option.label }}</div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown'

// Language options
const { locale, locales, setLocale, setLocaleCookie } = useI18n()
const availableLocales = computed(() => {
    return locales.value.map((locale) => {
        return {
            code: typeof locale === 'string' ? locale : locale.code,
            label: typeof locale === 'string' ? locale : locale.name
        } as { code: string; label: string }
    })
})

// On language change
const onLanguageChange = (event: DropdownChangeEvent) => {
    const selectedLocale = event.value
    setLocaleCookie(selectedLocale)
    setLocale(selectedLocale)
}
</script>
