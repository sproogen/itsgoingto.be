// ------------------------------------
// Constants
// ------------------------------------
export const LOADING_UPDATE    = 'LOADING_UPDATE'
export const PASSPHRASE_UPDATE = 'PASSPHRASE_UPDATE'

// ------------------------------------
// Actions
// ------------------------------------
export const setLoading = (loading = false) => ({
  type : LOADING_UPDATE,
  loading
})

export const setRequiresPassphrase = (requiresPassphrase = false) => ({
  type : PASSPHRASE_UPDATE,
  requiresPassphrase
})
