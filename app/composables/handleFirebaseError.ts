import type { FirebaseError } from 'firebase/app'

// Error handling function
export default function handleFirebaseError(error: FirebaseError, defaultCode: string) {
  // Log original error
  console.error(error)

  // Exception for 'auth/requires-recent-login'
  // This error is thrown when the user's last sign-in time does not meet the security threshold
  // This error code will be handled in the calling function
  if (error.code === 'auth/requires-recent-login') {
    throw new Error(error.code)
  }

  // Exception for 'permission-denied'
  // This error is thrown when the user's role does not have the required permissions
  // This error code will be handled in the calling function
  if (error.code === 'permission-denied') {
    throw error
  }

  // Localisation
  // const { t } = useI18n() // Can't use i18n here, because it's only available in the setup() function
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  // Mapping Firebase error translations
  const errorTranslations: { [key: string]: string } = {
    // Firebase error messages
    'permission-denied': 'firebase.permission-denied',
    'auth/email-already-in-use': 'firebase.email-already-in-use',
    'auth/invalid-email': 'firebase.invalid-email',
    'auth/weak-password': 'firebase.weak-password',
    'auth/too-many-requests': 'firebase.too-many-requests',
    'auth/user-disabled': 'firebase.user-disabled',
    'auth/user-not-found': 'firebase.user-not-found',
    'auth/id-token-expired': 'firebase.id-token-expired',
    'auth/wrong-password': 'firebase.wrong-password',
    'auth/invalid-email-verified': 'firebase.invalid-email-verified',
    'auth/invalid-action-code': 'firebase.invalid-action-code',
    'auth/operation-not-allowed': 'firebase.operation-not-allowed',
    'auth/quota-exceeded': 'firebase.quota-exceeded',
    'auth/expired-action-code': 'firebase.expired-action-code',
    'auth/requires-recent-login': 'firebase.requires-recent-login',
    'auth/unauthorized-continue-uri': 'firebase.unauthorized-continue-uri',

    // Storage error messages
    'storage/unauthorized': 'firebase.storage.unauthorized',
    'storage/canceled': 'firebase.storage.canceled',
    'storage/unknown': 'firebase.storage.unknown',

    // Custom error messages
    'custom/document-does-not-exist': 'firebase.custom.documentDoesNotExist',
    'custom/invalid-arguments': 'firebase.custom.invalidArguments',
    'custom/firestore-not-initialized': 'firebase.custom.firestoreNotInitialized',
  }

  // Set default error message
  let errorMessage: string = t(defaultCode)

  // Check if error code is in the mapping
  if (error.code && Object.prototype.hasOwnProperty.call(errorTranslations, error.code)) {
    errorMessage = t(errorTranslations[error.code] || defaultCode)
  }
  else if (error.message && Object.prototype.hasOwnProperty.call(errorTranslations, error.message)) {
    errorMessage = t(errorTranslations[error.message] || defaultCode)
  }

  // Log error message
  console.error(errorMessage)

  // Return error message
  return errorMessage
}
