import React from 'react'
import PropTypes from 'prop-types'
import './Sharing.scss'

class Sharing extends React.Component {
  constructor (props) {
    super(props)
  }

  // Select the text contents from target of the given event
  selectText = (event) => {
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
  twitterLink = () =>
    'https://twitter.com/home?status=' + this.props.poll.question + ' - Answer this poll at ' + window.location.href

  // Generate link for sharing to facebook
  facebookLink = () =>
    'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href

  // Generate link for sharing via email
  emailLink = () =>
    'mailto:?&subject=' + this.props.poll.question + '&body=Answer%20this%20poll%20at%20' + window.location.href

  render = () => (
    <div>
      <h3>
        <span
          className='share-link'
          onClick={ this.selectText }>
          { window.location.href.replace(/(^\w+:|^)\/\//, '') }
        </span>
        <a
          className='shareButton twitter'
          target='_blank'
          href={ this.twitterLink() }>
          <i className="fa fa-twitter" />
        </a>
        <a
          className='shareButton facebook'
          target='_blank'
          href={ this.facebookLink() }>
          <i className='fa fa-facebook' />
        </a>
        <a
          className='shareButton email'
          target='_blank'
          href={ this.emailLink() }>
          <i className='fa fa-envelope' />
        </a>
      </h3>
    </div>
  )
}

Sharing.propTypes = {
  poll : PropTypes.object.isRequired
}

export default Sharing
