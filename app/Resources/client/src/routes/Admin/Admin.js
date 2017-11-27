import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { hasUserSelector} from 'store/user'
import { setLoading } from 'store/loader'

class Admin extends React.Component {
  componentWillMount = () => {
    const { hasUser } = this.props

    if (!hasUser) {
      this.props.setLoading(true)
      browserHistory.push('/login') // TODO : Replace with 401 or home page
    } else {
      this.props.setLoading(false)
    }
  }

  render () {
    return (
      <div>
        <div className='container header-container'>
          <div className='header center-text'>
            <h1>Admin</h1>
          </div>
        </div>
      </div>
    )
  }
}

Admin.propTypes = {
  hasUser    : PropTypes.bool.isRequired,
  setLoading : PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => ({
  hasUser : hasUserSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  setLoading : (value) => dispatch(setLoading(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
