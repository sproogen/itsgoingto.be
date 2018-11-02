/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { MultipleChoice } from './multiple-choice'

const props = {
  poll: { multipleChoice: false },
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Component) Multiple Choice', () => {
    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        const wrapper = shallow(<MultipleChoice {...props} />)
        const event = {
          preventDefault() { },
          target: { checked: true }
        }

        wrapper.find('input').simulate('change', event)
        expect(props.updateOptions).toHaveBeenCalledWith({
          identifier: '',
          multipleChoice: true,
        })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<MultipleChoice {...props} />)

        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
