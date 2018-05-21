import CoreLayout from 'layouts/page-layout'
import askRoute from './ask'
import answerRoute from './answer'
import loginRoute from './login'
import dashboardRoute from './dashboard'
import notFoundRoute from './not-found'
import catchAllRoute from './catch-all'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : askRoute(store),
  childRoutes : [
    notFoundRoute(),
    loginRoute(),
    dashboardRoute(),
    answerRoute(store),
    catchAllRoute(),
  ]
})

export default createRoutes
