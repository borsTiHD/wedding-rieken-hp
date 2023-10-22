<template>
    <div class="flex flex-col gap-4">
        <Card>
            <template #content>
                <Steps
                    :model="items"
                    aria-label="Profile Steps"
                    :readonly="!uid"
                    :pt="{
                        menuitem: ({ context }) => ({
                            class: isActive(context.item) && 'p-highlight p-steps-current'
                        })
                    }"
                >
                    <template #item="{ label, item, index, props }">
                        <NuxtLink v-slot="routerProps" :to="{ path: item.route }" custom>
                            <a :href="routerProps.href" v-bind="props.action" @click="($event) => routerProps.navigate($event)" @keydown.enter="($event) => routerProps.navigate($event)">
                                <span v-bind="props.step">{{ index + 1 }}</span>
                                <span v-bind="props.label">{{ label }}</span>
                            </a>
                        </NuxtLink>
                    </template>
                </Steps>
            </template>
        </Card>

        <NuxtPage v-slot="{ Component }" @prev-page="prevPage" @next-page="nextPage" @complete-page="complete">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </NuxtPage>
    </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Composables
const route = useRoute()
const router = useRouter()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)

// Menu items
const items = ref<MenuItem[]>([
    {
        label: t('profileStepper.index.header'),
        route: localePath('/user/profile')
    },
    {
        label: t('profileStepper.userInformation.header'),
        route: localePath('/user/profile/user-information')
    },
    {
        label: t('profileStepper.profilePicture.header'),
        route: localePath('/user/profile/profile-picture')
    },
    {
        label: t('profileStepper.invitationState.header'),
        route: localePath('/user/profile/invitation-state')
    }
])

// Highlight active menu item based on route path
const isActive = (item: MenuItem) => item.route ? router.resolve(item.route).path === route.path : false

// Compute current page index based on route path
const currentPageIndex = computed(() => items.value.findIndex((item) => item.route === route.path))

// Navigate to next or previous page
const nextPage = () => { router.push(items.value[currentPageIndex.value + 1].route) }
const prevPage = () => { router.push(items.value[currentPageIndex.value - 1].route) }

// Complete the stepper
const complete = () => {
    console.log('complete')
}

// TODO: Check the state of the profile completion
// Push to the specific route/state if not completed
</script>
