import React from 'react'
import {
  render, fireEvent, screen
} from '@testing-library/react'
import MultipleChoice from './multiple-choice'

const defaultProps = {
  poll: { multipleChoice: false },
  updateOptions: jest.fn(),
}

describe('(Route) Ask', () => {
  describe('(Component) Multiple Choice', () => {
    describe('(Action) onChange', () => {
      it('should call prop onAnswerChange', () => {
        render(<MultipleChoice {...defaultProps} />)

        const input = screen.getByLabelText('Multiple choice responses')

        fireEvent.click(input)
        expect(defaultProps.updateOptions).toHaveBeenCalledWith({
          identifier: '',
          multipleChoice: true,
        })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        const { asFragment } = render(<MultipleChoice {...defaultProps} />)

        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})
