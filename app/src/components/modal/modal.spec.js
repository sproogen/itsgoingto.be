/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import Modal from './modal'

const MockContent = () => (
  <div>
    Modal content
  </div>
)

describe('(Component) Modal', () => {
  describe('(State)', () => {
    it('should have initial state', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)

      expect(wrapper.state()).toEqual({ hidden: true, willHidden: false })
    })
  })

  describe('(Method) show', () => {
    it('should update the state', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)
      const instance = wrapper.instance()

      instance.show()
      expect(wrapper.state()).toEqual({ hidden: false, willHidden: false })
    })
  })

  describe('(Method) hide', () => {
    it('should update the state', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)
      const instance = wrapper.instance()

      wrapper.setState({ hidden: false })
      instance.hide()

      expect(wrapper.state()).toEqual({ hidden: false, willHidden: true })
    })
  })

  describe('(Method) hidden', () => {
    it('should update the state', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)
      const instance = wrapper.instance()

      wrapper.setState({ hidden: false, willHidden: true })
      instance.hidden()

      expect(wrapper.state()).toEqual({ hidden: true, willHidden: false })
    })
  })

  describe('(Render) while hidden', () => {
    it('matches snapshot', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('(Render) with content after show', () => {
    it('matches snapshot', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)
      const instance = wrapper.instance()

      instance.show()
      wrapper.update()

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('(Render) willHidden after hide', () => {
    it('matches snapshot', () => {
      const wrapper = shallow(<Modal><MockContent /></Modal>)
      const instance = wrapper.instance()

      instance.show()
      instance.hide()
      wrapper.update()

      expect(wrapper).toMatchSnapshot()
    })
  })
})