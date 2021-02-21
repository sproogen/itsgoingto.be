import React from 'react'
import {
  render, fireEvent, screen
} from '@testing-library/react'
import PollTableHeaderItem from './poll-table-header-item';

const defaultProps = {
  label: 'Column header',
}

const TableWrapper = ({ children }) => <table><thead><tr>{children}</tr></thead></table> // eslint-disable-line

describe('(Route) dashboard', () => {
  describe('(Component) poll table header item', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('(Action) onClick', () => {
      describe('has onSort callback', () => {
        it('calls onSort', () => {
          const onSort = jest.fn()
          render(<PollTableHeaderItem {...defaultProps} onSort={onSort} />, { Wrapper: TableWrapper })

          fireEvent.click(screen.getByRole('button', { name: /Column header/ }))
          expect(onSort).toHaveBeenCalled()
        })
      })
    })

    describe('(Render)', () => {
      describe('has onSort callback', () => {
        it('show fa-sort icon', () => {
          render(<PollTableHeaderItem {...defaultProps} onSort={() => { /* Do nothing */ }} />, { Wrapper: TableWrapper })
          expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toBeInTheDocument()
          expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toHaveClass('fa-sort')
        })

        describe('has sortDirection asc', () => {
          it('show fa-sort-up icon', () => {
            render(
              <PollTableHeaderItem
                {...defaultProps}
                onSort={() => { /* Do nothing */ }}
                sortDirection="asc"
              />, { Wrapper: TableWrapper }
            )
            expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toHaveClass('fa-sort-up')
          })
        })

        describe('has sortDirection desc', () => {
          it('show fa-sort-up icon', () => {
            render(
              <PollTableHeaderItem
                {...defaultProps}
                onSort={() => { /* Do nothing */ }}
                sortDirection="desc"
              />, { Wrapper: TableWrapper }
            )
            expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /Column header/ }).childNodes[1]).toHaveClass('fa-sort-down')
          })
        })
      })

      describe('doesn\'t have onSort callback', () => {
        it('is not a button and does not have fa-sort icon', () => {
          render(<PollTableHeaderItem {...defaultProps} />, { Wrapper: TableWrapper })
          expect(screen.queryByRole('button', { name: /Column header/ })).not.toBeInTheDocument()
          expect(screen.getByText('Column header')).toBeInTheDocument()
          expect(screen.getByText('Column header').childNodes.length).toBe(1)
        })
      })
    })
  })
})
