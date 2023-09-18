import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Skeleton from 'primevue/skeleton'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true })

    // Toast service
    nuxtApp.vueApp.use(ToastService)

    // PrimeVue components
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('Calendar', Calendar)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('Password', Password)
    nuxtApp.vueApp.component('Skeleton', Skeleton)
})
