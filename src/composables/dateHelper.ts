// Create readable date
export default function createReadableDate(date: string | Date, format?: Intl.DateTimeFormatOptions, timeOnly?: boolean) {
    let d
    // If date is already a Date object safe it to d
    // If date is a string, create a Date object from it
    if (date instanceof Date) {
        d = date
    } else {
        d = new Date(date)
    }

    // If timeOnly is true, return only the time
    if (timeOnly) {
        const defaultFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric' } as Intl.DateTimeFormatOptions
        const result = d.toLocaleTimeString('de-DE', format ? format : defaultFormat)
        if (result === 'Invalid Date' || result === '01.01.1970, 01:00:00') {
            return '-'
        }
        return result
    }

    // If timeOnly is false, return date and time
    const defaultFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' } as Intl.DateTimeFormatOptions
    const result = d.toLocaleDateString('de-DE', format ? format : defaultFormat)
    if (result === 'Invalid Date' || result === '01.01.1970, 01:00:00') {
        return '-'
    }
    return result
}
