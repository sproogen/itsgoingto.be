/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { browserHistory } from 'react-router'
import { PollTableRow } from './poll-table-row'

browserHistory.push = jest.fn()

const props = {
  poll: {
    id: '1',
    identifier: 'sk93jn28d',
    question: 'This is a question',
    responsesCount: 5,
    deleted: false,
    ended: false,
    created: {
      date: '2019-02-23 13:45:37.000000',
    },
  },
  deletePoll: jest.fn(),
}
let wrapper

describe('(Route) dashboard', () => {
  describe('(Component) poll table row', () => {
    beforeEach(() => {
      wrapper = shallow(<PollTableRow {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) identifier onClick', () => {
      it('should route to identifier', () => {
        wrapper.find('#identifier-1').simulate('click')
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith('/sk93jn28d')
      })
    })

    describe('(Action) delete onClick', () => {
      it('should set state deleting true', () => {
        wrapper.find('#delete-1').simulate('click')
        expect(wrapper.state().deleting).toBe(true)
      })

      it('should call deletePoll with poll identifier', () => {
        wrapper.find('#delete-1').simulate('click')
        expect(props.deletePoll).toHaveBeenCalledTimes(1)
        expect(props.deletePoll).toHaveBeenCalledWith('sk93jn28d')
      })
    })

    describe('(Render)', () => {
      describe('poll is active', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<PollTableRow {...props} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('poll is ended', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<PollTableRow {...props} poll={{ ...props.poll, ended: true }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('poll is deleted', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<PollTableRow {...props} poll={{ ...props.poll, deleted: true }} />)
          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('poll is deleting', () => {
        it('matches snapshot', () => {
          wrapper.setState({ deleting: true })
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})