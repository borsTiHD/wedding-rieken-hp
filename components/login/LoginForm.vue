<template>
    <div class="flex gap-4">
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
                <i class="pi pi-user" />
            </span>
            <InputText v-model="username" placeholder="Username" />
        </div>
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
                <i class="pi pi-lock" />
            </span>
            <Password v-model="password" placeholder="Password" toggleMask />
        </div>
    </div>
</template>

<script setup lang="ts">
const username = ref('')
const password = ref('')
</script>
