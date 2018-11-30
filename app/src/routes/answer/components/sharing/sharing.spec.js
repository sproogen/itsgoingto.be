/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import Sharing from './sharing'

const props = {
  poll: {
    question: 'This is a question',
  },
}
let wrapper

describe('(Route) answer', () => {
  describe('(Component) sharing', () => {
    beforeEach(() => {
      wrapper = shallow(<Sharing {...props} />)
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})