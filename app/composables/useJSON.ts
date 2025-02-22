export function useJSON() {
  function parseJSON(jsonString: string) {
    try {
      return JSON.parse(jsonString)
    }
    catch (error) {
      console.error('Error parsing JSON:', error)
      return null
    }
  }

  function stringifyJSON(obj: any, space: number | string = 0) {
    try {
      return JSON.stringify(obj, null, space)
    }
    catch (error) {
      console.error('Error stringifying JSON:', error)
      return null
    }
  }

  return {
    parseJSON,
    stringifyJSON,
  }
}
