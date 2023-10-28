<template>
    <div class="flex">
        <!-- :label="t('settings.language')" -->
        <FormKit
            v-model="locale"
            type="select"
            name="language"
            outerClass="!m-0"
            :options="availableLocales"
            @change="onLanguageChange"
        />
    </div>
</template>

<script setup lang="ts">
// Language options
const { locale, locales, setLocale, setLocaleCookie } = useI18n()
const availableLocales = computed(() => {
    return locales.value.map((locale) => {
        return {
            value: typeof locale === 'string' ? locale : locale.code,
            label: typeof locale === 'string' ? locale : locale.name
        } as { value: string; label: string }
    })
})

// On language change
const onLanguageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const selectedLocale = target.value
    setLocaleCookie(selectedLocale)
    setLocale(selectedLocale)
}
</script>
