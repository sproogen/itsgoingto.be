import React from 'react'
import PropTypes from 'prop-types'
import './Paginator.scss'

class Paginator extends React.Component {
  renderPaginationButton = (key, text, disabled, callback) => {
    return (
      <button
        key={key}
        disabled={disabled}
        className={'btn btn-pagination' + (disabled ? ' disabled' : '')}
        onClick={callback}>
        {text}
      </button>
    )
  }

  changePage = (page) => () => {
    const { pageCallback } = this.props

    pageCallback(page)
  }

  render () {
    const { itemCount, itemsPerPage, page } = this.props
    const pageCount = Math.ceil(itemCount / itemsPerPage)
    const maxPage = pageCount - 1

    let pages = []
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

    pages.push(this.renderPaginationButton(0, 1, page === 0, this.changePage(0)))
    if (start !== 1) pages.push(<div key='start-elipses' className='pagination-elipses'>...</div>)
    for (var i = start; i < end; i++) {
      pages.push(this.renderPaginationButton(i, i + 1, page === i, this.changePage(i)))
    }
    if (end !== maxPage) pages.push(<div key='end-elipses' className='pagination-elipses'>...</div>)
    pages.push(this.renderPaginationButton(maxPage, pageCount, maxPage === page, this.changePage(maxPage)))

    return (
      <div className='pagination-container'>
        {pageCount > 1 &&
          <div>
            {this.renderPaginationButton('previous', 'PREVIOUS', page <= 0, this.changePage(page - 1))}
            {pages}
            {this.renderPaginationButton('next', 'NEXT', page >= pageCount - 1, this.changePage(page + 1))}
          </div>
        }
      </div>
    )
  }
}

Paginator.propTypes = {
  itemCount    : PropTypes.number.isRequired,
  itemsPerPage : PropTypes.number.isRequired,
  page         : PropTypes.number.isRequired,
  pageCallback : PropTypes.func.isRequired,
}

export default Paginator
