import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import EventBus from 'services/event-bus'
import Question from './question'

const eventListener = {
  remove: jest.fn()
}

const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn(() => eventListener),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const props = {
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
        render(<Question {...props} />)

        const textarea = screen.getByTestId('question')
        fireEvent.change(textarea, { target: { value: 'A question' } })

        expect(props.onQuestionChange).toHaveBeenCalledWith('A question')
      })
    })

    describe('(Action) onKeyDown', () => {
      const emitFocusPlusZero = (keyCode) => {
        it('emits focus request on index + 1', () => {
          render(<Question {...props} />)

          const textarea = screen.getByTestId('question')
          fireEvent.keyDown(textarea, { keyCode, preventDefault: () => { } })

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
        const { asFragment } = render(<Question {...props} />)

        expect(asFragment()).toMatchSnapshot()
      })

      describe('with question text', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Question {...props} question="A real question" />)

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})
