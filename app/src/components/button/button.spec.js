/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import Button from './button'
import EventBus from 'components/event-bus'

describe('(Component) Button', () => {
  const wrapper = shallow(<Button />)
  const instance = wrapper.instance()

  it('renders as a button', () => {
    expect(instance).toBeInstanceOf(Button)
    expect(wrapper.name()).toBe('button')
  })

  describe('(State)', () => {
    it('Should have initial state', () => {
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })
  })

  describe('(Props)', () => {
    it('Should have default props', () => {
      expect(instance.props.text).toBe('')
      expect(instance.props.className).toBe('')
      expect(instance.props.disabled).toBe(false)
      expect(instance.props.callback).toBe(null)
      expect(instance.props.submitEvent).toBe(null)
    })
  })

  describe('(Method) isDisabled', () => {
    it('Should return false as default', () => {
      const wrapper = shallow(<Button />).instance()

      expect(wrapper.isDisabled()).toBe(false)
    })

    it('Should return true for prop', () => {
      const wrapper = shallow(<Button disabled />).instance()

      expect(wrapper.isDisabled()).toBe(true)
    })

    it('Should return true for state', () => {
      const wrapper = shallow(<Button />).instance()

      wrapper.setState({ disabled: true })
      expect(wrapper.isDisabled()).toBe(true)
    })
  })

  describe('(Method) handlePress', () => {
    it('Should update the state', () => {
      const wrapper = shallow(<Button callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()

      instance.handlePress()
      expect(wrapper.state()).toEqual({ disabled : true, loading : true })
    })

    it('Should call callback', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      const wrapper = shallow(<Button callback={callback} />)

      wrapper.instance().handlePress()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('Shouldn\'t update the state when disabled', () => {
      const wrapper = shallow(<Button disabled callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()

      instance.handlePress()
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })

    it('Shouldn\'t update the state with no callback', () => {
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

    it('Should call handlePress', () => {
      EventBus.getEventBus().emit('submitButton')
      expect(instance.handlePress).toHaveBeenCalledTimes(1)
    })
  })

  describe('(Render) snapshot', () => {
    it('Should render the text', () => {
      const wrapper = shallow(<Button text='Click Me!' />)

      expect(wrapper).toMatchSnapshot()
    })

    it('Should be disabled', () => {
      const wrapper = shallow(<Button text='Click Me!' disabled />)

      expect(wrapper).toMatchSnapshot()
    })

    it('Should have className', () => {
      const wrapper = shallow(<Button className='button button--class' disabled />)

      expect(wrapper).toMatchSnapshot()
    })

    it('Should render spinner when loading', () => {
      const wrapper = shallow(<Button text='Click Me!' />)

      wrapper.setState({ disabled : true, loading : true })
      expect(wrapper).toMatchSnapshot()
    })
  })
})
