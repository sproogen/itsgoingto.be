import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import PropTypes from 'prop-types'
import { Cookies } from 'react-cookie'
import Footer from 'components/footer'
import Loader from 'components/loader'
import AdminNavigation from 'components/admin-navigation'
import Ask from 'routes/ask'
import Answer from 'routes/answer'
import Login from 'routes/login'
import Dashboard from 'routes/dashboard'
import NotFound from 'routes/not-found'
import './app.scss'

const App = ({ isLoading, cookies, updateUserWithToken }) => {
  const token = cookies.get('itsgoingtobeUserToken')
  if (token) {
    updateUserWithToken(token)
  }

  return (
    <Router>
      <div style={{ height: '100%' }}>
        <div className="container">
          <Loader isLoading={isLoading} />
          <div className="page-layout__viewport">
            <AdminNavigation />
            <Switch>
              <Route exact path="/" component={Ask} />
              <Route exact path="/404" component={NotFound} />
              <Route path="/login" component={Login} />
              <Route path="/admin" component={Dashboard} />
              <Route path="/:identifier" component={Answer} />
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

export default App
