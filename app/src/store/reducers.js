import { combineReducers } from 'redux'
import loaderReducer from 'store/loader'
import pollReducer from 'store/poll'
import answersReducer from 'store/answers'
import userReducer from 'store/user'
import statsReducer from 'store/stats'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    loader   : loaderReducer,
    poll     : pollReducer,
    answers  : answersReducer,
    user     : userReducer,
    stats    : statsReducer,
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
