<template>
    <main class="mx-auto flex flex-col">
        <!-- Main content -->
        <section class="h-screen flex justify-center relative overflow-hidden -mt-20">
            <!-- Background image -->
            <div
                class="background-image absolute w-full h-full"
                :style="{ transform: `translateY(${scrollY / 2}px)` }"
            />

            <!-- Content wrapper -->
            <div class="w-3/4 sm:w-2/3 xl:w-1/2 flex flex-col justify-center text-white">
                <span class="font-roboto text-7xl md:text-9xl drop-shadow-sm">{{ bride }}</span>
                <span class="font-montserrat text-7xl md:text-9xl drop-shadow-sm self-center">&</span>
                <span class="font-roboto text-7xl md:text-9xl drop-shadow-sm self-end">{{ groom }}</span>
            </div>
        </section>

        <!-- Countdown -->
        <section class="bg-[#540B0E]">
            <div class="p-4 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
                <Card class="card-primary">
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <ShowCountdown :timestamp="config?.weddingDate" />
                            <DateDisplay :timestamp="config?.weddingDate" />
                        </div>
                    </template>
                </Card>

                <Card class="card-primary">
                    <template #title>
                        <h2>What is Lorem Ipsum?</h2>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Phasellus egestas tellus rutrum tellus pellentesque eu. Accumsan lacus vel facilisis volutpat est. Amet consectetur adipiscing elit ut aliquam purus. Feugiat nisl pretium fusce id velit ut tortor. In nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Non odio euismod lacinia at. Sed felis eget velit aliquet sagittis id consectetur purus. Ornare lectus sit amet est. Porttitor eget dolor morbi non arcu risus quis varius quam. Integer vitae justo eget magna fermentum iaculis. Ipsum faucibus vitae aliquet nec ullamcorper sit. Egestas tellus rutrum tellus pellentesque eu tincidunt. Eget mauris pharetra et ultrices neque ornare aenean. In vitae turpis massa sed elementum tempus egestas sed sed. Mattis pellentesque id nibh tortor. Blandit cursus risus at ultrices mi. Ultrices neque ornare aenean euismod elementum.</p>
                        </div>
                    </template>
                </Card>
            </div>
        </section>

        <!-- Countdown -->
        <section class="bg-[#335C67]">
            <div class="p-4 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
                <Card class="card-primary">
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <ShowCountdown :timestamp="config?.weddingDate" />
                            <DateDisplay :timestamp="config?.weddingDate" />
                        </div>
                    </template>
                </Card>

                <Card class="card-primary">
                    <template #title>
                        <h2>What is Lorem Ipsum?</h2>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Phasellus egestas tellus rutrum tellus pellentesque eu. Accumsan lacus vel facilisis volutpat est. Amet consectetur adipiscing elit ut aliquam purus. Feugiat nisl pretium fusce id velit ut tortor. In nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Non odio euismod lacinia at. Sed felis eget velit aliquet sagittis id consectetur purus. Ornare lectus sit amet est. Porttitor eget dolor morbi non arcu risus quis varius quam. Integer vitae justo eget magna fermentum iaculis. Ipsum faucibus vitae aliquet nec ullamcorper sit. Egestas tellus rutrum tellus pellentesque eu tincidunt. Eget mauris pharetra et ultrices neque ornare aenean. In vitae turpis massa sed elementum tempus egestas sed sed. Mattis pellentesque id nibh tortor. Blandit cursus risus at ultrices mi. Ultrices neque ornare aenean euismod elementum.</p>
                        </div>
                    </template>
                </Card>
            </div>
        </section>

        <section class="bg-[#540B0E]">
            <div class="p-4 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
                <Card class="card-primary">
                    <template #title>
                        <h2>Ipsum dolor sit amet consectetur</h2>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <p>Et netus et malesuada fames ac turpis egestas. Id volutpat lacus laoreet non curabitur gravida. Ut aliquam purus sit amet luctus. Sed lectus vestibulum mattis ullamcorper velit. Sit amet dictum sit amet justo donec enim diam. Ut venenatis tellus in metus vulputate eu scelerisque felis. Elementum nibh tellus molestie nunc non. Imperdiet nulla malesuada pellentesque elit. Purus gravida quis blandit turpis cursus in hac. Nulla facilisi cras fermentum odio eu feugiat pretium.</p>
                        </div>
                    </template>
                </Card>
            </div>
        </section>

        <!-- Countdown -->
        <section class="bg-[#E09F3E]">
            <div class="p-4 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
                <Card class="card-primary">
                    <template #content>
                        <div class="flex flex-col items-center gap-4">
                            <ShowCountdown :timestamp="config?.weddingDate" />
                            <DateDisplay :timestamp="config?.weddingDate" />
                        </div>
                    </template>
                </Card>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import { useWindowSize } from '@/composables/useWindowSize'

// Fetch app config
const appStore = useAppStore()
const config = appStore.config
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)

// Scroll event listener
const { scrollY } = useWindowSize(undefined, true)
</script>
