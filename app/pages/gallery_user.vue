<script setup lang="ts">
const { refreshToken } = useFirebaseAuth()
refreshToken() // Refresh token to avoid 401 error
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      xxx
    </div>
  </main>
</template>
