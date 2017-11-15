import { combineReducers } from 'redux'
import locationReducer from './location'
import loaderReducer from './loader'
import pollReducer from './poll'
import answersReducer from './answers'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location : locationReducer,
    loader   : loaderReducer,
    poll     : pollReducer,
    answers  : answersReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) {
    return
  }

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
