<template>
    <Card>
        <template #title>
            <div class="flex items-baseline gap-4">
                {{ t('admin.listUsers.header') }}
                <div class="flex gap-1 text-sm text-gray-500">
                    <span>Achtung: {{ selfRegisteredGuests ? selfRegisteredGuests.length : 0 }} selbstregistrierte Gäste müssen geprüft werden</span>
                    <i v-if="selfRegisteredGuests.length > 0" class="pi pi-exclamation-circle text-sky-600" />
                </div>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- User invitation infos -->
                <div class="flex items-center gap-4">
                    <!-- User infos -->
                    <div class="flex flex-col pr-4 border-r-2">
                        <span class="font-bold">Es gibt {{ invitedGuests ? invitedGuests.length : 0 }} eingeladene Gäste</span>
                        <span class="text-sm text-gray-500">Davon sind noch {{ pendingInvitations ? pendingInvitations.length : 0 }} Einladungen unbeantwortet</span>
                    </div>
                    <div class="flex flex-col pr-4 border-r-2">
                        <span class="text-sm text-gray-600">Es haben bereits {{ acceptedInvitations ? acceptedInvitations.length : 0 }} Gäste zugesagt</span>
                        <span class="text-sm text-gray-400">Es haben bereits {{ declinedInvitations ? declinedInvitations.length : 0 }} Gäste abgesagt</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-bold">Es werden zusammen {{ totalGuests }} Gäste erwartet</span>
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

                            <Dropdown v-model="selectedType" :options="types" optionLabel="name" optionValue="code" placeholder="Welche User sollen gezeigt werden?" class="ml-auto" />
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="globalSearch" placeholder="Keyword Search" />
                            </span>
                        </div>
                    </template>
                    <Column field="photoURL" header="Avatar">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.photoURL" :src="slotProps.data.photoURL" :alt="`Avatar from ${slotProps.data.displayName}`" class="h-16 w-16 object-cover shadow-md rounded-md">
                            <div v-else class="h-16 w-16 shadow-md rounded-md bg-gray-200 flex items-center">
                                <span class="text-gray-400 text-center">No Avatar</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="displayName" header="Name" sortable>
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
                    <Column field="role" header="Role" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <Tag :value="getUserRole(slotProps.data.role)" :severity="getUserRoleSeverity(slotProps.data.role)" class="whitespace-nowrap" rounded />
                                <!-- <i v-if="slotProps.data.role === 'guest'" v-tooltip.top="'Bitte Einladung verifizieren'" class="pi pi-exclamation-circle text-sky-600" /> -->
                            </div>
                        </template>
                    </Column>
                    <Column field="invitation" header="Invitation Status" sortable>
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
                    <Column field="additionalGuests" header="Additional Guests" sortable>
                        <template #body="slotProps">
                            <span>{{ slotProps.data.additionalGuests }}</span>
                        </template>
                    </Column>
                    <Column field="phoneNumber" header="Phone" sortable>
                        <template #body="slotProps">
                            <span>{{ slotProps.data.phoneNumber }}</span>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <Button
                                    v-if="slotProps.data.role === 'guest'"
                                    v-tooltip.left="'Selbstregistrierten Benutzer einladen oder ablehnen'"
                                    class="whitespace-nowrap"
                                    icon="pi pi-user-plus"
                                    label="Gast prüfen"
                                    size="small"
                                    raised
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
import type admin from 'firebase-admin'
import type { UserProfile } from '@/types/UserProfile'

// Type definition for user
type User = {
    account: admin.auth.UserRecord;
    profile: UserProfile;
}

// Refs
const createUserModal = ref<InstanceType<typeof DisplayModal>>()

// TODO: i18n for this component
// TODO: Missing action - admin can invite or decline users

// Composables
const toast = useToast()
const { t } = useI18n()

// Data
const users = ref<User[]>([])
const loading = ref(false)
const selectedType = ref('all')
const types = [{ name: 'All', code: 'all' }, { name: 'Admin', code: 'admin' }, { name: 'Invited', code: 'invited' }, { name: 'Guest', code: 'guest'}, { name: 'Declined', code: 'declined'}]
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

    // Select users based on selected type
    let selectedUsers = users.value
    if (selectedType.value === 'admin') {
        selectedUsers = users.value.filter((user) => user.profile.role === 'admin')
    } else if (selectedType.value === 'invited') {
        selectedUsers = users.value.filter((user) => user.profile.role === 'invited')
    } else if (selectedType.value === 'guest') {
        selectedUsers = users.value.filter((user) => user.profile.role === 'guest')
    } else if (selectedType.value === 'declined') {
        selectedUsers = users.value.filter((user) => user.profile.role === 'declined')
    }

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
