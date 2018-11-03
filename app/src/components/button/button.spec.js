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

  describe('(Action) onClick', () => {
    it('should update the state', () => {
      const wrapper = shallow(<Button callback={() => Promise.resolve()} />)

      wrapper.find('button').props().onClick()
      expect(wrapper.state()).toEqual({ disabled : true, loading : true })
    })

    it('should call callback', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      const wrapper = shallow(<Button callback={callback} />)

      wrapper.find('button').props().onClick()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('shouldn\'t update the state when disabled', () => {
      const wrapper = shallow(<Button disabled callback={() => Promise.resolve()} />)

      wrapper.find('button').props().onClick()
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })

    it('shouldn\'t update the state with no callback', () => {
      const wrapper = shallow(<Button />)

      wrapper.find('button').props().onClick()
      expect(wrapper.state()).toEqual({ disabled : false, loading : false })
    })
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

  describe('(Render)', () => {
    describe('with text', () => {
      it('should match snapshot', () => {
        const wrapper = shallow(<Button text='Click Me!' />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with prop disabled', () => {
      it('should match snapshot', () => {
        const wrapper = shallow(<Button text='Click Me!' disabled />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with state disabled', () => {
      it('should match snapshot', () => {
        const wrapper = shallow(<Button text='Click Me!' />)

        wrapper.setState({ disabled: true })
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with className', () => {
      it('should match snapshot', () => {
        const wrapper = shallow(<Button className='button button--class' disabled />)

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with loading true', () => {
      it('should match snapshot', () => {
        const wrapper = shallow(<Button text='Click Me!' />)

        wrapper.setState({ disabled : true, loading : true })
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
