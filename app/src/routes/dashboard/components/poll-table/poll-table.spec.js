/* global expect, jest */
import React from 'react'
import { shallow } from 'enzyme'
import { map } from 'ramda'
import Paginator from 'components/paginator'
import { PollTable } from './poll-table'

const props = {
  polls       : map((id) => ({ id }), [...Array(10).keys()]),
  pollCount   : 30,
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
      it('should have initial state for loading', () => {
        wrapper = shallow(<PollTable {...props} pollCount={0} />, { disableLifecycleMethods: true })
        expect(wrapper.state().loading).toBe(true)
      })

      it('should have initial state for sorting', () => {
        expect(wrapper.state().sort).toBe('id')
        expect(wrapper.state().sortDirection).toBe('desc' )
      })
    })

    const fetchesPollsForPage = (page, sort, sortDirection) => {
      it('should call setPollPage with initial page', () => {
        expect(props.setPollPage).toHaveBeenCalledWith(page)
      })

      it('should call fetch polls with page, sort and sortDirection', () => {
        expect(props.fetchPolls).toHaveBeenCalledWith(page + 1, sort, sortDirection)
      })

      it('set loading to false', () => {
        expect(wrapper.state().loading).toBe(false)
      })
    }

    describe('(Lifecycle) componentDidMount', () => {
      describe('fetch polls for page', () => {
        fetchesPollsForPage(0, 'id', 'desc')
      })
    })

    describe('(Action) onSort', () => {
      const testHeaderItem = (label, value) => {
        let headerItem

        beforeEach(() => {
          headerItem = wrapper.find({ label })
          wrapper.setState({ sort: value, sortDirection: 'asc' })
          headerItem.props().onSort()
        })

        it('toggles state sortDirection if already sorted on column', () => {
          expect(wrapper.state().sort).toBe(value)
          expect(wrapper.state().sortDirection).toBe('desc')
        })

        it('updates state to column ascending if not already sorted on column', () => {
          wrapper.setState({ sort: 'otherColumn' })
          headerItem.props().onSort()

          expect(wrapper.state().sort).toBe(value)
          expect(wrapper.state().sortDirection).toBe('asc')
        })

        fetchesPollsForPage(0, value, 'desc')
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

    describe('(Action) paginator callback', () => {
      beforeEach(() => {
        wrapper.find(Paginator).props().pageCallback(2)
      })

      fetchesPollsForPage(2, 'id', 'desc')
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

      describe('loading', () => {
        it('should match snapshot', () => {
          wrapper.setState({ loading: true })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with less than 1 page polls', () => {
        it('should match snapshot', () => {
          wrapper.setProps({ polls: map((id) => ({ id }), [...Array(5).keys()]), pollCount: 5 })

          expect(wrapper).toMatchSnapshot()
        })
      })

      describe('with no polls', () => {
        it('should match snapshot', () => {
          wrapper.setProps({ polls: [], pollCount: 0 })

          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})
