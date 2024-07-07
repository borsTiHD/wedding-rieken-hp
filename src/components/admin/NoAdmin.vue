<template>
    <!-- You are not an admin -->
    <Card class="w-full">
        <template #content>
            <i18n-t keypath="user.userRole.notAdmin" tag="h2" class="text-2xl text-center whitespace-pre-line">
                <template #ghost>
                    <span class="ml-4 inline-block wobble-hor-bottom">{{ t('user.userRole.ghost') }}</span>
                </template>
            </i18n-t>
        </template>
    </Card>

    <!-- <GhostsGame /> -->
    <BooBash :settings="settings" @game-over="gameOver" />
</template>

<script setup lang="ts">
import { BooBash } from 'vue-boo-bash'
import 'vue-boo-bash/style.css'
import BackgroundMusic from 'vue-boo-bash/Ghost_House_Orchestral_Cover.mp3'

// Localisation
const { t } = useI18n()

// Game settings
const settings = {
    music: BackgroundMusic // specify source for background music
}

const gameOver = (event: { score: number; highScore: number }) => {
    console.log('GAMEOVER', event)
    // TODO: Check Score, or HighScore with Firebase and set new score if higher
}
</script>
