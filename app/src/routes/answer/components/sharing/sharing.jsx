import React from 'react'
import PropTypes from 'prop-types'
import './sharing.scss'

const Sharing = ({ poll }) => {
  // Select the text contents from target of the given event
  const selectText = (event) => {
    const doc = document
    const text = event.target
    let range
    let selection

    if (doc.body.createTextRange) {
      range = document.body.createTextRange()
      range.moveToElementText(text)
      range.select()
    } else if (window.getSelection) {
      selection = window.getSelection()
      range = document.createRange()
      range.selectNodeContents(text)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // Generate link for sharing to twitter
  const twitterLink = () => (
    `https://twitter.com/home?status=${poll.question} - Answer this poll at ${window.location.href}`
  )

  // Generate link for sharing to facebook
  const facebookLink = () => (
    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
  )

  // Generate link for sharing via email
  const emailLink = () => (
    `mailto:?&subject=${poll.question}&body=Answer%20this%20poll%20at%20${window.location.href}`
  )

  return (
    <div>
      <h3>
        <span // eslint-disable-line
          className="share-link"
          onClick={selectText}
        >
          { window.location.href.replace(/(^\w+:|^)\/\//, '') }
        </span>
        <a
          className="shareButton twitter"
          target="_blank"
          rel="noopener noreferrer"
          href={twitterLink()}
        >
          <i className="fa fa-twitter" />
        </a>
        <a
          className="shareButton facebook"
          target="_blank"
          rel="noopener noreferrer"
          href={facebookLink()}
        >
          <i className="fa fa-facebook" />
        </a>
        <a
          className="shareButton email"
          target="_blank"
          rel="noopener noreferrer"
          href={emailLink()}
        >
          <i className="fa fa-envelope" />
        </a>
      </h3>
    </div>
  )
}

Sharing.propTypes = {
  poll: PropTypes.shape({
    question: PropTypes.string
  }).isRequired,
}

export default Sharing
