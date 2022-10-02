import React from 'react'
import {
  fireEvent,
  render, screen,
} from '@testing-library/react'
import Answer from './answer'

const defaultProps = {
  index: 1,
  type: 'radio',
  answer: {
    id: 1,
    answer: 'A',
    responsesCount: 1,
  },
  poll: {
    ended: false,
  },
  totalResponses: 1,
  checked: false,
  viewOnly: false,
  onResponseSelected: jest.fn(),
}

describe('(Route) answer', () => {
  describe('(Component) answer', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onClick', () => {
      describe('poll not ended and not viewOnly', () => {
        beforeEach(() => {
          render(<Answer {...defaultProps} poll={{ ended: false }} viewOnly={false} />)
        })

        it('calls onResponseSelected with answer id', () => {
          fireEvent.click(screen.getByText('A'))
          expect(defaultProps.onResponseSelected).toHaveBeenCalledWith(1)
        })

        it('set label click class', () => {
          fireEvent.click(screen.getByText('A'))
          expect(screen.getByText('A').parentNode).toHaveClass('input-label-options--click')
        })
      })

      describe('poll ended', () => {
        it('should not call onResponseSelected', () => {
          render(<Answer {...defaultProps} poll={{ ended: true }} viewOnly={false} />)

          fireEvent.click(screen.getByText('A'))
          expect(defaultProps.onResponseSelected).not.toHaveBeenCalled()
        })
      })

      describe('view only', () => {
        it('should not call onResponseSelected', () => {
          render(<Answer {...defaultProps} poll={{ ended: false }} viewOnly />)

          fireEvent.click(screen.getByText('A'))
          expect(defaultProps.onResponseSelected).not.toHaveBeenCalled()
        })
      })
    })

    describe('(Render)', () => {
      describe('is type radio', () => {
        it('input is type radio', () => {
          render(<Answer {...defaultProps} type="radio" />)
          expect(screen.getByLabelText('A')).toHaveProperty('type', 'radio')
        })
      })

      describe('is type checkbox', () => {
        it('input is type checkbox', () => {
          render(<Answer {...defaultProps} type="checkbox" />)
          expect(screen.getByLabelText('A')).toHaveProperty('type', 'checkbox')
        })
      })

      describe('answer is checked', () => {
        it('input is checked', () => {
          render(<Answer {...defaultProps} checked />)
          expect(screen.getByLabelText('A')).toBeChecked()
        })
      })

      describe('view only', () => {
        it('set label hidden class', () => {
          render(<Answer {...defaultProps} poll={{ ended: false }} viewOnly />)

          expect(screen.getByText('A').parentNode).toHaveClass('input-label-options--hidden')
        })
      })

      describe('Poll is ended', () => {
        it('set label hidden class', () => {
          render(<Answer {...defaultProps} poll={{ ended: true }} viewOnly={false} />)

          expect(screen.getByText('A').parentNode).toHaveClass('input-label-options--hidden')
        })
      })
    })
  })
})
