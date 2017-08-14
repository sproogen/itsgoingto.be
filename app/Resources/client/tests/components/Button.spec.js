import React from 'react'
import Button from 'components/Button/Button'
import { shallow, mount } from 'enzyme'
import EventBus from 'components/EventBus'

describe('(Component) Button', () => {
  it('renders as a button', () => {
    const wrapper = shallow(<Button />)
    const inst = wrapper.instance()
    expect(inst).to.be.instanceOf(Button)
    expect(wrapper.name()).to.equal('button')
  })

  describe('(State)', () => {
    it('Should have initial state', () => {
      const wrapper = mount(<Button />)
      expect(wrapper.state()).to.deep.equal({ disabled : false, loading : false })
    })
  })

  describe('(Props)', () => {
    it('Should have default props', () => {
      const wrapper = mount(<Button />)
      expect(wrapper.props().text).to.equal('')
      expect(wrapper.props().className).to.equal('')
      expect(wrapper.props().disabled).to.equal(false)
    })

    it('Should have props', () => {
      const wrapper = mount(
        <Button text='Click Me!' className='button' disabled callback={() => {}} submitEvent='onSubmit' />
      )
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
      const wrapper = shallow(<Button disabled />).instance()
      expect(wrapper.isDisabled()).to.equal(true)
    })

    it('Should return true for state', () => {
      const wrapper = shallow(<Button />).instance()
      wrapper.setState({ disabled: true })
      expect(wrapper.isDisabled()).to.equal(true)
    })
  })

  describe('(Method) handlePress', () => {
    it('Should update the state', () => {
      const wrapper = shallow(<Button callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()
      instance.handlePress()
      expect(wrapper.state()).to.deep.equal({ disabled : true, loading : true })
    })

    it('Should call callback', () => {
      const callback = sinon.stub().returns(Promise.resolve())
      const wrapper = shallow(<Button callback={callback} />)
      const instance = wrapper.instance()
      instance.handlePress()
      callback.should.have.been.calledOnce()
    })

    it('Shouldn\'t update the state when disabled', () => {
      const wrapper = shallow(<Button disabled callback={() => Promise.resolve()} />)
      const instance = wrapper.instance()
      instance.handlePress()
      expect(wrapper.state()).to.deep.equal({ disabled : false, loading : false })
    })

    it('Shouldn\'t update the state with no callback', () => {
      const wrapper = shallow(<Button />)
      const instance = wrapper.instance()
      instance.handlePress()
      expect(wrapper.state()).to.deep.equal({ disabled : false, loading : false })
    })

    // Note : I don't seem to be able to test the promise callback in handlePress
  })

  describe('(EventListener) submitEvent', () => {
    const wrapper = mount(<Button submitEvent='submitButton' />)
    const spy = sinon.spy(wrapper.instance(), 'handlePress')
    it('Should call handlePress', () => {
      EventBus.getEventBus().emit('submitButton')
      spy.should.have.been.calledOnce()
    })
  })

  describe('(Render) button', () => {
    it('Should render the text', () => {
      const wrapper = shallow(<Button text='Click Me!' />)
      expect(wrapper.text()).to.equal('Click Me!')
    })

    it('Should be disabled', () => {
      const wrapper = shallow(<Button text='Click Me!' disabled />)
      expect(wrapper.props().disabled).to.equal(true)
      expect(wrapper.props().className).to.equal('btn  disabled')
    })

    it('Should have className', () => {
      const wrapper = shallow(<Button className='button button--class' disabled />)
      expect(wrapper.props().className).to.equal('btn button button--class disabled')
    })

    it('Should render spinner when loading', () => {
      const wrapper = shallow(<Button text='Click Me!' />)
      wrapper.setState({ disabled : true, loading : true })
      expect(wrapper.text()).to.equal('<Spinner />')
    })
  })
})
