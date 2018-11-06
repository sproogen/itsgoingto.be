import browserHistory from 'react-router/lib/browserHistory'
import { LOCATION_CHANGE } from 'store/location/actions'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = browserHistory.getCurrentLocation()

export default function locationReducer (state = initialState, action) {
  return action.type === LOCATION_CHANGE
    ? action.payload
    : state
}