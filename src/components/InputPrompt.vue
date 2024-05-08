<template>
    <Dialog
        v-model:visible="displayModal"
        :header="formOptions.title"
        :dismissableMask="!formOptions.persistent"
        class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12"
        :draggable="false"
        modal
    >
        <FormKit
            v-slot="{ state: { valid } }"
            type="form"
            :actions="false"
            @submit="handleSubmit"
        >
            <div class="grid gap-4">
                <p>{{ formOptions.message }}</p>

                <div v-if="formOptions.formKitSchema" class="grid gap-2">
                    <FormKitSchema
                        :schema="formOptions.formKitSchema"
                        :library="formOptions.formKitLibrary"
                    />
                </div>

                <div class="flex flex-col sm:flex-row gap-2">
                    <Button :label="formOptions.cancelButton" icon="pi pi-times" class="whitespace-nowrap sm:ml-auto" text @click="onCancel" />
                    <Button :label="formOptions.okButton" icon="pi pi-check" type="submit" class="whitespace-nowrap" :disabled="!valid" />
                </div>
            </div>
        </FormKit>
    </Dialog>
</template>

<script setup lang="ts">
import type { FormKitSchemaNode } from '@formkit/core'

// Refs
const displayModal = ref(false)
const resolveRef = ref()
const rejectRef = ref()
const formOptions = reactive({
    title: '',
    message: '',
    okButton: '',
    cancelButton: '',
    persistent: true,
    formKitSchema: undefined as undefined | FormKitSchemaNode[],
    formKitLibrary: undefined
})

// Submit handler
const handleSubmit = async(form: { fileName: string, fileExtension: string }) => {
    resolveRef.value(form) // Resolve promise and pass form data
    closeModal()
}

// Cancel handler
const onCancel = () => {
    rejectRef.value(new Error('Dialog closed by user interaction.'))
    closeModal()
}

// Open/close modal
const closeModal = () => {
    displayModal.value = false
    cleanup()
}
const show = (options: { title?: string; message?: string; okButton?: string; cancelButton?: string; persistent?: boolean; formKitSchema?: FormKitSchemaNode[]; formKitLibrary?: undefined; }) => {
    // Set form options
    formOptions.title = options?.title || 'Default Title'
    formOptions.message = options?.message || 'Default Message'
    formOptions.okButton = options?.okButton || 'OK'
    formOptions.cancelButton = options?.cancelButton || 'Cancel'
    formOptions.persistent = options?.persistent || true
    formOptions.formKitSchema = options?.formKitSchema as FormKitSchemaNode[] || undefined
    formOptions.formKitLibrary = options?.formKitLibrary || undefined

    // Show modal
    displayModal.value = true

    // Return promise, so we can await the result
    return new Promise((resolve, reject) => {
        resolveRef.value = resolve
        rejectRef.value = reject
    })
}
defineExpose({ show }) // Exposer for parent ref

// Cleaning data on close
const cleanup = () => {
    resolveRef.value = null
    rejectRef.value = null
}

// Watch for changes in the displayModal ref
watch(displayModal, (val: boolean) => {
    if (!val) {
        if (rejectRef.value) rejectRef.value(new Error('Dialog closed by user interaction.'))
        cleanup()
    }
})
</script>
