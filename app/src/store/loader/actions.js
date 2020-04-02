import { LOADING_UPDATE, PASSPHRASE_UPDATE } from './constants'

// ------------------------------------
// Actions
// ------------------------------------
export const setLoading = (loading = false) => ({
  type: LOADING_UPDATE,
  loading
})

export const setRequiresPassphrase = (requiresPassphrase = false) => ({
  type: PASSPHRASE_UPDATE,
  requiresPassphrase
})
