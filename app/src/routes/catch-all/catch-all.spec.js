/* global expect, jest */
import React from 'react'
import { browserHistory } from 'react-router'
import { shallow } from 'enzyme'
import CatchAll from './catch-all'

describe('(Route) Catch All', () => {

  it('should redirect to /404 on load', () => {
    browserHistory.push = jest.fn()
    shallow(<CatchAll />)
    expect(browserHistory.push).toBeCalledWith('/404')
  })
})
