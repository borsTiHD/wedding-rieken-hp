<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
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
    route: localePath('/user/profile'),
  },
  {
    label: t('profileStepper.userInformation.header'),
    route: localePath('/user/profile/user-information'),
  },
  {
    label: t('profileStepper.profilePicture.header'),
    route: localePath('/user/profile/profile-picture'),
  },
  {
    label: t('profileStepper.invitationState.header'),
    route: localePath('/user/profile/invitation-state'),
  },
])

// Highlight active menu item based on route path
const isActive = (item: MenuItem) => item.route ? router.resolve(item.route).path === route.path : false

// Compute current page index based on route path
const currentPageIndex = computed(() => items.value.findIndex(item => item.route === route.path))

// Navigate to next or previous page
function nextPage() {
  const nextIndex = currentPageIndex.value + 1
  if (items.value && nextIndex < items.value.length && items.value[nextIndex]) {
    router.push(items.value[nextIndex].route)
  }
}

function prevPage() {
  const prevIndex = currentPageIndex.value - 1
  if (items.value && prevIndex >= 0 && items.value[prevIndex]) {
    router.push(items.value[prevIndex].route)
  }
}

// Complete the stepper
// This will link to the user profile page
function complete() {
  router.push(localePath('/user'))
}

// Check if the state of the page is complete
function checkState(index: number) {
  // Get the page from the items array
  const page = items.value[index]
  return checker(page?.label as string)
}

// Card pass-through props
const ptCard = {
  body: {
    class: 'p-4',
  },
  content: {
    class: 'p-0 sm:m-4',
  },
}
</script>

<template>
  <main class="content-wrapper">
    <Card :pt="ptCard">
      <template #content>
        <Steps
          :model="items"
          aria-label="Profile Steps"
          :readonly="!uid"
          :pt="{
            menuitem: ({ context }) => ({
              class: isActive(context.item) && 'p-highlight p-steps-current',
            }),
          }"
        >
          <template #item="{ label, item, index, props }">
            <NuxtLink v-slot="routerProps" :to="{ path: item.route }" custom>
              <a :href="routerProps.href" v-bind="props.action" @click="($event) => routerProps.navigate($event)" @keydown.enter="($event) => routerProps.navigate($event)">
                <span v-bind="props.step">{{ index + 1 }}</span>
                <span v-bind="props.label" class="flex items-center justify-center flex-wrap gap-1">
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
  </main>
</template>
