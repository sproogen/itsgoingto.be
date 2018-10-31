/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Answers } from './answers'

const props = {
  hasQuestion : true,
  answers     : [],
}

describe('(Route) Ask', () => {
  describe('(Component) Answers', () => {
    describe('(Render)', () => {
      describe('when hasQuestion is true', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Answers {...props} hasQuestion={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when hasQuestion is false', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Answers {...props} hasQuestion={false} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with answers as strings', () => {
        const answers = [
          'Answer 1',
          'Answer 2',
          'Answer 3'
        ]
        it('matches snapshot', () => {
          const wrapper = shallow(<Answers {...props} answers={answers} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with answers as objects', () => {
        const answers = [
          { answer: 'Answer 4' },
          { answer: 'Answer 5' },
          { answer: 'Answer 6' }
        ]
        it('matches snapshot', () => {
          const wrapper = shallow(<Answers {...props} answers={answers} />)
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
