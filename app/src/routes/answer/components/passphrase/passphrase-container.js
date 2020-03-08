import { connect } from 'react-redux'
import { mergeAll } from 'ramda'
import { fetchPoll } from 'services/api'
import { updatePoll } from 'store/poll/actions'
import { setRequiresPassphrase } from 'store/loader/actions'

import Passphrase from './passphrase'

const mapDispatchToProps = (dispatch) => ({
  setPassphrase: (value, identifier) => dispatch(updatePoll({ passphrase : value, identifier })),
  fetchPoll: (identifier) => dispatch(fetchPoll(identifier)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(null, mapDispatchToProps, mergeProps)(Passphrase)
