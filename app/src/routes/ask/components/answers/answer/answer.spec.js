/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import EventBus from 'components/event-bus'
import { Answer } from './answer'

const eventBus = {
  emit        : jest.fn(),
  addListener : jest.fn(),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const props = {
  index          : 0,
  text           : 'Answer 1',
  disabled       : false,
  onAnswerChange : jest.fn(),
  onRemoveAnswer : jest.fn(),
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) Answer', () => {
    describe('(Props)', () => {
      it('should have default props', () => {
        const wrapper = shallow(<Answer index={0} onAnswerChange={() => { }} onRemoveAnswer={() => { }} />)
        const instance = wrapper.instance()

        expect(instance.props.text).toBe('')
        expect(instance.props.disabled).toBe(false)
      })
    })

    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        const wrapper = shallow(<Answer {...props} />)
        const event = {
          preventDefault() { },
          target: { value: 'Answer 2' }
        }

        wrapper.find('input').simulate('change', event)
        expect(props.onAnswerChange).toHaveBeenCalledWith(0, 'Answer 2')
      })
    })

    describe('(Action) onKeyDown', () => {
      describe('key is KEY_UP_ARROW', () => {
        it('emits focus request with index - 1', () => {
          const wrapper = shallow(<Answer {...props} />)

          wrapper.find('input').simulate('keyDown', { keyCode: 38 })
          expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
        })
      })

      const emitFocusPlusOne = (keyCode) => {
        it('emits focus request on index + 1', () => {
          const wrapper = shallow(<Answer {...props} />)

          wrapper.find('input').simulate('keyDown', { keyCode })
          expect(eventBus.emit).toHaveBeenCalledWith('focus', 1)
        })
      }

      describe('key is KEY_DOWN_ARROW', () => {
        emitFocusPlusOne(40)
      })

      describe('key is KEY_ENTER', () => {
        emitFocusPlusOne(13)
      })

      const removeAnswerEmitFocusMinusOne = (keyCode) => {
        describe(('has text'), () => {
          let wrapper

          beforeEach(() => {
            wrapper = shallow(<Answer {...props} />)
            wrapper.find('input').simulate('keyDown', { keyCode })
          })

          it('should not remove answer', () => {
            expect(props.onRemoveAnswer).not.toHaveBeenCalled()
          })

          it('should not emit focus change', () => {
            expect(eventBus.emit).not.toHaveBeenCalled()
          })
        })

        describe(('doesn\'t have text'), () => {
          let wrapper

          beforeEach(() => {
            wrapper = shallow(<Answer {...props} text={''} />)
            wrapper.find('input').simulate('keyDown', { keyCode, preventDefault: () => { } })
          })

          it('should call prop remove answer', () => {
            expect(props.onRemoveAnswer).toHaveBeenCalledWith(0)
          })

          it('should not emit focus change', () => {
            expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
          })
        })
      }

      describe('key is KEY_BACKSPACE', () => {
        removeAnswerEmitFocusMinusOne(8)
      })

      describe('key is KEY_DELETE', () => {
        removeAnswerEmitFocusMinusOne(46)
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Answer {...props} />)
        expect(wrapper).toMatchSnapshot()
      })

      describe('with disabled is true', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Answer {...props} disabled={true} />)
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
