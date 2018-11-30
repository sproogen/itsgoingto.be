/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { Answer } from './answer'

const props = {
  index: 1,
  type: 'radio',
  answer: {
    id: 1,
    answer: 'A',
    responsesCount: 1,
  },
  poll: {
    ended: false,
  },
  totalResponses: 1,
  checked: false,
  viewOnly: false,
  onResponseSelected: jest.fn(),
}
let wrapper

describe('(Route) answer', () => {
  describe('(Component) answer', () => {
    beforeEach(() => {
      wrapper = shallow(<Answer {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onClick', () => {
      describe('poll not ended and not viewOnly', () => {
        beforeEach(() => {
          wrapper = shallow(<Answer {...props} poll={{ ended: false }} viewOnly={false} />)
        })

        it('calls onResponseSelected with answer id', () => {
          wrapper.find('label').simulate('click')
          expect(props.onResponseSelected).toHaveBeenCalledWith(1)
        })

        it('set state animating true', () => {
          wrapper.find('label').simulate('click')
          expect(wrapper.state().animating).toBe(true)
        })
      })

      describe('poll ended', () => {
        it('should not call onResponseSelected', () => {
          wrapper = shallow(<Answer {...props} poll={{ ended: true }} viewOnly={false} />)
          wrapper.find('label').simulate('click')
          expect(props.onResponseSelected).not.toHaveBeenCalled()
        })
      })

      describe('view only', () => {
        it('should not call onResponseSelected', () => {
          wrapper = shallow(<Answer {...props} poll={{ ended: false }} viewOnly={true} />)
          wrapper.find('label').simulate('click')
          expect(props.onResponseSelected).not.toHaveBeenCalled()
        })
      })
    })

    describe('(Render)', () => {
      describe('is type radio', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answer {...props} type={'radio'} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('is type checkbox', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answer {...props} type={'checkbox'} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('is checked', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answer {...props} checked={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('is view only', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answer {...props} viewOnly={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('Poll is ended', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<Answer {...props} poll={{ ended: true }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('is animating', () => {
        it('matches snapshot', () => {
          wrapper.setState({ animating: true })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})