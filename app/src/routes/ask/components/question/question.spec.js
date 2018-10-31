/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import EventBus from 'components/event-bus'
import { Question } from './question'

const eventBus = {
  emit        : jest.fn(),
  addListener : jest.fn(),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const props = {
  placeholderText: [
    'Ask a question?',
    'Ask a different question?',
  ],
  question         : '',
  onQuestionChange : jest.fn(),
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
            placeholder : 1,
            character   : 12,
            cursor      : true,
          })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
