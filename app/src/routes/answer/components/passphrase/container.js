import { connect } from 'react-redux'
import { fetchPoll } from 'services/api'
import { updatePoll } from 'store/poll/actions'
import { setRequiresPassphrase } from 'store/loader/actions'

import Passphrase from './passphrase'

const mapDispatchToProps = (dispatch) => ({
  setPassphrase: (identifier, value) => dispatch(updatePoll({ identifier, passphrase: value })),
  fetchPoll: (identifier) => dispatch(fetchPoll(identifier)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value))
})

export default connect(null, mapDispatchToProps)(Passphrase)
