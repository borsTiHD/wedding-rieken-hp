<script setup lang="ts">
import type { DropdownChangeEvent } from 'primevue/dropdown'
import useLocale from '@/composables/useLocale'

// Language options
const { locale, locales } = useI18n()
const { setLanguage } = useLocale()
const availableLocales = computed(() => {
  return locales.value.map((locale) => {
    return {
      code: typeof locale === 'string' ? locale : locale.code,
      label: typeof locale === 'string' ? locale : locale.name,
    } as { code: string, label: string }
  })
})

// On language change
function onLanguageChange(event: DropdownChangeEvent) {
  const selectedLocale = event.value
  setLanguage(selectedLocale)
}
</script>

<template>
  <div class="flex">
    <Select v-model="locale" :options="availableLocales" option-label="label" option-value="code" :pt="{ trigger: 'w-fit mr-3' }" @change="onLanguageChange">
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2">
          <span :class="`fi fi-${slotProps.value}`" />
          <!-- <div>{{ slotProps.value.label }}</div> -->
        </div>
        <span v-else>-</span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <span :class="`fi fi-${slotProps.option.code}`" />
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>
