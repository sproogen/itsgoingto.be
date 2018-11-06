import { prop, compose } from 'ramda'

export const isLoadingSelector = (state) => compose(prop('loading'), prop('loader'))(state)

export const requiresPassphraseSelector = (state) => compose(prop('passphrase'), prop('loader'))(state)
