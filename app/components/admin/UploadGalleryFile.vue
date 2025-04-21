<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import useFileServerApi from '@/composables/useFileServerApi'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

// Extend the File type
interface FileWithPreview extends File {
  objectURL?: string
}

const emit = defineEmits(['uploaded'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { uploadFile } = useFileServerApi()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Max file size for picture
const maxFileSize = 10 * 1000 * 1000 // in bytes (10MB)
const maxFileSizeInMB = maxFileSize / 1000000

// Upload ref
const visible = ref(false)
const loading = ref(false)
const uploadLabel = t('admin.uploadGalleryFile.uploadLabel')
const invalidFileSizeMessage = t('admin.uploadGalleryFile.invalidFileSizeMessage', { maxFilesize: `${maxFileSizeInMB}MB` })

const selectedFiles = ref<FileWithPreview[]>([])
const uploadedFiles = ref<FileWithPreview[]>([])
const totalSelectedSize = computed(() => selectedFiles.value.reduce((acc, file) => acc + file.size, 0))
const totalUploadedSize = computed(() => uploadedFiles.value.reduce((acc, file) => acc + file.size, 0))
const totalSize = computed(() => totalSelectedSize.value + totalUploadedSize.value)
const totalSizePercent = computed(() => totalSize.value > 0 ? Math.round((totalUploadedSize.value / totalSize.value) * 100) : 0)

async function onUpload() {
  // Check if user is logged in
  if (!user.value) {
    throw new Error(t('firebase.custom.noUserLoggedIn'))
  }

  // Check if user is admin
  if (userProfile.value && userProfile.value.role !== 'admin') {
    throw new Error(t('admin.notAdminError'))
  }

  // Get files
  const files = selectedFiles.value

  // Check if files exist
  if (!files?.length) {
    toast.add({
      severity: 'error',
      summary: t('admin.uploadGalleryFile.noFileSelected'),
      detail: t('admin.uploadGalleryFile.noFileSelectedDetail'),
      life: 10000,
    })
    return false
  }

  loading.value = true
  let successCount = 0
  let errorCount = 0

  while (selectedFiles.value.length > 0) {
    const parallelUploads = 5
    const batch = selectedFiles.value.slice(0, parallelUploads)

    const uploadPromises = batch.map(file =>
      uploadFile(file, 'gallery')
        .then(() => {
          // Add to uploadedFiles and remove from selectedFiles
          uploadedFiles.value.push(file)
          selectedFiles.value = selectedFiles.value.filter(f => f !== file)
          successCount++
        })
        .catch((error) => {
          console.error(`Error uploading file ${file.name}:`, error)
          const fileName = file.name || 'Unknown file'
          toast.add({
            severity: 'error',
            summary: t('admin.uploadGalleryFile.error'),
            detail: t('admin.uploadGalleryFile.errorDetail', { fileName }),
            life: 10000,
          })
          errorCount++
        }),
    )

    // Wait for the current batch to finish
    await Promise.allSettled(uploadPromises)
  }

  // Show success message if any files were uploaded
  if (successCount > 0) {
    toast.add({
      severity: 'success',
      summary: t('admin.uploadGalleryFile.success'),
      detail: t('admin.uploadGalleryFile.successDetail', { count: successCount }),
      life: 3000,
    })

    // Emit event to parent
    emit('uploaded')
  }

  if (errorCount > 0) {
    console.error(`${errorCount} file(s) failed to upload.`)
  }

  loading.value = false
}

function onRemoveTemplatingFile(file: FileWithPreview, removeFileCallback: (index: number) => void, index: number) {
  // Revoke object URLs when removing files
  if (file.objectURL) {
    URL.revokeObjectURL(file.objectURL)
  }

  selectedFiles.value = selectedFiles.value.filter((f: FileWithPreview) => f !== file)
  uploadedFiles.value = uploadedFiles.value.filter((f: FileWithPreview) => f !== file)
  removeFileCallback(index)
}

function onClearAll(clear: () => void) {
  clear()
  selectedFiles.value = []
  uploadedFiles.value = []
}

function onSelectedFiles(event: FileUploadUploaderEvent) {
  const newFiles = event.files as File[]
  selectedFiles.value = newFiles?.map((file: File) => {
    const fileWithPreview: FileWithPreview = Object.assign(file, {
      objectURL: URL.createObjectURL(file),
    })
    return fileWithPreview
  })
}

function readableSize(size: number) {
  if (size < 1024)
    return `${size} B`
  else if (size < 1024 * 1024)
    return `${(size / 1024).toFixed(2)} KB`
  else if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

watch(visible, (newValue) => {
  if (!newValue) {
    // Revoke object URLs when closing the dialog
    selectedFiles.value.forEach((file: FileWithPreview) => {
      if (file.objectURL) {
        URL.revokeObjectURL(file.objectURL)
      }
    })
    selectedFiles.value = []
    uploadedFiles.value = []
  }
})
</script>

<template>
  <div class="flex flex-col">
    <Button icon="pi pi-plus" :label="uploadLabel" type="button" class="w-full" @click="visible = true" />
    <Dialog v-model:visible="visible" maximizable modal :draggable="false" :header="uploadLabel" class="w-full md:w-[42rem] lg:w-[66rem]">
      <FileUpload
        name="photo[]"
        multiple
        accept="image/*"
        :max-file-size="maxFileSize"
        :invalid-file-size-message="invalidFileSizeMessage"
        custom-upload
        :pt="{
          root: 'border-0',
        }"
        @select="onSelectedFiles"
      >
        <template #header="{ chooseCallback, clearCallback, files }">
          <div class="flex flex-col flex-1 gap-4">
            <div class="flex gap-2">
              <Button icon="pi pi-images" rounded outlined severity="secondary" @click="chooseCallback()" />
              <Button icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0" :loading="loading" @click="onUpload" />
              <Button icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0" @click="onClearAll(clearCallback)" />
            </div>

            <div class="flex flex-wrap justify-between items-center flex-1 gap-1">
              <ProgressBar :value="totalSizePercent" :show-value="false" class="md:w-20rem h-4 w-full md:ml-auto">
                <span class="whitespace-nowrap text-white">{{ totalSize }}B / 1Mb</span>
              </ProgressBar>
              <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                <span>Gesamtgröße: {{ readableSize(totalSize) }}</span>
                <span>Hochgeladen: {{ readableSize(totalUploadedSize) }}</span>
                <span>Fortschritt: {{ totalSizePercent }}%</span>
              </div>
            </div>
          </div>
        </template>
        <template #content="{ removeUploadedFileCallback, removeFileCallback, messages }">
          <div class="flex flex-col gap-8 pt-4">
            <Message v-for="message of messages" :key="message" :class="{ 'mb-8': !selectedFiles.length && !uploadedFiles.length }" severity="error">
              {{ message }}
            </Message>

            <div v-if="selectedFiles.length > 0">
              <h5>Pending</h5>
              <div class="flex flex-wrap gap-4">
                <div v-for="(file, index) of selectedFiles" :key="file.name + file.type + file.size" class="p-8 grow rounded-border flex flex-col border border-gray-200 items-center gap-2">
                  <div>
                    <img role="presentation" :alt="file.name" :src="(file as FileWithPreview)?.objectURL" width="100" height="50">
                  </div>
                  <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                  <div>{{ readableSize(file.size) }}</div>
                  <Badge value="Pending" severity="warn" />
                  <Button icon="pi pi-times" outlined rounded severity="danger" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" />
                </div>
              </div>
            </div>

            <div v-if="uploadedFiles.length > 0">
              <h5>Completed</h5>
              <div class="flex flex-wrap gap-4">
                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-8 grow rounded-border flex flex-col border border-gray-200 items-center gap-2">
                  <div>
                    <img role="presentation" :alt="file.name" :src="(file as FileWithPreview)?.objectURL" width="100" height="50">
                  </div>
                  <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                  <div>{{ readableSize(file.size) }}</div>
                  <Badge value="Completed" class="mt-4" severity="success" />
                  <Button icon="pi pi-times" outlined rounded severity="danger" @click="onRemoveTemplatingFile(file, removeUploadedFileCallback, index)" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex items-center justify-center flex-col">
            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
            <p class="mt-6 mb-0">
              Drag and drop files to here to upload.
            </p>
          </div>
        </template>
      </FileUpload>
    </Dialog>
  </div>
</template>
