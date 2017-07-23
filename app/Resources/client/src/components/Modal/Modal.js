import React from 'react'
import PropTypes from 'prop-types'
import './Modal.scss'

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: true,
      willHidden: false
    }
  }

  whichAnimationEvent = () => {
    let t
    const el = document.createElement('fakeelement')
    const transitions = {
      'transition':'animationend',
      'OTransition':'oAnimationEnd',
      'MozTransition':'animationend',
      'WebkitTransition':'webkitAnimationEnd'
    }

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  addAnimationListener = (node, handle) => {
    if (node) {
      const animationEvent = this.whichAnimationEvent()
      const endListener = (e) => {
        if (e && e.target !== node) {
          return
        }
        node.removeEventListener(animationEvent, endListener)
        handle()
      }

      animationEvent && node.addEventListener(animationEvent, endListener)
    }
  }

  show = () => {
    this.setState({
      hidden: false
    })
  }

  hide = function () {
    this.addAnimationListener(this.refs._backdrop, this.hidden)
    this.setState({
      willHidden: true
    })
  }.bind(this)

  hidden = function () {
    this.setState({
      hidden: true,
      willHidden: false
    })
  }.bind(this)

  render = () => {
    let modal
    if (!this.state.hidden) {
      modal = <span className={this.state.willHidden ? 'willHidden' : ''}>
        <div ref='_backdrop' className='backdrop' onClick={this.hide} />
        <div ref='_modal' className='modal'>
          <div className='modal-container'>
            { this.props.children }
          </div>
        </div>
      </span>
    }
    return (
      <span>
        { modal }
      </span>
    )
  }
}

Modal.propTypes = {
  children : PropTypes.node.isRequired
}

export default Modal
