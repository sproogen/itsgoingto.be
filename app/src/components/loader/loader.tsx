import React from 'react'
import classNames from 'classnames'
import './loader.scss'

type Props = {
  isLoading: boolean,
}

const Loader = ({ isLoading }: Props): React.ReactElement | null => (
  isLoading ? (
    <div className={classNames('loader-container hideable', { gone: !isLoading })} data-testid="loader">
      <div className="loader">
        <p className="loader__label">?</p>
        <div className="loader__figure" />
      </div>
    </div>
  ) : null
)

export default Loader
