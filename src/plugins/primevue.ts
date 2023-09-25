import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Skeleton from 'primevue/skeleton'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'
import InlineMessage from 'primevue/inlinemessage'
import Avatar from 'primevue/avatar'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true })

    // Toast service
    nuxtApp.vueApp.use(ToastService)

    // Tooltip directive
    nuxtApp.vueApp.directive('tooltip', Tooltip)

    // PrimeVue components
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('Calendar', Calendar)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('Password', Password)
    nuxtApp.vueApp.component('Skeleton', Skeleton)
    nuxtApp.vueApp.component('TabView', TabView)
    nuxtApp.vueApp.component('TabPanel', TabPanel)
    nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
    nuxtApp.vueApp.component('InlineMessage', InlineMessage)
    nuxtApp.vueApp.component('Avatar', Avatar)
    nuxtApp.vueApp.component('FileUpload', FileUpload)
    nuxtApp.vueApp.component('Dialog', Dialog)
})
