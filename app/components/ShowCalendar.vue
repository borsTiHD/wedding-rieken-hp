<template>
    <div class="w-72 text-center">
        <div class="flex-auto text-sm font-semibold text-gray-900">{{ month }} {{ year }}</div>
        <div class="mt-2 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div v-for="day in dayNames" :key="day.long">{{ day.short }}</div>
        </div>
        <div v-if="days" class="mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            <button
                v-for="(day, dayIdx) in days"
                :key="day.date"
                type="button"
                tabindex="-1"
                :class="[
                    'cursor-default py-1.5', // base styles
                    day.isSelected && !day.isToday
                        ? 'bg-rose-100' // selected
                        : day.isToday
                            ? 'bg-indigo-100' // background for today
                            : day.isCurrentMonth
                                ? 'bg-white' // background for current month
                                : 'bg-gray-50', // background for other months
                    (day.isSelected || day.isToday) && 'font-semibold', // selected or today
                    // day.isSelected && 'text-white', // selected
                    !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900', // current month and not today and not selected
                    !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400', // not current month and not today and not selected
                    day.isToday && 'text-indigo-600', // today and not selected
                    dayIdx === 0 && 'rounded-tl-lg', // first day
                    dayIdx === 6 && 'rounded-tr-lg', // last day
                    dayIdx === days.length - 7 && 'rounded-bl-lg', // first day of last row
                    dayIdx === days.length - 1 && 'rounded-br-lg' // last day of last row
                ]"
            >
                <time
                    v-if="!day.isSelected"
                    :datetime="day.date"
                    class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                    :class="[
                        // day.isSelected && day.isToday && 'bg-indigo-600', // selected and today
                        // day.isSelected && !day.isToday && 'bg-gray-900' // selected and not today
                    ]"
                >
                    {{ dayjs(day.date).format('D') }}
                </time>
                <ShowCircle v-else>
                    <time
                        :datetime="day.date"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                    >
                        {{ dayjs(day.date).format('D') }}
                    </time>
                </ShowCircle>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekday from 'dayjs/plugin/weekday'
import ShowCircle from '@/components/animations/ShowCircle.vue'
import 'dayjs/locale/en'
import 'dayjs/locale/de'

// Use dayjs plugins
dayjs.extend(isLeapYear)
dayjs.extend(weekday)

type CalendarDay = {
    date: string
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
}

type DayName = {
    short: string
    long: string
}

const props = defineProps<{
    timestamp?: number
}>()

// Switch language based on locale
const { locale } = useI18n()
switch (locale.value) {
    case 'de':
        dayjs.locale('de')
        break
    case 'us':
        dayjs.locale('en')
        break
    default:
        dayjs.locale('de')
        break
}

// Get date based on timestamp
const timestampDate = computed(() => {
    if (!props.timestamp) return dayjs()
    return dayjs(props.timestamp * 1000)
})

// Get month and year based on timestamp
const month = computed(() => timestampDate.value.format('MMMM'))
const year = computed(() => timestampDate.value.format('YYYY'))

// Get day names for calendar based on locale
const dayNames = computed<DayName[]>(() => {
    return Array.from({length: 7}, (_, i) => {
        const day = dayjs().weekday(i)
        return {
            short: day.format('dd'),
            long: day.format('dddd')
        }
    })
})

// Get days for calendar based on timestamp as the current month
const days = computed<CalendarDay[] | false>(() => {
    const daysInMonth = timestampDate.value.daysInMonth()
    const firstDay = timestampDate.value.startOf('month').weekday()
    const lastDay = timestampDate.value.endOf('month').weekday()
    const days: CalendarDay[] = []

    for (let i = 0; i < firstDay; i++) {
        const prevMonthDate = timestampDate.value.subtract(1, 'month').endOf('month').subtract(firstDay - i - 1, 'day')
        const isToday = dayjs().format('YYYY-MM-DD') === prevMonthDate.format('YYYY-MM-DD')
        days.push({ date: prevMonthDate.format('YYYY-MM-DD'), isCurrentMonth: false, isToday, isSelected: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${timestampDate.value.format('YYYY-MM')}-${String(i).padStart(2, '0')}`
        const isToday = dayjs().format('YYYY-MM-DD') === date
        const isSelected = timestampDate.value.format('YYYY-MM-DD') === date
        days.push({ date: date, isCurrentMonth: true, isToday, isSelected })
    }

    for (let i = 0; i < 6 - lastDay; i++) {
        const nextMonthDate = timestampDate.value.add(1, 'month').startOf('month').add(i, 'day')
        const isToday = dayjs().format('YYYY-MM-DD') === nextMonthDate.format('YYYY-MM-DD')
        days.push({ date: nextMonthDate.format('YYYY-MM-DD'), isCurrentMonth: false, isToday, isSelected: false})
    }

    return days
})
</script>
