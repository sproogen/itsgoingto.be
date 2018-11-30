/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import EventBus from 'components/event-bus'
import Button from 'components/button'
import { APIError } from 'services/api'
import { Passphrase } from './passphrase'

const eventBus = {
  emit: jest.fn(),
  addListener: jest.fn(),
}

EventBus.getEventBus = jest.fn(() => eventBus)

const props = {
  identifier: 'Hd2eJ9Jk',
  setPassphrase: jest.fn(() => Promise.resolve()),
  fetchPoll: jest.fn(() => Promise.resolve()),
  setRequiresPassphrase: jest.fn(() => Promise.resolve()),
}
let wrapper

describe('(Route) answer', () => {
  describe('(Component) passphrase', () => {
    beforeEach(() => {
      wrapper = shallow(<Passphrase {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onKeyDown', () => {
      describe('key is KEY_ENTER', () => {
        it('emits focus request on index + 1', () => {
          wrapper.find('input').simulate('keyDown', { keyCode: 13, preventDefault: () => { } })
          expect(eventBus.emit).toHaveBeenCalledWith('passphrase-submit')
        })
      })
    })

    describe('(Action) onChange', () => {
      it('updates local state', () => {
        wrapper.find('input').simulate('change', {
          target: { value: 'new passphrase' },
        })
        expect(wrapper.state().value).toBe('new passphrase')
      })
    })

    describe('(Action) submit', () => {
      it('should call setPassphrase with the value', () => {
        wrapper.setState({ value: 'passphrase' })
        return wrapper.find(Button).props().callback()
          .then(() => {
            expect(props.setPassphrase).toHaveBeenCalledWith('passphrase')
          })
      })

      it('should call fetchPoll with the identifier', () => {
        return wrapper.find(Button).props().callback()
          .then(() => {
            expect(props.fetchPoll).toHaveBeenCalledWith(props.identifier)
          })
      })

      it('should call setRequiresPassphrase with valid poll response', () => {
        return wrapper.find(Button).props().callback()
          .then(() => {
            expect(props.setRequiresPassphrase).toHaveBeenCalledWith(false)
          })
      })

      it('should set error to true with invalid poll response', () => {
        let fetchPoll = jest.fn(() => Promise.resolve(new APIError('failed')))
        wrapper = shallow(<Passphrase {...props} fetchPoll={fetchPoll} />)
        return wrapper.find(Button).props().callback()
          .then(() => {
            expect(wrapper.state().error).toBe(true)
          })
      })
    })

    describe('(Render)', () => {
      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })

      describe('error is true', () => {
        it('matches snapshot', () => {
          wrapper.setState({ error: true })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})