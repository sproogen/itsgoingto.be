/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Ask } from './ask'

const props = {
  question: '',
  hasQuestion: false,
  canSubmitPoll: false,
  poll: {},
  answers: [],
  clearPoll: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Action) componentDidMount', () => {
    it('should call prop clearPoll', () => {
      const wrapper = shallow(<Ask {...props} />)

      wrapper.instance().componentDidMount()
      expect(props.clearPoll).toHaveBeenCalled()
    })
  })
  describe('(Render)', () => {
    describe('with question', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Ask {...props} question={'Some question'} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when hasQuestion is true', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Ask {...props} hasQuestion={true} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when canSubmitPoll is true', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Ask {...props} canSubmitPoll={true} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with poll', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Ask {...props} poll={{ question: 'Question', identifier: 'kdH98eJ' }} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with answers', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Ask {...props} answers={['Answer 1', 'Answer 2']} />)
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
