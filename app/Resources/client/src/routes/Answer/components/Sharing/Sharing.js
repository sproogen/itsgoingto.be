import React from 'react'
import PropTypes from 'prop-types'
import './Sharing.scss'

// TODO : Auto highlight on url

class Sharing extends React.Component {
  constructor (props) {
    super(props)
  }

  twitterLink = () =>
    'https://twitter.com/home?status=' + this.props.poll.question + ' - Answer this poll at ' + window.location.href

  facebookLink = () =>
    'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href

  emailLink = () =>
    'mailto:?&subject=' + this.props.poll.question + '&body=Answer%20this%20poll%20at%20' + window.location.href

  render = () => (
    <div>
      <h3>
        <span className='share-link'>
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
