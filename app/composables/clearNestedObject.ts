export default function clearNestedObject(obj: Record<string, unknown>) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (typeof obj[prop] === 'object' && obj[prop] !== null && !Array.isArray(obj[prop])) {
        // If the property is an object, call the function recursively
        clearNestedObject(obj[prop] as Record<string, unknown>)
      }
      // Delete the property
      delete obj[prop]
    }
  }
}
