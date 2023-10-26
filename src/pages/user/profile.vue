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
                                <span v-bind="props.label">
                                    {{ label }}
                                    <i v-if="checkState(index)" v-tooltip.bottom="t('profileStepper.stateComplete')" class="pi pi-verified text-green-600" />
                                    <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="pi pi-exclamation-circle text-sky-600" />
                                </span>
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
const { checker } = useProfileChecker()

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
// This will link to the user profile page
const complete = () => { router.push(localePath('/user')) }

// Check if the state of the page is complete
const checkState = (index: number) => {
    // Get the page from the items array
    const page = items.value[index]
    return checker(page?.label as string)
}
</script>
