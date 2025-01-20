<script setup lang="ts">
import type { PartialUserProfile } from '@/types/UserProfile'
import { useUserStore } from '@/stores/user'
import { BooBash } from 'vue-boo-bash'
import BackgroundMusic from 'vue-boo-bash/Ghost_House_Orchestral_Cover.mp3'
import 'vue-boo-bash/style.css'

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()
const emitter = useEmitter() // Eventbus emitter

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
const userHighscore = computed(() => userProfile.value.highscore)

// Game settings
const settings = {
  music: BackgroundMusic, // specify source for background music
}

// New game event will hide the navbar and footer
function newGame() {
  emitter.$emit('boo-bash', true)
}

// Game over event
async function gameOver(event: { score: number, highScore: number }) {
  // Game Over event will show the navbar and footer again
  emitter.$emit('boo-bash', false)

  // Check if user is logged in
  // and if the new highscore is higher than the current highscore
  // then update highscore
  if (user.value.uid && (event.highScore > userHighscore.value || !userHighscore.value)) {
    const data: PartialUserProfile = { highscore: event.highScore }
    const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('ghostGame.error'),
        detail: error.message,
        life: 10000,
      })
      return false
    })

    // Update user
    userStore.refreshUserProfile()

    // Show success toast
    if (response) {
      toast.add({
        severity: 'success',
        summary: t('ghostGame.success'),
        detail: t('ghostGame.successDetail'),
        life: 5000,
      })
    }
  }
}
</script>

<template>
  <BooBash :settings="settings" @new-game="newGame" @game-over="gameOver">
    <!-- Scoreboard slot is optional -->
    <template #scoreboard="{ score, time, running }">
      <div v-if="running" class="mt-16 mb-auto p-4 flex flex-col items-center bg-white rounded-xl shadow-lg select-none pointer-events-none">
        <h2 class="text-2xl font-bold">
          {{ t('ghostGame.scoreboard') }}
        </h2>
        <p>{{ t('ghostGame.score') }}: {{ score }}</p>
        <p v-if="userHighscore">
          {{ t('ghostGame.highscore') }}: {{ userHighscore }}
        </p>
        <p>{{ t('ghostGame.time') }}: {{ time }}</p>
      </div>
    </template>

    <!-- Game Over slot is optional -->
    <template #gameOver="{ score, highScore, show, closeGameOver }">
      <div v-if="show" class="mt-16 mb-auto p-4 flex flex-col items-center bg-white rounded-xl shadow-lg ">
        <h2 class="text-2xl font-bold">
          {{ t('ghostGame.gameover') }}
        </h2>
        <p>{{ t('ghostGame.score') }}: {{ score }}</p>
        <p>{{ t('ghostGame.highscore') }}: {{ userHighscore ? userHighscore : highScore }}</p>

        <Button :label="t('ghostGame.close')" severity="info" class="mt-4" @click="closeGameOver" />
      </div>
    </template>
  </BooBash>
</template>
