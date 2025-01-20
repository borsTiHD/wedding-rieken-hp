export function useGoogleMaps(address: Ref<string>) {
  // URL encoded Google maps link for location by address
  const link = computed(() => {
    const googleMapsLink = 'https://www.google.com/maps'
    return address.value ? `${googleMapsLink}/search/?api=1&query=${encodeURIComponent(address.value)}` : googleMapsLink
  })

  return { link }
}
