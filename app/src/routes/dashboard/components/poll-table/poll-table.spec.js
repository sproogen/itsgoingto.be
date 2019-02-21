/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { PollTable } from './poll-table'

const props = {
  polls       : [],
  pollCount   : 0,
  page        : 0,
  fetchPolls  : jest.fn(() => Promise.resolve()),
  setPollPage : jest.fn(),
  deletePoll  : jest.fn(),
}
let wrapper

describe('(Route) dashboard', () => {
  beforeEach(() => {
    wrapper = shallow(<PollTable {...props} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('(Component) poll table', () => {
    describe('(State)', () => {
      it('should have initial state for sorting', () => {
        expect(wrapper.state().sort).toBe('id')
        expect(wrapper.state().sortDirection).toBe('desc' )
      })
    })

    describe('(Action) onSort', () => {
      const testHeaderItem = (label, value) => {
        it('updates state to column ascending if not already sorted on column', () => {
          const headerItem = wrapper.find({ label })
          wrapper.setState({ sort: 'otherColumn' })
          headerItem.props().onSort()

          expect(wrapper.state().loading).toBe(true)
          expect(wrapper.state().sort).toBe(value)
          expect(wrapper.state().sortDirection).toBe('asc')
        })

        it('toggles state sortDirection if already sorted on column', () => {
          const headerItem = wrapper.find({ label })
          wrapper.setState({ sort: value, sortDirection: 'asc' })
          headerItem.props().onSort()

          expect(wrapper.state().loading).toBe(true)
          expect(wrapper.state().sort).toBe(value)
          expect(wrapper.state().sortDirection).toBe('desc')
        })

        it('should call fetch polls with sort and sortDirection', () => {
          const headerItem = wrapper.find({ label })
          wrapper.setState({ sort: value, sortDirection: 'asc' })
          headerItem.props().onSort()

          expect(props.fetchPolls).toHaveBeenCalledWith(1, value, 'desc')
        })
      }

      describe('ID', () => {
        testHeaderItem('ID', 'id')
      })

      describe('Identifier', () => {
        testHeaderItem('Identifier', 'identifier')
      })

      describe('Question', () => {
        testHeaderItem('Question', 'question')
      })

      describe('Responses', () => {
        testHeaderItem('Responses', 'responsesCount')
      })

      describe('Created At', () => {
        testHeaderItem('Created At', 'created')
      })
    })

    describe('(Render)', () => {
      describe('sort equals id asc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'id', sortDirection: 'asc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals id desc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'id', sortDirection: 'desc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals identifier asc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'identifier', sortDirection: 'asc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals identifier desc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'identifier', sortDirection: 'desc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals question asc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'question', sortDirection: 'asc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals question desc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'question', sortDirection: 'desc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals responsesCount asc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'responsesCount', sortDirection: 'asc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals responsesCount desc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'responsesCount', sortDirection: 'desc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals created asc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'created', sortDirection: 'asc' })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('sort equals created desc', () => {
        it('should match snapshot', () => {
          wrapper.setState({ sort: 'created', sortDirection: 'desc' })

          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
