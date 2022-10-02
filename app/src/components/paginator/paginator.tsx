import React from 'react'
import PageButton from './page-button'
import './paginator.scss'

type Props = {
  itemCount: number
  itemsPerPage: number,
  page: number,
  pageCallback: (arg0: number) => void
}

const Paginator = ({
  itemCount,
  itemsPerPage,
  page,
  pageCallback,
}: Props): React.ReactElement | null => {
  const pageCount = Math.ceil(itemCount / itemsPerPage)

  const changePage = (newPage: number) => () => {
    pageCallback(newPage)
  }

  const renderPaginationPages = (): React.ReactElement[] => {
    const maxPage = pageCount - 1
    const pages: React.ReactElement[] = []
    let start = 1
    let end = maxPage

    if (page > 3) {
      start = Math.max(Math.min(page - 2, maxPage - 6), 1)
      if (page < pageCount - 3) {
        end = page + 3
      }
    } else {
      end = Math.min(7, maxPage)
    }

    pages.push(<PageButton key="0" text="1" disabled={page === 0} callback={changePage(0)} />)
    if (start !== 1) {
      pages.push(<div key="start-elipses" className="pagination-elipses">...</div>)
    }
    for (let i = start; i < end; i += 1) {
      pages.push(<PageButton key={i} text={i + 1} disabled={page === i} callback={changePage(i)} />)
    }
    if (end !== maxPage) {
      pages.push(<div key="end-elipses" className="pagination-elipses">...</div>)
    }
    pages.push(<PageButton key={maxPage} text={pageCount} disabled={page === maxPage} callback={changePage(maxPage)} />)

    return pages
  }

  return (
    <div className="pagination-container">
      {pageCount > 1 ? (
        <div>
          <PageButton key="previous" text="PREVIOUS" disabled={page <= 0} callback={changePage(page - 1)} />
          {renderPaginationPages()}
          <PageButton key="next" text="NEXT" disabled={page >= pageCount - 1} callback={changePage(page + 1)} />
        </div>
      ) : null}
    </div>
  )
}

export default Paginator
