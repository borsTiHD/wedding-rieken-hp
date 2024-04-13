<template>
    <div class="w-72 mt-10 text-center">
        <div class="flex-auto text-sm font-semibold text-gray-900">{{ month }} {{ year }}</div>
        <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div v-for="day in dayNames" :key="day.long">{{ day.short }}</div>
        </div>
        <div v-if="days" class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            <button v-for="(day, dayIdx) in days" :key="day.date" type="button" :class="['py-1.5 hover:bg-gray-100 focus:z-10', day.isCurrentMonth ? 'bg-white' : 'bg-gray-50', (day.isSelected || day.isToday) && 'font-semibold', day.isSelected && 'text-white', !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900', !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400', day.isToday && !day.isSelected && 'text-indigo-600', dayIdx === 0 && 'rounded-tl-lg', dayIdx === 6 && 'rounded-tr-lg', dayIdx === days.length - 7 && 'rounded-bl-lg', dayIdx === days.length - 1 && 'rounded-br-lg']">
                <time :datetime="day.date" :class="['mx-auto flex h-7 w-7 items-center justify-center rounded-full', day.isSelected && day.isToday && 'bg-indigo-600', day.isSelected && !day.isToday && 'bg-gray-900']">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/en'  // load on demand
import isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(isLeapYear) // use plugin
dayjs.extend(weekday)

const props = defineProps<{
    timestamp?: number
}>()

const month = ref('Januar')
const year = ref('2022')

const dayNames = ref([
    { short: 'M', long: 'Montag' },
    { short: 'D', long: 'Dienstag' },
    { short: 'M', long: 'Mittwoch' },
    { short: 'D', long: 'Donnerstag' },
    { short: 'F', long: 'Freitag' },
    { short: 'S', long: 'Samstag' },
    { short: 'S', long: 'Sonntag' }
])

const days = computed(() => {
    // Format date based on timestamp
    if (!props.timestamp) return false
    const date = new Date(props.timestamp * 1000)
    const today = new Date()

    type CalendarDay = {
        date: string
        isCurrentMonth: boolean
        isToday: boolean
        isSelected: boolean
    }

    const daysInMonth = dayjs(date).daysInMonth()
    const firstDay = dayjs(date).startOf('month').weekday()
    const lastDay = dayjs(date).endOf('month').weekday()
    const days: CalendarDay[] = []

    console.log('Timestamp Date:', date)
    console.log('Today Date:', today)
    console.log('Days in Month:', daysInMonth)
    console.log('First Weekday:', firstDay)
    console.log('Last Weekday:', lastDay)

    for (let i = 1; i < firstDay; i++) {
        const prevMonthDate = dayjs(date).subtract(1, 'month').endOf('month').subtract(firstDay - i - 1, 'day')
        const isToday = dayjs(today).format('YYYY-MM-DD') === prevMonthDate.format('YYYY-MM-DD')
        days.push({ date: prevMonthDate.format('YYYY-MM-DD'), isCurrentMonth: false, isToday, isSelected: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = dayjs(today).format('YYYY-MM-DD') === `${dayjs().format('YYYY-MM')}-${String(i).padStart(2, '0')}`
        const isSelected = dayjs(date).format('YYYY-MM-DD') === `${dayjs().format('YYYY-MM')}-${String(i).padStart(2, '0')}`
        console.log('isToday', isToday, 'isSelected', isSelected, `${dayjs().format('YYYY-MM')}-${String(i).padStart(2, '0')}`)
        days.push({ date: `${dayjs(date).format('YYYY-MM')}-${String(i).padStart(2, '0')}`, isCurrentMonth: true, isToday, isSelected })
    }

    for (let i = 0; i < 7 - lastDay; i++) {
        const nextMonthDate = dayjs(date).add(1, 'month').startOf('month').add(i, 'day')
        const isToday = dayjs(today).format('YYYY-MM-DD') === nextMonthDate.format('YYYY-MM-DD')
        days.push({ date: nextMonthDate.format('YYYY-MM-DD'), isCurrentMonth: false, isToday, isSelected: false})
    }

    return days
})
</script>
