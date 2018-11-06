import browserHistory from 'react-router/lib/browserHistory'
import { LOCATION_CHANGE } from 'store/location/actions'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = browserHistory.getCurrentLocation()

export default function locationReducer (state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return action.payload
    default:
      return state
  }
}