/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Passphrase } from './passphrase'

const props = {
  poll          : { passphrase: 'Password' },
  updateOptions : jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Component) Passphrase', () => {
    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        const wrapper = shallow(<Passphrase {...props} />)
        const event = {
          preventDefault() { },
          target: { value: 'New Password' }
        }

        wrapper.find('input').simulate('change', event)
        expect(props.updateOptions).toHaveBeenCalledWith({
          identifier : '',
          passphrase : 'New Password',
        })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Passphrase {...props} />)
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
