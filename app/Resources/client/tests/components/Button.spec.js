import React from 'react'
import Button from 'components/Button/Button'
import { shallow, mount } from 'enzyme'

describe('(Component) Button', () => {
  it('renders as a button', () => {
    const wrapper = shallow(<Button />)
    const inst = wrapper.instance()
    expect(inst).to.be.instanceOf(Button)
    expect(wrapper.name()).to.equal('button')
  })

  describe('(Props)', () => {
    it('Should have default props', () => {
      const wrapper = mount(<Button />)
      expect(wrapper.props().text).to.equal('')
      expect(wrapper.props().className).to.equal('')
      expect(wrapper.props().disabled).to.equal(false)
    })

    it('Should have props', () => {
      const wrapper = mount(<Button text='Click Me!' className='button' disabled={true} callback={()=>{}} submitEvent='onSubmit' />)
      expect(wrapper.props().text).to.equal('Click Me!')
      expect(wrapper.props().className).to.equal('button')
      expect(wrapper.props().disabled).to.equal(true)
      expect(wrapper.props().callback).to.be.a('function')
      expect(wrapper.props().submitEvent).to.equal('onSubmit')
    })
  })

  describe('(Method) isDisabled', () => {
    it('Should return false as default', () => {
      const wrapper = shallow(<Button />).instance()
      expect(wrapper.isDisabled()).to.equal(false)
    })

    it('Should return true for prop', () => {
      const wrapper = shallow(<Button disabled={true} />).instance()
      expect(wrapper.isDisabled()).to.equal(true)
    })

    it('Should return true for state', () => {
      const wrapper = shallow(<Button />).instance()
      wrapper.setState({ disabled: true })
      expect(wrapper.isDisabled()).to.equal(true)
    })
  })

  describe('(Method) handlePress', () => {

  })

  // TODO : Test submit event / event listener

  describe('(Render)', () => {
    it('Should render the text', () => {
      const wrapper = shallow(<Button text='Click Me!' />)
      expect(wrapper.text()).to.equal('Click Me!')
    })

    // TODO : Test disabled
    // TODO : Test className
    // TODO : Test loading / spinner
  })
})
