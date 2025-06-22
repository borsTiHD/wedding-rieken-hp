<script setup lang="ts">
const { refreshToken } = useFirebaseAuth()
refreshToken() // Refresh token to avoid 401 error

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files && target.files[0]
  // console.log('event:', event)
  if (file) {
    // hier kannst du das Bild an dein Backend schicken
    uploadPhoto(file as File)
  }
}

async function uploadPhoto(file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  // console.log('file:', file)
  // console.log('Uploading photo:', file.name)
  // console.log('Form data:', formData)
  // await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData,
  // });
}
</script>

<template>
  <main class="mx-auto flex flex-col">
    <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
      <div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          capture="environment"
          style="display: none"
          @change="onFileChange"
        >
        <Button label="Foto aufnehmen" @click="triggerFileInput" />
      </div>
    </div>
  </main>
</template>
