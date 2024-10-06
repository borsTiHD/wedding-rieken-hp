<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.changeSpotifyPlaylist.header') }}</h2>
        </template>
        <template #content>
            <FormKit
                :id="formId"
                v-slot="{ state: { valid } }"
                type="form"
                :actions="false"
                @submit="handleSubmit"
            >
                <div class="flex flex-wrap items-center gap-4">
                    <FormKit
                        v-model="defaultPlaylist"
                        type="text"
                        name="playlist"
                        outer-class="flex-1 w-full"
                        :label="t('admin.changeSpotifyPlaylist.label')"
                        validation="required|length:5"
                    />
                    <Button :label="t('admin.changeLocation.submit')" class="basis-full" icon="pi pi-map-marker" raised :loading="loading" :disabled="!valid" @click="submitForm(formId)" />
                </div>
            </FormKit>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { submitForm } from '@formkit/core'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useAppStore } from '@/stores/app'
import type { PartialConfig } from '@/types/Config'

// Composables
const { t } = useI18n() // Localisation
const toast = useToast()

// App config
const appStore = useAppStore()

// Data
const loading = ref(false)
const defaultPlaylist = ref(appStore.spotifyPlaylist)
const formId = 'changePlaylistForm'

type FormValues = {
    playlist: string
}

// Submit button
const handleSubmit = async(form: FormValues) => {
    loading.value = true
    await changeSpotifyPlaylist(form).catch(() => { return false })
    loading.value = false
}

// Change Spotify Playlist
const changeSpotifyPlaylist = async(form: FormValues) => {
    // Create config object
    const config: PartialConfig = {
        spotifyPlaylist: form.playlist
    }

    // Update config
    await appStore.updateConfig(config).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
        toast.add({
            severity: 'error',
            summary: t('admin.changeSpotifyPlaylist.error'),
            detail: errorMessage,
            life: 5000
        })
        throw new Error(error.message)
    })

    // Show success message
    toast.add({
        severity: 'success',
        summary: t('admin.changeSpotifyPlaylist.success'),
        detail: t('admin.changeSpotifyPlaylist.successDetail'),
        life: 5000
    })

    // Update app config
    appStore.fetchConfig()
}
</script>
