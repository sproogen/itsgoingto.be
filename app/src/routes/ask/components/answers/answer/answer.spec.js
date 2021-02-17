import React from 'react'
import {
  render, screen, fireEvent
} from '@testing-library/react'
import EventBus from 'services/event-bus'
import Answer from './answer'

const eventListener = {
  remove: jest.fn()
}

const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn(() => eventListener),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const defaultProps = {
  index: 0,
  text: 'Answer 1',
  disabled: false,
  onAnswerChange: jest.fn(),
  onRemoveAnswer: jest.fn(),
}

const KEY_UP_ARROW = { key: 'ArrowUp', keyCode: 38, charCode: 38 }
const KEY_DOWN_ARROW = { key: 'ArrowDown', keyCode: 40, charCode: 40 }
const KEY_ENTER = { key: 'Enter', keyCode: 13, charCode: 13 }
const KEY_BACKSPACE = { key: 'Backspace', keyCode: 8, charCode: 8 }
const KEY_DELETE = { key: 'Delete', keyCode: 46, charCode: 46 }

describe('(Route) Ask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) Answer', () => {
    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        render(<Answer {...defaultProps} />)

        const input = screen.getByLabelText('1')
        fireEvent.change(input, { target: { value: 'Answer 2' } })

        expect(defaultProps.onAnswerChange).toHaveBeenCalledWith(0, 'Answer 2')
      })
    })

    describe('(Action) onKeyDown', () => {
      describe('key is KEY_UP_ARROW', () => {
        it('emits focus request with index - 1', () => {
          render(<Answer {...defaultProps} />)

          const input = screen.getByLabelText('1')
          fireEvent.keyDown(input, KEY_UP_ARROW)

          expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
        })
      })

      const emitFocusPlusOne = (keyCode) => {
        it('emits focus request on index + 1', () => {
          render(<Answer {...defaultProps} />)

          const input = screen.getByLabelText('1')
          fireEvent.keyDown(input, keyCode)

          expect(eventBus.emit).toHaveBeenCalledWith('focus', 1)
        })
      }

      describe('key is KEY_DOWN_ARROW', () => {
        emitFocusPlusOne(KEY_DOWN_ARROW)
      })

      describe('key is KEY_ENTER', () => {
        emitFocusPlusOne(KEY_ENTER)
      })

      const removeAnswerEmitFocusMinusOne = (keyCode) => {
        describe(('has text'), () => {
          beforeEach(() => {
            render(<Answer {...defaultProps} />)

            const input = screen.getByLabelText('1')
            fireEvent.keyDown(input, keyCode)
          })

          it('should not remove answer', () => {
            expect(defaultProps.onRemoveAnswer).not.toHaveBeenCalled()
          })

          it('should not emit focus change', () => {
            expect(eventBus.emit).not.toHaveBeenCalled()
          })
        })

        describe(('doesn\'t have text'), () => {
          beforeEach(() => {
            render(<Answer {...defaultProps} text="" />)

            const input = screen.getByLabelText('1')
            fireEvent.keyDown(input, keyCode)
          })

          it('should call prop remove answer', () => {
            expect(defaultProps.onRemoveAnswer).toHaveBeenCalledWith(0)
          })

          it('should not emit focus change', () => {
            expect(eventBus.emit).toHaveBeenCalledWith('focus', -1)
          })
        })
      }

      describe('key is KEY_BACKSPACE', () => {
        removeAnswerEmitFocusMinusOne(KEY_BACKSPACE)
      })

      describe('key is KEY_DELETE', () => {
        removeAnswerEmitFocusMinusOne(KEY_DELETE)
      })
    })

    describe('(Render)', () => {
      describe('with default props', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Answer index={0} onAnswerChange={() => { }} onRemoveAnswer={() => { }} />)

          expect(asFragment()).toMatchSnapshot()
        })
      })

      it('matches snapshot', () => {
        const { asFragment } = render(<Answer {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })

      describe('with disabled is true', () => {
        it('matches snapshot', () => {
          const { asFragment } = render(<Answer {...defaultProps} disabled />)

          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})
