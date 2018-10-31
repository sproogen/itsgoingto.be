/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import EventBus from 'components/event-bus'
import { Question } from './question'

const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn(),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const props = {
  placeholderText: [
    'Ask a question?',
    'Ask a different question?',
  ],
  question: '',
  onQuestionChange: jest.fn(),
}

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) Question', () => {
    describe('(Action) onChange', () => {
      it('should call prop onQuestionChange', () => {
        const wrapper = shallow(<Question {...props} />)
        const event = {
          preventDefault() { },
          target: { value: 'A question' }
        }

        wrapper.find('textarea').simulate('change', event)
        expect(props.onQuestionChange).toHaveBeenCalledWith('A question')
      })
    })

    describe('(Action) onKeyDown', () => {
      const emitFocusPlusZero = (keyCode) => {
        it('emits focus request on index + 1', () => {
          const wrapper = shallow(<Question {...props} />)

          wrapper.find('textarea').simulate('keyDown', { keyCode, preventDefault: () => { } })
          expect(eventBus.emit).toHaveBeenCalledWith('focus', 0)
        })
      }

      describe('key is KEY_DOWN_ARROW', () => {
        emitFocusPlusZero(40)
      })

      describe('key is KEY_ENTER', () => {
        emitFocusPlusZero(13)
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const wrapper = shallow(<Question {...props} />)
        expect(wrapper).toMatchSnapshot()
      })

      describe('with question text', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Question {...props} question={'A real question'} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with place holder text', () => {
        it('matches snapshot', () => {
          const wrapper = shallow(<Question {...props} />)
          wrapper.setState({
            placeholder: 1,
            character: 12,
            cursor: true,
          })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})

//     describe('(Action) onKeyDown', () => {
//       describe('key is KEY_UP_ARROW', () => {
//         it('emits focus request with index - 1', () => {
//           const wrapper = shallow(<Answer {...props} />)

//           wrapper.find('input').simulate('keyDown', { keyCode: 38 })
//           expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
//         })
//       })

//       const emitFocusPlusOne = (keyCode) => {
//         it('emits focus request on index + 1', () => {
//           const wrapper = shallow(<Answer {...props} />)

//           wrapper.find('input').simulate('keyDown', { keyCode })
//           expect(eventBus.emit).toHaveBeenCalledWith('focus', 1)
//         })
//       }

//       describe('key is KEY_DOWN_ARROW', () => {
//         emitFocusPlusOne(40)
//       })

//       describe('key is KEY_ENTER', () => {
//         emitFocusPlusOne(13)
//       })

//       const removeAnswerEmitFocusMinusOne = (keyCode) => {
//         describe(('has text'), () => {
//           let wrapper

//           beforeEach(() => {
//             wrapper = shallow(<Answer {...props} />)
//             wrapper.find('input').simulate('keyDown', { keyCode })
//           })

//           it('should not remove answer', () => {
//             expect(props.onRemoveAnswer).not.toHaveBeenCalled()
//           })

//           it('should not emit focus change', () => {
//             expect(eventBus.emit).not.toHaveBeenCalled()
//           })
//         })

//         describe(('doesn\'t have text'), () => {
//           let wrapper

//           beforeEach(() => {
//             wrapper = shallow(<Answer {...props} text={''} />)
//             wrapper.find('input').simulate('keyDown', { keyCode, preventDefault: () => { } })
//           })

//           it('should call prop remove answer', () => {
//             expect(props.onRemoveAnswer).toHaveBeenCalledWith(0)
//           })

//           it('should not emit focus change', () => {
//             expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
//           })
//         })
//       }

//       describe('key is KEY_BACKSPACE', () => {
//         removeAnswerEmitFocusMinusOne(8)
//       })

//       describe('key is KEY_DELETE', () => {
//         removeAnswerEmitFocusMinusOne(46)
//       })
//     })
