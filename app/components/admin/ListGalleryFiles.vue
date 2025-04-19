<script setup lang="ts">
import { DataTable } from '#components'
import DeleteFile from '@/components/admin/DeleteFile.vue'
import UploadGalleryFile from '@/components/admin/UploadGalleryFile.vue'
import DisplayMinioFile from '@/components/user/DisplayMinioFile.vue'
import createReadableDate from '@/composables/dateHelper'
import { useFilesQuery } from '@/queries/useFilesQuery'

// Composables
const { t } = useI18n()

const galleryPath = ref('gallery/')
const { data: filesData, isLoading, isFetching, refetch } = useFilesQuery(galleryPath)
const loading = computed(() => isLoading.value || isFetching.value)

const globalSearch = ref('')
const selectedFiles = ref<any[]>([])
const files = computed(() => {
  if (!filesData.value)
    return []
  const filteredFiles = filesData.value?.files.filter((file: any) => {
    const fileName = getFileName(file)
    return fileName.toLowerCase().includes(globalSearch.value.toLowerCase())
  }) || []
  return filteredFiles.sort((a: any, b: any) => {
    const fileName = getFileName(a)
    const fileNameB = getFileName(b)
    return fileName.localeCompare(fileNameB)
  })
})

function getFileName(file: any) {
  return file.metadata?.metaData?.['original-filename'] || file.name
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
</script>

<template>
  <Card>
    <template #title>
      <div class="flex flex-col sm:flex-row items-baseline gap-4">
        {{ t('admin.listGalleryFiles.header') }}
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <DataTable
          v-model:selection="selectedFiles"
          :value="files"
          :loading="loading"
          paginator
          size="small"
          removable-sort
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
        >
          <template #header>
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-refresh" rounded raised @click="refetch()" />
              <UploadGalleryFile @uploaded="refetch()" />
              <DeleteFile
                :paths="selectedFiles.map((file) => file.file.name)"
                multiple
                @deleted="refetch()"
              />

              <!-- Search -->
              <IconField class="ml-auto">
                <InputIcon class="pi pi-search" />
                <InputText v-model="globalSearch" :placeholder="t('admin.listGalleryFiles.fileSearch.placeholder')" />
              </IconField>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="preview" :header="t('admin.listGalleryFiles.tableHeader.preview')">
            <template #body="slotProps">
              <DisplayMinioFile :path="slotProps.data.file.name" />
            </template>
          </Column>
          <Column field="name" :header="t('admin.listGalleryFiles.tableHeader.name')">
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900 truncate">
                {{ getFileName(slotProps.data) }}
              </span>
            </template>
          </Column>
          <Column field="lastModified" :header="t('admin.listGalleryFiles.tableHeader.lastModified')">
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900">
                {{ createReadableDate(slotProps.data.file.lastModified) }}
              </span>
            </template>
          </Column>
          <Column field="size" :header="t('admin.listGalleryFiles.tableHeader.size')">
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900">
                {{ readableSize(slotProps.data.file.size) }}
              </span>
            </template>
          </Column>
          <Column :header="t('admin.listGalleryFiles.tableHeader.actions')">
            <template #body="slotProps">
              <div v-if="slotProps.data.role !== 'admin'" class="flex items-center gap-2">
                <DeleteFile
                  :paths="[slotProps.data.file.name]"
                  @deleted="refetch()"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>
