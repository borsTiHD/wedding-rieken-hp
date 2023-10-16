<template>
    <Card>
        <template #title>
            <div class="flex items-baseline gap-4">
                {{ t('admin.listUsers.header') }}
                <div v-if="selfRegisteredGuests.length > 0" class="flex gap-1 text-sm text-gray-500">
                    <span>{{ t('admin.listUsers.needToCheckSelfRegisteredGuests', { n: selfRegisteredGuests.length }, selfRegisteredGuests.length) }}</span>
                    <i class="pi pi-exclamation-circle text-sky-600" />
                </div>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- User invitation infos -->
                <div class="flex items-center gap-4">
                    <!-- User infos -->
                    <div class="flex flex-col pr-4 border-r-2">
                        <span class="font-bold">{{ t('admin.listUsers.invitedGuests', { n: invitedGuests.length }, invitedGuests.length) }}</span>
                        <span class="text-sm text-gray-500">{{ t('admin.listUsers.pendingInvitations', { n: pendingInvitations.length }, pendingInvitations.length) }}</span>
                    </div>
                    <div class="flex flex-col pr-4 border-r-2">
                        <span class="text-sm text-gray-600">{{ t('admin.listUsers.acceptedInvitations', { n: acceptedInvitations.length }, acceptedInvitations.length) }}</span>
                        <span class="text-sm text-gray-400">{{ t('admin.listUsers.declinedInvitations', { n: declinedInvitations.length }, declinedInvitations.length) }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-bold">{{ t('admin.listUsers.totalGuests', { n: totalGuests }, totalGuests) }}</span>
                    </div>
                </div>

                <!-- Users datatable -->
                <DataTable
                    v-model:filters="filters"
                    :value="usersData"
                    :loading="loading"
                    dataKey="uid"
                    stripedRows
                    paginator
                    size="small"
                    removableSort
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                >
                    <template #header>
                        <div class="flex flex-wrap items-center gap-2">
                            <!-- Refresh users -->
                            <Button icon="pi pi-refresh" rounded raised @click="getUsers" />

                            <!-- Create User modal -->
                            <DisplayModal
                                ref="createUserModal"
                                :header="t('admin.createUser.header')"
                                buttonClass=""
                                :buttonLabel="t('admin.createUser.buttonLabel')"
                                buttonIcon="pi pi-user-plus"
                                buttonRaised
                                button
                            >
                                <template #content>
                                    <CreateUser @created="createUserModal?.close()" />
                                </template>
                            </DisplayModal>

                            <!-- Filter users -->
                            <Dropdown v-model="selectedType" :options="types" optionLabel="name" optionValue="code" :placeholder="t('admin.listUsers.userFilter.placeholder')" class="ml-auto" />
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="globalSearch" :placeholder="t('admin.listUsers.userSearch.placeholder')" />
                            </span>
                        </div>
                    </template>
                    <Column field="photoURL" :header="t('admin.listUsers.tableHeader.avatar')">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.photoURL" :src="slotProps.data.photoURL" :alt="`Avatar from ${slotProps.data.displayName}`" class="h-16 w-16 object-cover shadow-md rounded-md">
                            <div v-else class="h-16 w-16 shadow-md rounded-md bg-gray-200 flex items-center">
                                <span class="text-gray-400 text-center">No Avatar</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="displayName" :header="t('admin.listUsers.tableHeader.name')" sortable>
                        <template #body="slotProps">
                            <div v-tooltip.bottom="`UID: ${slotProps.data.uid}`" class="flex flex-col cursor-pointer" @click="copyUID(slotProps.data.uid)">
                                <span class="font-bold">{{ slotProps.data.displayName }}</span>
                                <div class="flex items-center gap-2">
                                    <span>{{ slotProps.data.email }}</span>
                                    <i v-if="slotProps.data.emailVerified" v-tooltip.top="t('user.email.verified')" class="pi pi-verified text-green-600" />
                                    <i v-else v-tooltip.top="t('user.email.notVerifited')" class="pi pi-exclamation-circle text-sky-600" />
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column field="role" :header="t('admin.listUsers.tableHeader.role')" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <Tag :value="getUserRole(slotProps.data.role)" :severity="getUserRoleSeverity(slotProps.data.role)" class="whitespace-nowrap" rounded />
                                <!-- <i v-if="slotProps.data.role === 'guest'" v-tooltip.top="'Bitte Einladung verifizieren'" class="pi pi-exclamation-circle text-sky-600" /> -->
                            </div>
                        </template>
                    </Column>
                    <Column field="additionalGuests" :header="t('admin.listUsers.tableHeader.additionalGuests')" sortable>
                        <template #body="slotProps">
                            <span>{{ slotProps.data.additionalGuests }}</span>
                        </template>
                    </Column>
                    <Column field="invitation" :header="t('admin.listUsers.tableHeader.invitationState')" sortable>
                        <template #body="slotProps">
                            <i
                                v-if="slotProps.data.invitation"
                                v-tooltip.bottom="getInvitationStatus(slotProps.data.invitation)"
                                class="pi"
                                :class="[
                                    getInvitationStatusIcon(slotProps.data.invitation),
                                    getInvitationStatusColor(slotProps.data.invitation)
                                ]"
                            />
                            <span v-else>-</span>
                        </template>
                    </Column>
                    <Column field="phoneNumber" :header="t('admin.listUsers.tableHeader.phone')" sortable>
                        <template #body="slotProps">
                            <span>{{ slotProps.data.phoneNumber }}</span>
                        </template>
                    </Column>
                    <Column :header="t('admin.listUsers.tableHeader.actions')">
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <CheckGuest
                                    v-if="slotProps.data.role === 'guest'"
                                    :uid="slotProps.data.uid"
                                    @changed="getUsers"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import DisplayModal from '@/components/DisplayModal.vue'
import CreateUser from '@/components/admin/CreateUser.vue'
import CheckGuest from '@/components/admin/CheckGuest.vue'
import type admin from 'firebase-admin'
import type { UserProfile } from '@/types/UserProfile'

// Type definition for user
type User = {
    account: admin.auth.UserRecord;
    profile: UserProfile;
}

// Refs
const createUserModal = ref<InstanceType<typeof DisplayModal>>()

// TODO: Missing action - admin can invite or decline users

// Composables
const toast = useToast()
const { t } = useI18n()

// Data
const users = ref<User[]>([])
const loading = ref(false)
const selectedType = ref('all')
const types = [
    { name: t('admin.listUsers.userFilter.types.all'), code: 'all' },
    { name: t('admin.listUsers.userFilter.types.admin'), code: 'admin' },
    { name: t('admin.listUsers.userFilter.types.invited'), code: 'invited' },
    { name: t('admin.listUsers.userFilter.types.declined'), code: 'declined'},
    { name: t('admin.listUsers.userFilter.types.guest'), code: 'guest'}
]
const invitedGuests = computed(() => users.value.filter((user) => user.profile.role === 'invited'))
const selfRegisteredGuests = computed(() => users.value.filter((user) => user.profile.role === 'guest'))
const pendingInvitations = computed(() => invitedGuests.value.filter((user) => user.profile.invitation === 'pending'))
const acceptedInvitations = computed(() => invitedGuests.value.filter((user) => user.profile.invitation === 'accepted'))
const declinedInvitations = computed(() => invitedGuests.value.filter((user) => user.profile.invitation === 'declined'))
const usersData = computed(() => {
    type DataTableUser = {
        uid: string;
        role: string;
        displayName: string;
        email: string;
        emailVerified: boolean;
        phoneNumber: string;
        photoURL: string;
        additionalGuests: number;
        invitation: string;
    }

    // Mapping for user roles
    const roleMapping = {
        'admin': 'admin',
        'invited': 'invited',
        'guest': 'guest',
        'declined': 'declined'
    }

    // Select users based on selected type
    const selectedRole = roleMapping[selectedType.value as keyof typeof roleMapping] || null
    let selectedUsers = selectedRole ? users.value.filter((user) => user.profile.role === selectedRole) : users.value

    // Convert users to DataTableUser
    const user: DataTableUser[] = selectedUsers.map((user) => ({
        uid: user.account.uid,
        role: user.profile.role,
        displayName: user.account.displayName,
        email: user.account.email,
        emailVerified: user.account.emailVerified,
        phoneNumber: user.profile.phoneNumber,
        photoURL: user.account.photoURL,
        additionalGuests: user.profile.additionalGuests,
        invitation: user.profile.invitation
    }) as DataTableUser)

    // Function to convert a user and switch fields to the i18n string
    const convertUser = (user: DataTableUser) => ({
        ...user,
        role: getUserRole(user.role),
        invitation: getInvitationStatus(user.invitation)
    })

    // Return filtered users
    return globalSearch.value
        ? user.filter((user) => JSON.stringify(convertUser(user)).toLowerCase().includes(globalSearch.value.toLowerCase()))
        : user
})

// Calculate total guests with additional guests
// Add guest only if 'invitation' is 'accepted' and if 'user role' is 'invited'
const totalGuests = computed(() => {
    let total = 0
    users.value.forEach((user) => {
        if (user.profile.role === 'invited' && user.profile.invitation === 'accepted') {
            total += user.profile.additionalGuests + 1
        }
    })
    return total
})

// Table filters
const globalSearch = ref('')
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Return invitation status for user
const getInvitationStatus = (invitation: string) => {
    if (invitation === 'pending') return t('user.invitation.stateNoReponse')
    if (invitation === 'accepted') return t('user.invitation.stateAccepted')
    if (invitation === 'declined') return t('user.invitation.stateDeclined')
    return t('user.invitation.stateNoInvitation')
}

// Return icon for invitation status
const getInvitationStatusIcon = (invitation: string) => {
    if (invitation === 'pending') return 'pi pi-question'
    if (invitation === 'accepted') return 'pi pi-check'
    if (invitation === 'declined') return 'pi pi-times'
    return 'pi pi-ban'
}

// Return severity for invitation status
const getInvitationStatusColor = (invitation: string) => {
    switch (invitation) {
        case 'accepted':
            return 'text-green-600'
        case 'declined':
            return 'text-red-600'
        case 'pending':
            return 'text-sky-600'
        default:
            return 'text-gray-600'
    }
}

// Return user role
const getUserRole = (role: string) => {
    if (role === 'admin') return t('user.userRole.adminRole')
    if (role === 'invited') return t('user.userRole.invitedRole')
    if (role === 'guest') return t('user.userRole.guestRole')
    if (role === 'declined') return t('user.userRole.declinedRole')
    return t('user.userRole.noRole')
}

// Return severity for user role
const getUserRoleSeverity = (role: string) => {
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

// Copy Uid to clipboard
const copyUID = (uid: string) => {
    navigator.clipboard.writeText(uid)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Copied UID to clipboard.', life: 3000 })
}

// Fetch users
const getUsers = async() => {
    loading.value = true

    // Get all users
    const response = await useFetch('/api/users').catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        loading.value = false
        throw error
    })

    // Check if response is ok
    if (!response || !response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get users', life: 10000 })
        loading.value = false
        throw new Error('Could not get users.')
    }

    // Set users
    users.value = response?.data?.value?.result as User[] || []
    loading.value = false
}

// Fetch users on component mount
onMounted(() => {
    getUsers()
})

// Register event to reload users on new user creation
useRegisterEvent('user-created', getUsers)
</script>
