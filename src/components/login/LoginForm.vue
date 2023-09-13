<template>
    <form class="flex flex-column gap-2" @submit.prevent="onSubmit">
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
                <i class="pi pi-user" />
            </span>
            <InputText v-model="username" placeholder="Username" name="username" autocomplete="username" />
        </div>
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
                <i class="pi pi-lock" />
            </span>
            <Password v-model="password" placeholder="Password" name="password" autocomplete="current-password" toggleMask />
        </div>

        <Button type="submit" severity="success" label="Sign In" />
    </form>
</template>

<script setup lang="ts">
const username = ref('')
const password = ref('')

const onSubmit = () => {
    console.log(username.value, password.value)
}
</script>
