/* global expect, jest */
import {
  default as locationReducer
} from 'store/location'
import {
  LOCATION_CHANGE,
  locationChange,
  updateLocation,
} from 'store/location/actions'

describe('(Internal Module) Location', () => {
  it('Should export a constant LOCATION_CHANGE.', () => {
    expect(LOCATION_CHANGE).toBe('LOCATION_CHANGE')
  })

  describe('(Action Creators)', () => {
    describe('(Action Creator) locationChange', () => {
      it('Should be exported as a function.', () => {
        expect(typeof locationChange).toBe('function')
      })

      it('Should return an action with type "LOCATION_CHANGE".', () => {
        expect(locationChange()).toHaveProperty('type', LOCATION_CHANGE)
      })

      it('Should assign the first argument to the "payload" property.', () => {
        const locationState = { pathname: '/yup' }

        expect(locationChange(locationState)).toHaveProperty('payload', locationState)
      })

      it('Should default the "payload" property to "/" if not provided.', () => {
        expect(locationChange()).toHaveProperty('payload', '/')
      })
    })

    describe('(Specialized Action Creator) updateLocation', () => {
      let _globalState
      let _dispatch

      beforeEach(() => {
        _globalState = {
          location : locationReducer(undefined, {})
        }
        _dispatch = jest.fn((action) => {
          _globalState = {
            ..._globalState,
            location : locationReducer(_globalState.location, action)
          }
        })
      })

      it('Should be exported as a function.', () => {
        expect(typeof updateLocation).toBe('function')
      })

      it('Should return a function (is a thunk).', () => {
        expect(typeof updateLocation({ dispatch: _dispatch })).toBe('function')
      })

      it('Should call dispatch exactly once.', () => {
        updateLocation({ dispatch: _dispatch })('/')
        expect(_dispatch).toHaveBeenCalledTimes(1)
      })
    })
  })
})
