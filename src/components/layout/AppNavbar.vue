<template>
    <Menubar :model="navItems" class="bg-zinc-100">
        <template #item="{ item }">
            <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path" custom>
                <a
                    :href="href"
                    :class="[
                        'p-menuitem-link bg-zinc-100 text-black/60', // default
                        'hover:bg-zinc-200 hover:text-primary/80', // hover - hover:text-black/80
                        {
                            'active-link bg-slate-200 text-primary font-bold': isActive, // active - text-black/60
                            'active-link-exact': isExactActive // active-exact
                        }]"
                    @click="navigate"
                >
                    {{ item.name }}
                </a>
            </NuxtLink>
        </template>
        <template #end>
            <div class="flex items-center gap-2 mr-2">
                <!-- Language selector -->
                <ChangeLanguage />

                <!-- Avatar - with link to user profile -->
                <Avatar
                    :image="photoURL ? photoURL : undefined"
                    :icon="photoURL ? undefined : 'pi pi-user'"
                    class="cursor-pointer"
                    size="xlarge"
                    shape="circle"
                    @click="onAvatarClick"
                />
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import { usePagesStore } from '@/stores/pages'
import { useUserStore } from '@/stores/user'

// Composables
const localePath = useLocalePath()
const router = useRouter()

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)

// Click on avatar
const onAvatarClick = () => {
    router.push(localePath('/user'))
}
</script>
