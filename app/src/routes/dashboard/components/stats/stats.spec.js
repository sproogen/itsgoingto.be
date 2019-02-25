/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Stats } from './stats'

const props = {
  fetchStats: jest.fn(),
}

describe('(Route) dashoard', () => {
  describe('(Component) stats', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<Stats {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Lifecycle) componentDidMount', () => {
      it('should call fetchStats', () => {
        expect(props.fetchStats).toHaveBeenCalledTimes(1)
      })
    })

    describe('(Render)', () => {
      describe('with no stats', () => {
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with stats', () => {
        it('matches snapshot', () => {
          wrapper.setProps({ polls: 15, responses: 39 })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
