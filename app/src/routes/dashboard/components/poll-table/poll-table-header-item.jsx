import React from 'react'
import PropTypes from 'prop-types'
import { isNil, equals } from 'ramda'

const PollTableHeaderItem = ({
  label, style, onSort, sortDirection,
}) => {
  let sortIcon = 'fa fa-sort'

  if (equals('asc', sortDirection)) {
    sortIcon += '-up'
  } else if (equals('desc', sortDirection)) {
    sortIcon += '-down'
  }

  return (
    <th style={style} className={sortDirection ? 'sort-active' : ''}>
      {
        !isNil(onSort)
          ? (
            <button onClick={onSort} type="button" tabIndex={0}>
              {label}
              <i className={sortIcon} />
            </button>
          )
          : <span>{label}</span>
      }
    </th>
  )
}

PollTableHeaderItem.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  sortDirection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onSort: PropTypes.func,
}

PollTableHeaderItem.defaultProps = {
  style: {},
  sortDirection: false,
  onSort: null,
}

export default PollTableHeaderItem
