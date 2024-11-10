<template>
    <Image
        :alt="image.alt"
        :pt="{
            root: 'w-full h-full overflow-hidden rounded shadow-lg hover:shadow-xl cursor-pointer group',
            originalContainer: 'm-12 p-12'
        }"
        preview
    >
        <template #previewicon>
            <div class="w-full h-full flex items-center justify-center">
                <span
                    class="text-xl uppercase"
                    :class="[
                        'group-hover:motion-opacity-in-[0%] group-hover:motion-translate-y-in-[105%] motion-duration-[0.8s]',
                        'text-white px-4 py-2 rounded-lg',
                        // 'motion-opacity-out-[0%] motion-translate-y-out-[105%] motion-duration-[0.8s]'
                    ]"
                >{{ t('gallery.showImage.preview') }}</span>
            </div>
        </template>
        <template #image>
            <img :src="image.itemImageSrc" :alt="image.alt" class="w-full h-full object-cover group-hover:motion-scale-out-[1.4] motion-duration-[10s]">
        </template>
        <template #original="slotProps">
            <img :src="image.itemImageSrc" :alt="image.alt" :style="slotProps.style" @click="slotProps.previewCallback">
        </template>
    </Image>
</template>

<script setup lang="ts">
import type { Image } from '@/types/Image'

type Props = { image: Image }
const props = defineProps<Props>()
const { image } = toRefs(props)

const { t } = useI18n()
</script>
