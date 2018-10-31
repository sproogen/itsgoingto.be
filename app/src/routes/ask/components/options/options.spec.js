/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import Options from './options'

const props = {
  hasQuestion : true,
  poll        : { question: 'Question', answers: [] },
}

describe('(Route) Ask', () => {
  describe('(Component) Options', () => {
    describe('(Render)', () => {
      describe('when hasQuestion is true', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Options {...props} hasQuestion={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when hasQuestion is false', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Options {...props} hasQuestion={false} />)
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
