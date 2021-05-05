import { prop, compose } from 'ramda'

/**
 * Returns loading status from the state
 *
 * @param  {object} state App state
 *
 * @return {boolean}      isLoading
 */
export const isLoadingSelector = (state) => compose(prop('loading'), prop('loader'))(state)

/**
 * Returns if passphrase is required from the state
 *
 * @param  {object} state App state
 *
 * @return {boolean}      requiresPassphrase
 */
export const requiresPassphraseSelector = (state) => compose(prop('passphrase'), prop('loader'))(state)
