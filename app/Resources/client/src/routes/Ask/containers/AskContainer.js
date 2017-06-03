import { connect } from 'react-redux'

import AskView from '../components/AskView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  question : state.question
})

export default connect(mapStateToProps, mapDispatchToProps)(AskView)
