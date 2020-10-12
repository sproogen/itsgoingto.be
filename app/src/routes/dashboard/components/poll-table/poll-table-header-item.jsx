import React from 'react'
import PropTypes from 'prop-types'
import { isNil, equals } from 'ramda'

const PollTableHeaderItem = ({ label, style, onSort, sortDirection }) => {
  let sortIcon = null

  if (equals('asc', sortDirection)) {
    sortIcon = <i className='fa fa-sort-up' />
  } else if (equals('desc', sortDirection)) {
    sortIcon = <i className='fa fa-sort-down' />
  } else {
    sortIcon = <i className='fa fa-sort' />
  }

  return (
    <th style={style} className={sortDirection && 'sort-active'}>
      {!isNil(onSort) ? <a onClick={onSort}>{label} {sortIcon}</a> : <span>{label}</span>}
    </th>
  )
}

PollTableHeaderItem.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
}

PollTableHeaderItem.defaultProps = {
  style: {},
  sortDirection: null,
  onSort: null,
}

export default PollTableHeaderItem
