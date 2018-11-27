import browserHistory from 'react-router/lib/browserHistory'
import { LOCATION_CHANGE } from 'store/location/actions'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = browserHistory.getCurrentLocation()

export default function locationReducer (state = initialState, action = null) {
  if (action.type === LOCATION_CHANGE) {
    return action.payload
  }
  return state
}
