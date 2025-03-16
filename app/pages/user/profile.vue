<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { useWindowSize } from '@/composables/useWindowSize'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Composables
const route = useRoute()
const router = useRouter()
const { checker } = useProfileChecker()

// Window size for mobile check
const { windowWidth } = useWindowSize(100)
const isWidthSmall = computed<boolean>(() => windowWidth.value < 640)

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)

// Menu items
const items = ref<MenuItem[]>([
  {
    value: 1,
    icon: 'pi pi-home',
    label: t('profileStepper.index.header'),
    route: localePath('/user/profile'),
  },
  {
    value: 2,
    icon: 'pi pi-user',
    label: t('profileStepper.userInformation.header'),
    route: localePath('/user/profile/user-information'),
  },
  {
    value: 3,
    icon: 'pi pi-image',
    label: t('profileStepper.profilePicture.header'),
    route: localePath('/user/profile/profile-picture'),
  },
  {
    value: 4,
    icon: 'pi pi-envelope',
    label: t('profileStepper.invitationState.header'),
    route: localePath('/user/profile/invitation-state'),
  },
])

// Highlight active menu item based on route path
const isActive = (item: MenuItem) => item.route ? router.resolve(item.route).path === route.path : false

// Compute current page index based on route path
const currentPageIndex = computed(() => items.value.findIndex(item => item.route === route.path))
const activeStep = ref(currentPageIndex.value + 1) // Stepper
watch(currentPageIndex, () => {
  activeStep.value = currentPageIndex.value + 1
})

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
        <Stepper class="basis-[50rem]" :readonly="!uid" :value="activeStep">
          <StepList>
            <Step
              v-for="(item, index) in items"
              v-slot="{ a11yAttrs }"
              :key="index"
              :value="index + 1"
              as-child
            >
              <div
                class="flex flex-row flex-auto items-center" :class="[{ 'gap-2': !isWidthSmall }]" v-bind="a11yAttrs.root"
              >
                <NuxtLink v-slot="routerProps" :to="{ path: item.route }" custom>
                  <button
                    class="rounded-full border-0 inline-flex flex-col gap-2"
                    :class="[
                      {
                        'bg-primary': isActive(item),
                        'text-primary/60': (index + 1) < activeStep, // Before
                        // '': (index + 1) > activeStep, // After
                      },
                    ]"
                    @click="($event) => routerProps.navigate($event as MouseEvent)"
                  >
                    <span
                      class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                      :class="[
                        {
                          'text-white !border-0': isActive(item),
                          'text-primary/60': (index + 1) < activeStep, // Before
                          // '': (index + 1) > activeStep, // After
                        },
                      ]"
                    >
                      <i
                        :class="[
                          item.icon,
                          {
                            // '': isActive(item),
                            'text-primary/60': (index + 1) < activeStep, // Before
                            // '': (index + 1) > activeStep, // After
                          },
                        ]"
                      />
                    </span>
                  </button>
                  <a v-if="!isWidthSmall" :href="routerProps.href" @click="($event) => routerProps.navigate($event as MouseEvent)" @keydown.enter="($event) => routerProps.navigate($event as unknown as MouseEvent)">
                    <span
                      class="flex items-center justify-center gap-1"
                      :class="[
                        {
                          'font-bold': isActive(item),
                          'text-primary/60': (index + 1) < activeStep, // Before
                          // '': (index + 1) > activeStep, // After
                        },
                      ]"
                    >
                      {{ item.label }}
                      <i v-if="checkState(index)" v-tooltip.bottom="t('profileStepper.stateComplete')" class="pi pi-verified text-green-600" />
                      <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="pi pi-exclamation-circle text-sky-600" />
                    </span>
                  </a>
                </NuxtLink>
                <Divider v-if="index !== items.length - 1" :class="[{ 'mr-2': !isWidthSmall }]" />
              </div>
            </Step>
          </StepList>
        </Stepper>
      </template>
    </Card>

    <NuxtPage v-slot="{ Component }" @prev-page="prevPage" @next-page="nextPage" @complete-page="complete">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </NuxtPage>
  </main>
</template>
