import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pollSelector } from 'store/poll'
import OptionsModal from 'routes/ask/components/options-modal/options-modal'

class OptionsModalWrapper extends React.Component {
  show = () => {
    this._modal.getWrappedInstance().show()
  }

  render () {
    const { poll } = this.props

    return (
      <OptionsModal ref={(component) => { this._modal = component }} poll={poll} />
    )
  }
}

OptionsModalWrapper.propTypes = {
  poll : PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  poll : pollSelector(state)
})

export default connect(mapStateToProps, null, null, { withRef: true })(OptionsModalWrapper)
