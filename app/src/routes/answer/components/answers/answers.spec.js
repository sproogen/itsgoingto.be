/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { Answers } from './answers'

const props = {
  answers: [{ id: 1, answer: 'A' }, { id: 2, answer: 'B' }],
  poll: {
    question: 'Question?',
    ended: false,
    multipleChoice: false,
  },
  userResponded: false,
  viewOnly: false,
  updateResponses: () => {},
  onResponseSelected: () => {},
  fetchPoll: () => {},
}
let wrapper

describe('(Route) answer', () => {
  describe('(Component) answers', () => {
    beforeEach(() => {
      wrapper = shallow(<Answers {...props} />)
    })

    describe('(Render)', () => {
      describe('has no answers', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} answers={[]} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('has answers', () => {
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('Poll is multiple choice', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} poll={{
            question: 'Question?',
            ended: false,
            multipleChoice: true,
          }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('Poll is ended', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} poll={{
            question: 'Question?',
            ended: true,
            multipleChoice: false,
          }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('User has responded', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} userResponded={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('User has responded to answer', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} userResponded={true} poll={{
            question: 'Question?',
            ended: true,
            multipleChoice: false,
            userResponses: [1],
          }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('is view only', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} viewOnly={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with responses', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answers {...props} totalResponses={10} />)
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})