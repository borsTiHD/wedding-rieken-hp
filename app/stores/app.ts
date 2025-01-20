import type { PartialConfig } from '@/queries/config/model'
import { useFirestore } from '@/composables/useFirestore'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app-store', () => {
  const appConfig = useAppConfig()
  const { updateByCollectionAndId } = useFirestore()

  // // Bride and groom names
  const bride = ref<string>('Lisa')
  const groom = ref<string>('Marcel')

  // Theme color -> sets the background color of the app
  const themeColor = ref<string>(appConfig.theme.body)
  function setThemeColor(color: string) {
    themeColor.value = color
  }

  // Update config data
  async function updateConfig(config: PartialConfig) {
    return updateByCollectionAndId('app', 'config', config)
  }

  return { updateConfig, bride, groom, setThemeColor, themeColor }
})
