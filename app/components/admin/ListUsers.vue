<script setup lang="ts">
import type { DataTableUser, User, UserRole } from '@/types/User'
import CheckGuest from '@/components/admin/CheckGuest.vue'
import CreateUser from '@/components/admin/CreateUser.vue'
import DeleteUser from '@/components/admin/DeleteUser.vue'
import DisplayModal from '@/components/DisplayModal.vue'
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import createReadableDate from '@/composables/dateHelper'
import useBackendApi from '@/composables/useBackendApi'
import { useCheckUser } from '@/composables/useCheckUser'
import { useModalPosition } from '@/composables/useModalPosition'
import { useWindowSize } from '@/composables/useWindowSize'
import { useUserStore } from '@/stores/user'
// import { FilterMatchMode } from '@primevue/core/api'
import { FilterMatchMode } from '@primevue/core'
import { useToast } from 'primevue/usetoast'

// Refs
const createUserModal = ref<InstanceType<typeof DisplayModal>>()

// Composables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const { getAllUsers } = useBackendApi()
const { modalPosition } = useModalPosition() // Modal position
const { isInvited, isAdminAndAcceptedInvite, hasInvitationStatus } = useCheckUser()

// User store
const userStore = useUserStore()

// Table filters
const globalSearch = ref('')
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Data
const users = ref<User[]>([])
const loading = ref(false)
const expandedRows = ref<DataTableUser[]>([])
const selectedType = ref<UserRole>('all')
const types = [
  { name: t('admin.listUsers.userFilter.types.all'), code: 'all' },
  { name: t('admin.listUsers.userFilter.types.admin'), code: 'admin' },
  { name: t('admin.listUsers.userFilter.types.invited'), code: 'invited' },
  { name: t('admin.listUsers.userFilter.types.declined'), code: 'declined' },
  { name: t('admin.listUsers.userFilter.types.guest'), code: 'guest' },
]
const invitedGuests = computed(() => users.value.filter(user => isInvited(user as User) || isAdminAndAcceptedInvite(user as User)))
const selfRegisteredGuests = computed(() => users.value.filter(user => user?.profile?.role === 'guest'))
const pendingInvitations = computed(() => invitedGuests.value.filter(user => hasInvitationStatus(user as User, 'pending')))
const acceptedInvitations = computed(() => invitedGuests.value.filter(user => hasInvitationStatus(user as User, 'accepted')))
const declinedInvitations = computed(() => invitedGuests.value.filter(user => hasInvitationStatus(user as User, 'declined')))
const usersData = computed(() => {
  // Mapping for user roles
  const roleMapping = {
    admin: 'admin',
    invited: 'invited',
    guest: 'guest',
    declined: 'declined',
  }

  // Select users based on selected type
  const selectedRole = roleMapping[selectedType.value as keyof typeof roleMapping] || null
  const selectedUsers = selectedRole ? users.value.filter(user => user.profile.role === selectedRole) : users.value

  // Convert users to DataTableUser
  const user: DataTableUser[] = selectedUsers.map(user => ({
    uid: user.account.uid,
    role: user?.profile?.role,
    displayName: user?.account?.displayName,
    email: user?.account?.email,
    emailVerified: user?.account?.emailVerified,
    phoneNumber: user?.profile?.phoneNumber,
    photoURL: user?.account?.photoURL,
    additionalGuests: user?.profile?.additionalGuests,
    invitation: user?.profile?.invitation,
    creationTime: user?.account?.metadata?.creationTime,
    lastRefreshTime: user?.account?.metadata?.lastRefreshTime,
    lastSignInTime: user?.account?.metadata?.lastSignInTime,
    highscore: user?.profile?.highscore,
  }) as DataTableUser)

  // Function to convert a user and switch fields to the i18n string
  const convertUser = (user: DataTableUser) => ({
    ...user,
    role: getUserRole(user.role),
    invitation: getInvitationStatus(user.invitation),
  })

  // Return filtered users
  return globalSearch.value
    ? user.filter(user => JSON.stringify(convertUser(user)).toLowerCase().includes(globalSearch.value.toLowerCase()))
    : user
})

// Window size for expanded rows
const { windowWidth } = useWindowSize(100)
const isWidthSmall = computed<boolean>(() => windowWidth.value < 1400)
watch(windowWidth, () => {
  // Reset expanded rows on window resize
  if (windowWidth.value > 1400) {
    expandedRows.value = []
  }
})

// Row class
const roleClassMap: { [role: string]: string } = {
  admin: 'bg-blue-100/40',
  guest: 'bg-yellow-100/40',
  // 'declined': 'bg-red-100'
}
function rowClass(data: DataTableUser) {
  // Check if user id is in acceptedInvitations
  if (acceptedInvitations.value.some(user => user.account.uid === data.uid))
    return 'bg-green-100/20'

  return data.role ? roleClassMap[data.role] || '' : 'bg-red-100'
}

// Calculate total guests with additional guests
// Add guest only if 'invitation' is 'accepted' and if 'user role' is 'invited' or 'admin'
// 'admin' is added to the guest count only if the user has accepted the invitation (this is an exception)
const totalGuests = computed(() => {
  return acceptedInvitations.value.reduce((total, user) => {
    total += (user.profile.additionalGuests || 0) + 1
    return total
  }, 0)
})

// Return invitation status for user
function getInvitationStatus(invitation: string) {
  if (invitation === 'pending')
    return t('user.invitation.stateNoReponse')
  if (invitation === 'accepted')
    return t('user.invitation.stateAccepted')
  if (invitation === 'declined')
    return t('user.invitation.stateDeclined')
  return t('user.invitation.stateNoInvitation')
}

// Return severity for invitation status
function getInvitationStatusSeverity(invitation: string) {
  if (invitation === 'pending')
    return 'info'
  if (invitation === 'accepted')
    return 'success'
  if (invitation === 'declined')
    return 'error'
  return 'warn'
}

// Return user role
function getUserRole(role: string) {
  if (role === 'admin')
    return t('user.userRole.adminRole')
  if (role === 'invited')
    return t('user.userRole.invitedRole')
  if (role === 'guest')
    return t('user.userRole.guestRole')
  if (role === 'declined')
    return t('user.userRole.declinedRole')
  return t('user.userRole.noRole')
}

// Return severity for user role
function getUserRoleSeverity(role: string) {
  switch (role) {
    case 'admin':
      return 'info'
    case 'invited':
      return 'success'
    case 'guest':
      return 'warning'
    case 'declined':
      return 'danger'
    default:
      return 'info'
  }
}

// Return icon for user role
function getUserRoleIcon(role: string) {
  switch (role) {
    case 'admin':
      return 'pi pi-user'
    case 'invited':
      return 'pi pi-check'
    case 'guest':
      return 'pi pi-info-circle'
    case 'declined':
      return 'pi pi-times'
    default:
      return 'pi pi-exclamation-triangle'
  }
}

// Copy to clipboard
async function copyToClipboard(value: string) {
  try {
    // Copy to clipboard - only works in secure context (https)
    await navigator.clipboard.writeText(value)
    toast.add({ severity: 'success', summary: 'Success', detail: t('buttons.copyToClipboardSuccess'), life: 3000 })
  }
  catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Error', detail: t('buttons.copyToClipboardError'), life: 10000 })
  }
}

// Create a readable date from timestamp

// Fetch users
async function getUsers() {
  loading.value = true

  // Fetch User data and refresh user token
  await userStore.fetchUserData().catch(error => console.warn(error)) // Fetch user data, don't need to handle error

  // Get all users
  const response = await getAllUsers().catch((error: { statusMessage: string }) => {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
    loading.value = false
    return undefined
  })

  // Check if response is ok
  if (!response || !response?.result) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get users', life: 10000 })
    loading.value = false
    throw new Error('Could not get users.')
  }

  // Set users
  users.value = response?.result as User[] || []

  // // Set selected type to 'guest' if there are self registered guests
  // if (selfRegisteredGuests.value.length > 0) {
  //   selectedType.value = 'guest'
  // }

  loading.value = false
}

// Watch 'type' param from url and update selected type
const selectedTypeFromUrl = computed(() => route.query.type as string)
watch(() => selectedTypeFromUrl.value, (value) => {
  selectedType.value = value ? value as UserRole : 'all'
})

// Set filter type to route
function setFilterTypeToRoute() {
  router.push({ query: { ...route.query, type: selectedType.value } })
}

// On component mount
onMounted(() => {
  getUsers()

  // Set default type filter
  if (selectedTypeFromUrl.value) {
    selectedType.value = selectedTypeFromUrl.value as UserRole || 'all'
  }
})

// Register event to reload users on new user creation
useRegisterEvent('user-created', getUsers)
</script>

<template>
  <Card>
    <template #title>
      <div class="flex flex-col sm:flex-row items-baseline gap-4">
        {{ t('admin.listUsers.header') }}
        <button v-if="selfRegisteredGuests.length > 0" class="p-2 flex gap-1 items-center text-sm text-gray-800 bg-yellow-200 rounded-lg pulse-yellow cursor-pointer" @click="selectedType = 'guest'">
          <span>{{ t('admin.listUsers.needToCheckSelfRegisteredGuests', { n: selfRegisteredGuests.length }, selfRegisteredGuests.length) }}</span>
          <i class="pi pi-exclamation-circle text-yellow-600" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <!-- User invitation infos -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <!-- User infos -->
          <div class="flex flex-col pr-4 border-b-2 sm:border-b-0 sm:border-r-2">
            <span class="font-bold">{{ t('admin.listUsers.invitedGuests', { n: invitedGuests.length }, invitedGuests.length) }}</span>
            <span class="text-sm text-gray-500">{{ t('admin.listUsers.pendingInvitations', { n: pendingInvitations.length }, pendingInvitations.length) }}</span>
          </div>
          <div class="flex flex-col pr-4 border-b-2 sm:border-b-0 sm:border-r-2">
            <span class="text-sm text-gray-600">{{ t('admin.listUsers.acceptedInvitations', { n: acceptedInvitations.length }, acceptedInvitations.length) }}</span>
            <span class="text-sm text-gray-400">{{ t('admin.listUsers.declinedInvitations', { n: declinedInvitations.length }, declinedInvitations.length) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold">{{ t('admin.listUsers.totalGuests', { n: totalGuests }, totalGuests) }}</span>
          </div>
        </div>

        <!-- Users datatable -->
        <DataTable
          v-model:filters="filters"
          v-model:expanded-rows="expandedRows"
          :value="usersData"
          :loading="loading"
          :row-class="rowClass"
          paginator
          size="small"
          removable-sort
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
        >
          <template #header>
            <div class="flex flex-wrap gap-2">
              <!-- Refresh users -->
              <Button icon="pi pi-refresh" rounded raised @click="getUsers" />

              <!-- Create User modal -->
              <DisplayModal
                ref="createUserModal"
                :position="modalPosition"
                :header="t('admin.createUser.header')"
                button-class="w-fit grow sm:grow-0"
                :button-label="t('admin.createUser.buttonLabel')"
                button-icon="pi pi-user-plus"
                button-raised
                button
              >
                <template #content>
                  <CreateUser @created="createUserModal?.close()" />
                </template>
              </DisplayModal>

              <!-- Filter users -->
              <Select
                v-model="selectedType"
                :options="types"
                option-label="name"
                option-value="code"
                scroll-height="auto"
                :placeholder="t('admin.listUsers.userFilter.placeholder')"
                class="w-fit grow sm:grow-0 sm:w-fit sm:ml-auto"
                @change="setFilterTypeToRoute"
              />

              <!-- Search -->
              <IconField class="w-fit grow sm:grow-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="globalSearch" class="w-full" :placeholder="t('admin.listUsers.userSearch.placeholder')" />
              </IconField>
            </div>
          </template>

          <!-- Row expansion - Mobile view -->
          <template #expansion="slotProps">
            <ul class="flex flex-col gap-2">
              <li v-if="slotProps.data.role !== 'admin'" class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.actions') }}:</span>
                <CheckGuest
                  v-if="slotProps.data.role === 'guest'"
                  :uid="slotProps.data.uid"
                  @changed="getUsers"
                />
                <CheckGuest
                  v-else
                  :uid="slotProps.data.uid"
                  mode="changeInvitation"
                  @changed="getUsers"
                />
                <DeleteUser
                  :uid="slotProps.data.uid"
                  @deleted="getUsers"
                />
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.email') }}:</span>
                <span class="truncate max-w-[11rem]">{{ slotProps.data.email }}</span>
                <Button icon="pi pi-copy" class="" size="small" severity="primary" text rounded aria-label="Copy" @click="copyToClipboard(slotProps.data.email)" />
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.role') }}:</span>
                <Tag
                  :value="getUserRole(slotProps.data.role)"
                  :icon="getUserRoleIcon(slotProps.data.role)"
                  :severity="getUserRoleSeverity(slotProps.data.role)"
                  class="whitespace-nowrap" rounded
                />
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.invitationState') }}:</span>
                <InlineMessage
                  v-if="slotProps.data.invitation"
                  v-tooltip.bottom="getInvitationStatus(slotProps.data.invitation)"
                  :severity="getInvitationStatusSeverity(slotProps.data.invitation)"
                />
                <span v-else>-</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.additionalGuests') }}:</span>
                <span>{{ slotProps.data.additionalGuests }}</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.phone') }}:</span>
                <span class="truncate max-w-[13rem]">{{ slotProps.data.phoneNumber }}</span>
                <Button icon="pi pi-copy" class="" size="small" severity="primary" text rounded aria-label="Copy" @click="copyToClipboard(slotProps.data.phoneNumber)" />
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.highscore') }}:</span>
                <span>{{ slotProps.data.highscore }}</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.creationTime') }}:</span>
                <span>{{ createReadableDate(slotProps.data.creationTime) }}</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.lastRefreshTime') }}:</span>
                <span>{{ createReadableDate(slotProps.data.lastRefreshTime) }}</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">{{ t('admin.listUsers.tableHeader.lastSignInTime') }}:</span>
                <span>{{ createReadableDate(slotProps.data.lastSignInTime) }}</span>
              </li>
              <li class="user-list-item">
                <span class="font-bold">UID:</span>
                <span class="truncate max-w-[12rem]">{{ slotProps.data.uid }}</span>
                <Button icon="pi pi-copy" class="" size="small" severity="primary" text rounded aria-label="Copy" @click="copyToClipboard(slotProps.data.uid)" />
              </li>
            </ul>
          </template>

          <Column expander style="width: 5rem" />
          <Column field="photoURL" :header="t('admin.listUsers.tableHeader.avatar')">
            <template #body="slotProps">
              <DisplayAvatar v-if="slotProps.data.photoURL" :src="slotProps.data.photoURL" :alt="`Avatar from ${slotProps.data.displayName}`" shadow cover preview />
              <div v-else class="h-14 w-14 shadow-md rounded-md bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-center select-none">No Avatar</span>
              </div>
            </template>
          </Column>
          <Column field="displayName" :header="t('admin.listUsers.tableHeader.name')" sortable>
            <template #body="slotProps">
              <span :class="[{ 'font-bold': !isWidthSmall }, { 'text-sm': isWidthSmall }]">{{ slotProps.data.displayName }}</span>
              <div v-if="!isWidthSmall" class="flex items-center gap-2">
                <span>{{ slotProps.data.email }}</span>
                <i v-if="slotProps.data.emailVerified" v-tooltip.top="t('user.email.verified')" class="pi pi-verified text-green-600" />
                <i v-else v-tooltip.top="t('user.email.notVerifited')" class="pi pi-exclamation-circle text-sky-600" />
              </div>
            </template>
          </Column>
          <Column field="role" :header="t('admin.listUsers.tableHeader.role')" sortable>
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <Tag
                  v-tooltip.bottom="isWidthSmall ? getUserRole(slotProps.data.role) : undefined"
                  :value="isWidthSmall ? undefined : getUserRole(slotProps.data.role)"
                  :icon="getUserRoleIcon(slotProps.data.role)"
                  :severity="getUserRoleSeverity(slotProps.data.role)"
                  class="whitespace-nowrap"
                  rounded
                />
                <!-- <i v-if="slotProps.data.role === 'guest'" v-tooltip.top="'Bitte Einladung verifizieren'" class="pi pi-exclamation-circle text-sky-600" /> -->
              </div>
            </template>
          </Column>
          <Column v-if="!isWidthSmall" field="additionalGuests" :header="t('admin.listUsers.tableHeader.additionalGuests')" sortable>
            <template #body="slotProps">
              <span>{{ slotProps.data.additionalGuests }}</span>
            </template>
          </Column>
          <Column field="invitation" :header="t('admin.listUsers.tableHeader.invitationState')" sortable>
            <template #body="slotProps">
              <InlineMessage
                v-if="slotProps.data.invitation"
                v-tooltip.bottom="getInvitationStatus(slotProps.data.invitation)"
                :severity="getInvitationStatusSeverity(slotProps.data.invitation)"
              />
              <span v-else>-</span>
            </template>
          </Column>
          <Column v-if="windowWidth > 1500" field="phoneNumber" :header="t('admin.listUsers.tableHeader.phone')" sortable>
            <template #body="slotProps">
              <span>{{ slotProps.data.phoneNumber }}</span>
            </template>
          </Column>
          <!-- <Column v-if="!isWidthSmall" field="highscore" :header="t('admin.listUsers.tableHeader.highscore')" sortable>
            <template #body="slotProps">
              <span>{{ slotProps.data.highscore }}</span>
            </template>
          </Column> -->
          <Column v-if="windowWidth > 800" :header="t('admin.listUsers.tableHeader.actions')">
            <template #body="slotProps">
              <div v-if="slotProps.data.role !== 'admin'" class="flex items-center gap-2">
                <CheckGuest
                  v-if="slotProps.data.role === 'guest'"
                  :uid="slotProps.data.uid"
                  @changed="getUsers"
                />
                <CheckGuest
                  v-else
                  :uid="slotProps.data.uid"
                  mode="changeInvitation"
                  @changed="getUsers"
                />
                <DeleteUser
                  :uid="slotProps.data.uid"
                  @deleted="getUsers"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<style scoped>
/* list items */
.user-list-item {
    @apply flex gap-2 items-center border-b mb-2 pb-2 !important;
}
</style>
