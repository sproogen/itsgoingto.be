/* global expect */
import React from 'react'
import { shallow } from 'enzyme'
import { PollTableHeaderItem } from './poll-table-header-item';

const props = {
  label: 'Column header',
  style: {},
  sortDirection: false,
  onSort: jest.fn(),
}
let wrapper

describe('(Route) dashboard', () => {
  describe('(Component) poll table header item', () => {
    beforeEach(() => {
      wrapper = shallow(<PollTableHeaderItem {...props} />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onClick', () => {
      describe('has onSort callback', () => {
        const onSort = jest.fn()

        beforeEach(() => {
          wrapper = shallow(<PollTableHeaderItem {...props} onSort={onSort} />)
        })

        it('calls onSort', () => {
          wrapper.find('a').simulate('click')
          expect(onSort).toHaveBeenCalled()
        })
      })
    })

    describe('(Render)', () => {
      describe('has onSort callback', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<PollTableHeaderItem {...props} onSort={() => { }} />)
          expect(wrapper).toMatchSnapshot()
        })

        describe('has sortDirection asc', () => {
          it('matches snapshot', () => {
            wrapper = shallow(<PollTableHeaderItem {...props} onSort={() => { }} sortDirection='asc' />)
            expect(wrapper).toMatchSnapshot()
          })
        })

        describe('has sortDirection desc', () => {
          it('matches snapshot', () => {
            wrapper = shallow(<PollTableHeaderItem {...props} onSort={() => { }} sortDirection='desc' />)
            expect(wrapper).toMatchSnapshot()
          })
        })
      })

      describe('doesn\'t have onSort callback', () => {
        it('matches snapshot', () => {
          wrapper = shallow(<PollTableHeaderItem {...props} onSort={null} />)
          expect(wrapper).toMatchSnapshot()
        })
      })
    })
  })
})