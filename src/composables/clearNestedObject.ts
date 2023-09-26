export default function clearNestedObject(obj: Record<string, unknown>) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            delete obj[prop]
            // TODO: Fix this, currently it deletes only the first level of nested objects
            // if (typeof obj[prop] === 'object' && !Array.isArray(obj[prop])) {
            //     // Wenn die Eigenschaft ein Objekt ist, rufe die Funktion rekursiv auf
            //     clearNestedObject(obj[prop] as Record<string, unknown>)
            // } else {
            //     // Lösche die Eigenschaft, wenn es sich nicht um ein Objekt handelt
            //     delete obj[prop]
            // }
        }
    }
}
