<script setup lang="ts">
import type { MinioFile } from '@@/shared/types/MinioFile'
import { DataTable } from '#components'
import DeleteFile from '@/components/admin/DeleteFile.vue'
import UploadGalleryFile from '@/components/admin/UploadGalleryFile.vue'
import DisplayPreviewImage from '@/components/gallery/DisplayPreviewImage.vue'
import createReadableDate from '@/composables/dateHelper'
import useFileServerApi from '@/composables/useFileServerApi'
import { useFolderQuery } from '@/queries/useFolderQuery'

interface FileRow {
  name: string
  path: string
  preview: string
  lastModified: string
  size: number
  data: MinioFile // The original `MinioFile` type
}

interface SlotProps {
  data: FileRow
}

// Composables
const { t } = useI18n()
const { downloadFile, downloadFolder } = useFileServerApi()

const galleryPath = ref('gallery/')
const { data: filesData, isLoading, isFetching, refetch } = useFolderQuery(galleryPath)
const loading = computed(() => isLoading.value || isFetching.value)

const globalSearch = ref('')
const selectedFiles = ref<FileRow[]>([])
const files = computed<FileRow[]>(() => {
  if (!filesData.value)
    return []
  const filteredFiles = filesData.value?.files.filter((file) => {
    const fileString = JSON.stringify(file).toLowerCase()
    return fileString.includes(globalSearch.value.toLowerCase())
  })?.map((item) => {
    // Type guard to ensure 'item.file' has a 'name' property
    if ('name' in item?.file) {
      return {
        name: getFileName(item),
        path: item.file.name,
        preview: item.file.name, // Complete path for downloading preview
        lastModified: item.file.lastModified,
        size: item.file.size,
        data: item as unknown as MinioFile,
      } as FileRow
    }
    return null // Handle cases where 'name' doesn't exist
  }).filter(file => file !== null) as FileRow[] // Remove null entries
  return filteredFiles || []
})

function getFileName(file: any) {
  return file.metadata?.metaData?.['original-filename'] || file?.file?.name
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

async function handleDownloadFiles(paths: string[]) {
  for (const path of paths) {
    await downloadFile(path).catch((error) => {
      console.error('Error downloading file:', error)
    })
  }
}

async function downloadAll() {
  await downloadFolder(galleryPath.value).catch((error) => {
    console.error('Error downloading folder:', error)
  })
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
          sort-field="lastModified"
          :sort-order="-1"
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
        >
          <template #header>
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-refresh" rounded raised @click="refetch()" />
              <UploadGalleryFile @uploaded="refetch()" />
              <Button
                icon="pi pi-download"
                size="small"
                severity="info"
                :label="selectedFiles.length > 0 ? t('admin.listGalleryFiles.downloadSelected') : t('admin.listGalleryFiles.downloadAll')"
                @click="selectedFiles.length > 0 ? handleDownloadFiles(selectedFiles.map(file => file.path)) : downloadAll()"
              />
              <DeleteFile
                :paths="selectedFiles.map((item) => item.path)"
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

          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="preview" :header="t('admin.listGalleryFiles.tableHeader.preview')">
            <template #body="slotProps">
              <DisplayPreviewImage :path="(slotProps as SlotProps).data.preview" />
            </template>
          </Column>
          <Column field="name" :header="t('admin.listGalleryFiles.tableHeader.name')" sortable>
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900 break-all">
                {{ (slotProps as SlotProps).data.name }}
              </span>
            </template>
          </Column>
          <Column field="lastModified" :header="t('admin.listGalleryFiles.tableHeader.lastModified')" sortable>
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900">
                {{ createReadableDate((slotProps as SlotProps).data.lastModified) }}
              </span>
            </template>
          </Column>
          <Column field="size" :header="t('admin.listGalleryFiles.tableHeader.size')" sortable>
            <template #body="slotProps">
              <span class="text-sm font-medium text-gray-900">
                {{ readableSize((slotProps as SlotProps).data.size) }}
              </span>
            </template>
          </Column>
          <Column :header="t('admin.listGalleryFiles.tableHeader.actions')">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  v-tooltip.bottom="t('admin.listGalleryFiles.tableHeader.download')"
                  icon="pi pi-download"
                  size="small"
                  severity="info"
                  @click="handleDownloadFiles([(slotProps as SlotProps).data.path])"
                />
                <DeleteFile
                  :paths="[(slotProps as SlotProps).data.path]"
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
