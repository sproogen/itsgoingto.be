import { connect } from 'react-redux'
import { fetchPoll } from 'services/api'
import { updatePoll } from 'store/poll/actions'
import { setRequiresPassphrase } from 'store/loader/actions'

import Passphrase from './passphrase'

const mapDispatchToProps = (dispatch) => ({
  setPassphrase: (value, identifier) => dispatch(updatePoll({ passphrase: value, identifier })),
  fetchPoll: (identifier) => dispatch(fetchPoll(identifier)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value))
})

export default connect(null, mapDispatchToProps)(Passphrase)
