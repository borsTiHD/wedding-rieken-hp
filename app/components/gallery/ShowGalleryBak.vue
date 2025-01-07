<template>
    <Card>
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <ShowUnderline color="text-blue-400">
                    <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">Gallery 1</h2>
                </ShowUnderline>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in images"
                            :key="index"
                            class="md:w-1/3 p-4"
                        >
                            <Image :alt="picture.alt" preview class="w-full h-full object-cover rounded shadow-lg zoom-in-2" :pt="{ originalContainer: 'm-12 p-12' }">
                                <template #previewicon>
                                    <i class="pi pi-search" />
                                </template>
                                <template #image>
                                    <img :src="picture.src" :alt="picture.alt" class="w-full h-full object-cover">
                                </template>
                                <template #original="slotProps">
                                    <img :src="picture.src" :alt="picture.alt" :style="slotProps.style" @click="slotProps.previewCallback">
                                </template>
                            </Image>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <Card>
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <ShowUnderline color="text-rose-400">
                    <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">Gallery 2</h2>
                </ShowUnderline>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in images"
                            :key="index"
                            class="md:w-1/3 p-4"
                        >
                            <Image
                                :alt="picture.alt"
                                preview
                                :pt="{
                                    root: 'w-full h-full overflow-hidden rounded hover:shadow-xl overlay',
                                    originalContainer: 'm-12 p-12'
                                }"
                            >
                                <template #previewicon>
                                    <div class="relative w-full h-full">
                                        <span class="overlay-text">Look</span>
                                        <div class="pulse-circle" />
                                    </div>
                                </template>
                                <template #image>
                                    <img :src="picture.src" :alt="picture.alt" class="w-full h-full object-cover zoom-in">
                                </template>
                                <template #original="slotProps">
                                    <img :src="picture.src" :alt="picture.alt" :style="slotProps.style" @click="slotProps.previewCallback">
                                </template>
                            </Image>

                            <!-- <div class="relative w-full h-full overflow-hidden rounded hover:shadow-xl transform transition-transform duration-300 ease-in-out overlay cursor-pointer">
                                <img :src="picture.src" :alt="picture.alt" class="w-full h-full object-cover rounded shadow-lg zoom-in">
                                <span class="overlay-text">Look</span>
                                <div class="pulse-circle" />
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <Card>
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <h2 class="text-2xl text-center whitespace-pre-line">Gallery 4</h2>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in images"
                            :key="index"
                            class="w-full md:w-1/3 p-4"
                        >
                            <div class="relative w-full h-full overflow-hidden rounded shadow-lg hover:shadow-xl effect-zoom cursor-pointer">
                                <a class="img-loading">
                                    <img :src="picture.src" alt="XXX" class="w-full h-full object-cover rounded">
                                    <!-- <Image :src="picture.src" :alt="picture.alt" class="w-full h-full object-cover rounded" /> -->
                                    <span class="kk-n">Anschauen</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>


    <Card>
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <h2 class="text-2xl text-center whitespace-pre-line">Gallery 4 (Primevue)</h2>
                <div class="container mx-auto">
                    <div class="flex flex-wrap -mx-4">
                        <div
                            v-for="(picture, index) in images"
                            :key="index"
                            class="w-full md:w-1/3 p-4"
                        >
                            <Image
                                :alt="picture.alt"
                                preview
                                :pt="{
                                    root: 'w-full h-full overflow-hidden rounded shadow-lg hover:shadow-xl cursor-pointer group',
                                    originalContainer: 'm-12 p-12'
                                }"
                            >
                                <template #previewicon>
                                    <div class="w-full h-full flex items-center justify-center">
                                        <span class="text-xl uppercase group-hover:motion-opacity-in-[0%] group-hover:motion-translate-y-in-[105%] motion-duration-[0.8s]">Anschauen</span>
                                    </div>
                                </template>
                                <template #image>
                                    <img :src="picture.src" :alt="picture.alt" class="w-full h-full object-cover group-hover:motion-scale-out-[1.4] motion-duration-[10s]">
                                </template>
                                <template #original="slotProps">
                                    <img :src="picture.src" :alt="picture.alt" :style="slotProps.style" @click="slotProps.previewCallback">
                                </template>
                            </Image>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import type { Image } from '@/types/Image'

type Props = {
    images: Image[]
}

const props = defineProps<Props>()
const { images } = toRefs(props)
</script>

<style scoped>
/* Gallery 2 */
.zoom-in-2 {
    transition: transform 0.3s ease-in-out;
}
.zoom-in-2:hover {
    transform: scale(1.1);
}

/* Gallery 3 */
.zoom-in {
    transition: transform 0.3s ease-in-out;
}

.overlay {
    position: relative;
}

.overlay::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.overlay:hover::before {
    opacity: 1;
}

.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.overlay:hover .overlay-text {
    opacity: 1;
}

.pulse-circle {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: pulse 1s infinite;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    box-sizing: border-box;
}

.overlay:hover .pulse-circle {
    opacity: 1;
}

@keyframes pulse {
    0% {
        transform: scale(0.8);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.8);
    }
}

.overlay:hover .zoom-in {
    transform: scale(1.1);
}



/* Gallery 4 */
@media screen and (min-width: 1024px) {

.effect-zoom:not(.img-loading):hover img  {
    transform: scale3d(1.4, 1.4, 1);
    transition: transform 10s cubic-bezier(0.16, 0.48, 0.21, 0.67);
    -webkit-backface-visibility: hidden;
}

.vc-zoom-in:not(.img-loading):hover a img  {
    transform: scale3d(1.4, 1.4, 1);
    transition: transform 10s cubic-bezier(0.16, 0.48, 0.21, 0.67);
    -webkit-backface-visibility: hidden;
}

.effect-zoom img {
    display: block;
    transform: scale3d(1,1,1);
    transition: transform 6s linear;
}

.effect-zoom:not(.img-loading):hover a:after {
    opacity: 0.2;
}

.effect-zoom:not(.img-loading):hover .kk-n,
.vc-zoom-in:not(.img-loading):hover a:before  {
    color: #fff;
    transform: translateY(-50%);
    transition: transform ease .3s, color ease .3s;
}

.effect-zoom:not(.img-loading):hover .kk-n:before {
    animation: kk_zoomer 1.5s infinite linear 0.1s;
}
}

.effect-zoom  a:after {
content: '';
position: absolute;
background-color: #000;
opacity: 0;
top: 0;
bottom: 0;
left: 0;
right: 0;
transition: opacity linear 0.5s;
}

.kk-n {
position: absolute;
text-align: center;
top: 50%;
right: 0;
left: 0;
color: transparent;
font-size: 18px;
font-weight: 600;
text-transform: uppercase;
z-index: 5;
transform: translateY(10%);
transition: transform ease .3s, color ease .3s;
}

.kk-n {

&:before {
    content: '';
    width: 58px;
    height: 58px;
    position: absolute;
    border: 1px solid #fff;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    margin-left: -29px;
    margin-top: -30px;
    opacity: 0;
}

}

.effect-zoom:hover .kk-n:before {
@include animation(kk_zoomer 1.5s infinite linear 0.1s);

}

@include keyframes(kk_zoomer) {
0% {
    opacity: 0;
    transform: scale(0.4);
}

20% {
    opacity: 0.8;
}

40% {
    opacity: 0;
    transform: scale(1.8);
}

100% {
    opacity: 0;
}
}

.vc-zoom-in {

		a {
			display: block;
			position: relative;

				&:after {
					content: '';
					width: 58px;
					height: 58px;
					position: absolute;
					border: 1px solid #fff;
					border-radius: 50%;
					top: 50%;
					left: 50%;
					margin-left: -29px;
					margin-top: -30px;
					opacity: 0;
				}

				&:before {
					content: 'VIEW';
					position: absolute;
					top: 50%;
					z-index: 5;
					font-size: 18px;
					font-weight: 600;
					text-align: center;
					color: transparent;
					right: 0;
					left: 0;
					@include transform(translateY(10%));
					@include transition(transform ease .3s, color ease .3s);
				}


			img {
				display: block;
				opacity: 1;
				@include transform(scale(1));
				@include transition(transform .6s ease, opacity .5s linear);
				-webkit-backface-visibility: hidden;
			}
		}


	&:hover {

		a {
			background-color: #000;

			&:after {
				@include animation(kk_zoomer 1.5s infinite linear 0.1s);
			}

			img {
				opacity: 0.8;
				-webkit-backface-visibility: hidden;
				@include transform(scale(1.4));
				@include transition(transform 10s cubic-bezier(0.16, 0.48, 0.21, 0.67), opacity .5s linear);
			}
		}
	}
}

.img-loading {
	background-color: #f9f9f9;
	overflow: hidden;
	position: relative;

	.dark-skin & {
		background-color: #222222;
	}

	&:before {
		content: '';
		width: 24px;
		height: 24px;
		position: absolute;
		background: transparent;
		display: block;
		top: 50%;
		margin-top: -12px;
		left: 50%;
		margin-left: -12px;
		border: 1px solid #444;
		border-radius: 50%;
		border-left-color: transparent;
		border-right-color: transparent;
		@include animation(kk_spin .55s linear infinite);

		.dark-skin & {
			border-top-color: #777;
			border-bottom-color: #777;
		}
	}
}

@include keyframes(kk_spin) {
  from {
    @include transform(rotate(0deg));
  }
  to {
    @include transform(rotate(359deg));
  }
}
</style>
