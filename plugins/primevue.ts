import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true })

    // Toast service
    nuxtApp.vueApp.use(ToastService)

    // PrimeVue components
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('Calendar', Calendar)
    nuxtApp.vueApp.component('Toast', Toast)
})
