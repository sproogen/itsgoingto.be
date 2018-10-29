/* global expect, jest */
import React from 'react'
import { browserHistory } from 'react-router'
import { shallow } from 'enzyme'
import Button from 'components/button'
import { Actions } from './actions'

const props = {
  hasQuestion: true,
  canSubmitPoll: true,
  postPoll: jest.fn(() => Promise.resolve({ identifier: 'jdH93HS' }))
}
let wrapper

describe('(Route) Ask', () => {
  describe('(Component) Actions', () => {
    describe('(Action) Create Poll click', () => {
      beforeEach(() => {
        wrapper = shallow(<Actions {...props} />)
        browserHistory.push = jest.fn()
      })

      it('should call postPoll', () => {
        wrapper.find(Button).props().callback()
        expect(props.postPoll).toBeCalled()
      })

      it('should redirect with poll identifier on successful postPoll and return false', () => {
        return wrapper.find(Button).props().callback()
          .then((response) => {
            expect(response).toBe(false)
            expect(browserHistory.push).toBeCalledWith('/jdH93HS')
          })
      })

      it('should not redirect failed postPoll and return true', () => {
        wrapper = shallow(<Actions {...props} postPoll={jest.fn(() => Promise.resolve(false))} />)

        return wrapper.find(Button).props().callback()
          .then((response) => {
            expect(response).toBe(true)
            expect(browserHistory.push).not.toBeCalled()
          })
      })
    })

    describe('(Render)', () => {
      describe('when hasQuestion is true', () => {
        wrapper = shallow(<Actions {...props} hasQuestion={true} />)
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when hasQuestion is false', () => {
        wrapper = shallow(<Actions {...props} hasQuestion={false} />)
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when canSubmitPoll is true', () => {
        wrapper = shallow(<Actions {...props} canSubmitPoll={true} />)
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('when canSubmitPoll is false', () => {
        wrapper = shallow(<Actions {...props} canSubmitPoll={false} />)
        it('matches snapshot', () => {
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})