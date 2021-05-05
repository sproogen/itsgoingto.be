import React from 'react'
import PropTypes from 'prop-types'
import './paginator.scss'

const Paginator = ({
  pageCallback, itemCount, itemsPerPage, page
}) => {
  const pageCount = Math.ceil(itemCount / itemsPerPage)

  const changePage = (newPage) => () => {
    pageCallback(newPage)
  }

  const renderPaginationButton = (key, text, disabled, callback) => (
    <button
      type="button"
      key={key}
      disabled={disabled}
      className={`btn btn-pagination${disabled ? ' disabled' : ''}`}
      onClick={callback}
    >
      {text}
    </button>
  )

  const renderPaginationPages = () => {
    const maxPage = pageCount - 1
    const pages = []
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

    pages.push(renderPaginationButton(0, 1, page === 0, changePage(0)))
    if (start !== 1) {
      pages.push(<div key="start-elipses" className="pagination-elipses">...</div>)
    }
    for (let i = start; i < end; i += 1) {
      pages.push(renderPaginationButton(i, i + 1, page === i, changePage(i)))
    }
    if (end !== maxPage) {
      pages.push(<div key="end-elipses" className="pagination-elipses">...</div>)
    }
    pages.push(renderPaginationButton(maxPage, pageCount, maxPage === page, changePage(maxPage)))

    return pages
  }

  return (
    <div className="pagination-container">
      {pageCount > 1 ? (
        <div>
          {renderPaginationButton('previous', 'PREVIOUS', page <= 0, changePage(page - 1))}
          {renderPaginationPages()}
          {renderPaginationButton('next', 'NEXT', page >= pageCount - 1, changePage(page + 1))}
        </div>
      ) : null}
    </div>
  )
}

Paginator.propTypes = {
  itemCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageCallback: PropTypes.func.isRequired,
}

export default Paginator
