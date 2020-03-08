import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withCookies, Cookies } from 'react-cookie'
import { isLoadingSelector } from 'store/loader/selectors'
import { updateUser } from 'store/user/actions'
import Footer from 'components/footer'
import Loader from 'components/loader'
import AdminNavigation from 'components/admin-navigation'
import Ask from 'routes/ask'
import Answer from 'routes/answer'
import NotFound from 'routes/not-found'
import './app.scss'

const App = ({ isLoading, cookies, updateUserWithToken }) => {
  useEffect(() => {
    const token = cookies.get('itsgoingtobeUserToken')

    if (token) {
      updateUserWithToken(token)
    }
  }, [])

  return (
    <Router>
      <div style={{ height: '100%' }}>
        <div className="container">
          <Loader isLoading={isLoading} />
          <div className="page-layout__viewport">
            <AdminNavigation />
            <Switch>
              <Route exact path="/"><Ask /></Route>
              <Route exact path="/404"><NotFound /></Route>
              <Route path="/:identifier"><Answer /></Route>
              <Route path="*"><Redirect to="/404" /></Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

App.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUserWithToken: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  isLoading: isLoadingSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  updateUserWithToken: (token) => dispatch(updateUser({ token })),
})

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(App))
