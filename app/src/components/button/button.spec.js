import React from 'react'
import {
  render, fireEvent, screen,
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import EventBus from 'services/event-bus'
import Button from './button'

describe('(Component) Button', () => {
  describe('(Action) onClick', () => {
    it('should set button to disabled', () => {
      render(<Button text="go" callback={() => Promise.resolve(false)} />)
      const button = screen.getByTestId('button-go')

      fireEvent.click(button)
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled')
    })

    it('should remove disabled when callback returns', async () => {
      let resolve
      const promise = new Promise((r) => {
        resolve = r
      })
      render(<Button text="go" callback={() => promise} />)
      const button = screen.getByTestId('button-go')

      fireEvent.click(button)
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled')

      resolve(true)

      await promise.then(() => {
        expect(button).toBeEnabled()
        expect(button).not.toHaveClass('disabled')
      })
    })

    it('should call callback', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      render(<Button text="go" callback={callback} />)
      const button = screen.getByTestId('button-go')

      fireEvent.click(button)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('shouldn\'t call callback when disabled', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      render(<Button text="go" disabled callback={callback} />)
      const button = screen.getByTestId('button-go')

      fireEvent.click(button)
      expect(callback).not.toHaveBeenCalled()
    })

    it('shouldn\'t update the state with no callback', () => {
      render(<Button text="go" />)
      const button = screen.getByTestId('button-go')

      fireEvent.click(button)
      expect(button).toBeEnabled()
      expect(button).not.toHaveClass('disabled')
    })
  })

  describe('(EventListener) submitEvent', () => {
    it('should call handlePress', () => {
      const callback = jest.fn(() => (Promise.resolve()))
      render(<Button text="go" submitEvent="submitButton" callback={callback} />)
      act(() => {
        EventBus.getEventBus().emit('submitButton')
      })
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('(Render)', () => {
    describe('with text', () => {
      it('should match snapshot', () => {
        const { asFragment } = render(<Button text="Click Me!" />)

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with prop disabled', () => {
      it('should match snapshot', () => {
        const { asFragment } = render(<Button text="Click Me!" disabled />)

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with className', () => {
      it('should match snapshot', () => {
        const { asFragment } = render(<Button className="button button--class" disabled />)

        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('with loading true', () => {
      it('should match snapshot', () => {
        const { asFragment } = render(<Button text="Click Me!" callback={() => Promise.resolve(false)} />)
        const button = screen.getByTestId('button-Click-Me-')

        fireEvent.click(button)
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
})
