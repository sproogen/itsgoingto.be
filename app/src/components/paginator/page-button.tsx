import React from 'react'
import './paginator.scss'

type Props = {
  key: React.Key
  text: React.ReactText,
  disabled: boolean,
  callback: () => void
}

const PageButton = ({
  key,
  text,
  disabled,
  callback,
}: Props): React.ReactElement => (
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

export default PageButton
