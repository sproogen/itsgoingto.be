/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import Button from './button'
import EventBus from 'components/event-bus'

describe('(Component) Button', () => {
  describe('(State)', () => {
    it('should have initial state', () => {
      const wrapper = shallow(<Button />)

      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })
  })

  describe('(Props)', () => {
    it('should have default props', () => {
      const wrapper = shallow(<Button />)
      const instance = wrapper.instance()

      expect(instance.props.text).toBe('')
      expect(instance.props.className).toBe('')
      expect(instance.props.disabled).toBe(false)
      expect(instance.props.callback).toBe(null)
      expect(instance.props.submitEvent).toBe(null)
    })
  })

  describe('(Method) isDisabled', () => {
    it('should return false as default', () => {
      const wrapper = shallow(<Button />).instance()

      expect(wrapper.isDisabled()).toBe(false)
    })

    it('should return true for prop', () => {
      const wrapper = shallow(<Button disabled />).instance()

      expect(wrapper.isDisabled()).toBe(true)
    })

    it('should return true for state', () => {
      const wrapper = shallow(<Button />).instance()

      wrapper.setState({ disabled: true })
      expect(wrapper.isDisabled()).toBe(true)
    })
  })

  describe('(Method) handlePress', () => {
    it('should update the state', () => {
      const wrapper = shallow(<Button callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()

      instance.handlePress()
      expect(wrapper.state()).toEqual({ disabled : true, loading : true })
    })

    it('should call callback', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      const wrapper = shallow(<Button callback={callback} />)

      wrapper.instance().handlePress()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('shouldn\'t update the state when disabled', () => {
      const wrapper = shallow(<Button disabled callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()

      instance.handlePress()
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })

    it('shouldn\'t update the state with no callback', () => {
      const wrapper = shallow(<Button />)
      const instance = wrapper.instance()

      instance.handlePress()
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })

    // Note : I don't seem to be able to test the promise callback in handlePress
  })

  describe('(EventListener) submitEvent', () => {
    const wrapper = shallow(<Button submitEvent='submitButton' />)
    const instance = wrapper.instance()

    instance.handlePress = jest.fn()

    it('should call handlePress', () => {
      EventBus.getEventBus().emit('submitButton')
      expect(instance.handlePress).toHaveBeenCalledTimes(1)
    })
  })

  describe('(Render) with text', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(<Button text='Click Me!' />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('(Render) disabled', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(<Button text='Click Me!' disabled />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('(Render) with className', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(<Button className='button button--class' disabled />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('(Render) loading animation', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(<Button text='Click Me!' />)

      wrapper.setState({ disabled : true, loading : true })
      expect(wrapper).toMatchSnapshot()
    })
  })
})
