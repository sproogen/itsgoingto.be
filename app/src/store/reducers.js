import { combineReducers } from 'redux'
import loaderReducer from 'store/loader'
import pollReducer from 'store/poll'
import answersReducer from 'store/answers'
import userReducer from 'store/user'
import statsReducer from 'store/stats'

const makeRootReducer = (asyncReducers) => combineReducers({
  loader: loaderReducer,
  poll: pollReducer,
  answers: answersReducer,
  user: userReducer,
  stats: statsReducer,
  ...asyncReducers,
})

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) {
    return
  }

  store.asyncReducers[key] = reducer // eslint-disable-line
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
