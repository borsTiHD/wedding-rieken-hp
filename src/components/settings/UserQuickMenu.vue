<template>
    <div class="flex">
        <!-- Avatar - click opens the overlay -->
        <Avatar
            :image="photoURL ? photoURL : undefined"
            :icon="photoURL ? undefined : 'pi pi-user'"
            tabindex="0"
            class="cursor-pointer"
            size="large"
            shape="circle"
            @click="showSearchPanel"
            @keydown.enter="showSearchPanel"
        />

        <OverlayPanel ref="op" class="w-full sm:mr-4 sm:w-96">
            <div class="flex flex-col items-center gap-4">
                <Avatar
                    :image="photoURL ? photoURL : undefined"
                    :icon="photoURL ? undefined : 'pi pi-user'"
                    size="xlarge"
                    shape="circle"
                />

                <!-- If user is logged in -->
                <template v-if="uid">
                    <!-- Display name -->
                    <h1 class="text-2xl font-semibold">{{ displayName ? displayName : t('user.noName') }}</h1>

                    <div v-if="checkState < 100" tabindex="0" class="flex items-center px-0 sm:px-8 w-full cursor-pointer hover:text-neutral-400" @click="routeChange(localePath('/user/profile/'))" @keydown.enter="routeChange(localePath('/user/profile/'))">
                        <span>Dein Profil ist noch nicht vollständig</span>
                        <!-- Profile progress with link -->
                        <DisplayProfileProgress class="ml-auto" />
                    </div>

                    <!-- List  with links to profile, settings, logout, etc. -->
                    <ul class="flex flex-col px-0 sm:px-8 w-full">
                        <li v-if="uid && userProfile && userProfile.role === 'admin'" tabindex="0" class="quick-menu-list-item border-b-2 hover:text-neutral-400" @click="routeChange(localePath('/admin'))" @keydown.enter="routeChange(localePath('/admin'))">
                            <span>{{ t('pages.admin') }}</span>
                            <i class="pi pi-chevron-right" />
                        </li>
                        <li tabindex="0" class="quick-menu-list-item border-b-2 hover:text-neutral-400" @click="routeChange(localePath('/user'))" @keydown.enter="routeChange(localePath('/user'))">
                            <span>{{ t('pages.user') }}</span>
                            <i class="pi pi-chevron-right" />
                        </li>
                        <li tabindex="0" class="quick-menu-list-item hover:text-red-400" @click="logout" @keydown.enter="logout">
                            <span>{{ t('logout.submit') }}</span>
                        </li>
                    </ul>
                </template>

                <!-- If user is NOT logged in -->
                <template v-else>
                    <!-- Display name -->
                    <h1 class="text-2xl font-semibold">{{ t('login.notLoggedIn') }}</h1>

                    <!-- List  with links to profile, settings, logout, etc. -->
                    <ul tabindex="0" class="flex flex-col px-0 sm:px-8 w-full">
                        <li class="quick-menu-list-item hover:text-neutral-400" @click="routeChange(localePath('/login'))" @keydown.enter="routeChange(localePath('/login'))">
                            <span>{{ t('login.submit') }}</span>
                            <i class="pi pi-chevron-right" />
                        </li>
                    </ul>
                </template>
            </div>
        </OverlayPanel>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import OverlayPanel from 'primevue/overlaypanel'
import DisplayProfileProgress from '@/components/user/DisplayProfileProgress.vue'
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { logoutUser } = useFirebaseAuth()
const { checkState } = useProfileChecker()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
const userProfile = computed(() => userStore.userProfile)
const displayName = computed(() => userStore.displayName)
const photoURL = computed(() => userStore.photoURL)

// Overlay search panel
const op = ref<OverlayPanel | null>(null)
const showSearchPanel = (event: Event) => {
    op.value?.toggle(event)
}

// Change route and close overlay panel
const routeChange = (route: string) => {
    op.value?.hide()
    router.push(localePath(route))
}

// Logout button
const logout = async() => {
    await logoutUser()
        .then(() => {
            toast.add({
                severity: 'success',
                summary: t('logout.success'),
                detail: t('logout.successDetail'),
                life: 3000
            })
        })
        .catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: t('logout.error'),
                detail: error.message,
                life: 10000
            })
        })

    op.value?.hide()
}
</script>

<style scoped>
/* Profile list items */
.quick-menu-list-item {
    @apply flex items-center justify-between py-2 cursor-pointer !important;
}
</style>
