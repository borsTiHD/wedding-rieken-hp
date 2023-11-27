<template>
    <Card class="card-primary">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <h2 class="text-2xl text-center whitespace-pre-line">Gallery 1</h2>
                <div class="flex flex-col items-center gap-4">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex flex-col items-center gap-4">
                            <img :src="pic1" alt="pic1">
                            <img :src="pic2" alt="pic2">
                            <img :src="pic3" alt="pic3">
                        </div>

                        <div class="flex flex-col items-center gap-4">
                            <img :src="pic4" alt="pic4">
                            <img :src="pic5" alt="pic5">
                            <img :src="pic6" alt="pic6">
                        </div>

                        <div class="flex flex-col items-center gap-4">
                            <img :src="pic7" alt="pic7">
                        </div>
                    </div>
                </div>

                <h2 class="text-2xl text-center whitespace-pre-line">Gallery 2</h2>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in pictures"
                            :key="index"
                            class="md:w-1/3 p-4"
                        >
                            <img :src="picture" alt="Bild 1" class="w-full h-full object-cover rounded shadow-lg zoom-in">
                        </div>
                    </div>
                </div>

                <h2 class="text-2xl text-center whitespace-pre-line">Gallery 3</h2>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in pictures"
                            :key="index"
                            class="md:w-1/3 p-4"
                        >
                            <div class="w-full h-full overflow-hidden rounded transform transition-transform duration-1000 ease-in-out">
                                <img :src="picture" alt="Bild 1" class="w-full h-full object-cover rounded shadow-lg zoom-in-container">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import pic1 from '@/assets/img/pexels-photo-2253870.jpeg'
import pic2 from '@/assets/img/pexels-photo-371312.jpeg'
import pic3 from '@/assets/img/pexels-photo-752842.jpeg'
import pic4 from '@/assets/img/pexels-photo-1295995.jpeg'
import pic5 from '@/assets/img/pexels-photo-1630860.jpeg'
import pic6 from '@/assets/img/pexels-photo-1779491.jpeg'
import pic7 from '@/assets/img/pexels-photo-2959196.jpeg'

const pictures = [pic1, pic2, pic3, pic4, pic5, pic6, pic7]
</script>

<style scoped>
.zoom-in {
    transition: transform 0.3s ease-in-out;
}

.zoom-in:hover {
    transform: scale(1.1);
}

.zoom-in-container {
    transition: transform 4s ease-out;
}

.zoom-in-container:hover {
    transform: scale(1.4);
}
</style>
