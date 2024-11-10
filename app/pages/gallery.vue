<template>
    <main class="mx-auto flex flex-col">
        <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
            <ShowGallery :images="images" />
        </div>
    </main>
</template>

<script setup lang="ts">
import ShowGallery from '@/components/gallery/ShowGallery.vue'

import pic1 from '@/assets/img/1-IMG_8097.jpeg'
import pic2 from '@/assets/img/1-IMG_8139.jpeg'
import pic3 from '@/assets/img/1-IMG_8232.jpeg'
import pic4 from '@/assets/img/1-IMG_8400.jpeg'

// import pic1 from '@/assets/img/pexels-photo-2253870.jpeg'
// import pic2 from '@/assets/img/pexels-photo-371312.jpeg'
// import pic3 from '@/assets/img/pexels-photo-752842.jpeg'
// import pic4 from '@/assets/img/pexels-photo-1295995.jpeg'
// import pic5 from '@/assets/img/pexels-photo-1630860.jpeg'
// import pic6 from '@/assets/img/pexels-photo-1779491.jpeg'
// import pic7 from '@/assets/img/pexels-photo-2959196.jpeg'

const images = [
    { itemImageSrc: pic1, thumbnailImageSrc: pic1, alt: 'Description for Image 1', title: 'Title 1' },
    { itemImageSrc: pic2, thumbnailImageSrc: pic2, alt: 'Description for Image 2', title: 'Title 2' },
    { itemImageSrc: pic3, thumbnailImageSrc: pic3, alt: 'Description for Image 3', title: 'Title 3' },
    { itemImageSrc: pic4, thumbnailImageSrc: pic4, alt: 'Description for Image 4', title: 'Title 4' }
]
</script>
