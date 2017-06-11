import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { pollSelector } from '../../../../store/poll'
import './Sharing.scss'

export const Sharing = ({ poll }) => {
  // Select the text contents from target of the given event
  const selectText = (event) => {
    var doc = document,
      text = event.target,
      range,
      selection
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
  const twitterLink = () =>
    'https://twitter.com/home?status=' + poll.question + ' - Answer this poll at ' + window.location.href

  // Generate link for sharing to facebook
  const facebookLink = () =>
    'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href

  // Generate link for sharing via email
  const emailLink = () =>
    'mailto:?&subject=' + poll.question + '&body=Answer%20this%20poll%20at%20' + window.location.href

  return (
    <div>
      <h3>
        <span
          className='share-link'
          onClick={ selectText }>
          { window.location.href.replace(/(^\w+:|^)\/\//, '') }
        </span>
        <a
          className='shareButton twitter'
          target='_blank'
          href={ twitterLink() }>
          <i className="fa fa-twitter" />
        </a>
        <a
          className='shareButton facebook'
          target='_blank'
          href={ facebookLink() }>
          <i className='fa fa-facebook' />
        </a>
        <a
          className='shareButton email'
          target='_blank'
          href={ emailLink() }>
          <i className='fa fa-envelope' />
        </a>
      </h3>
    </div>
  )
}

Sharing.propTypes = {
  poll : PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => ({
  poll : pollSelector(state, props.identifier),
})

export default connect(mapStateToProps)(Sharing)
