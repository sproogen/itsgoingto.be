import CoreLayout from 'layouts/PageLayout'
import askRoute from './Ask'
import answerRoute from './Answer'
import loginRoute from './Login'
import dashboardRoute from './Dashboard'
import notFoundRoute from './NotFound'
import catchAllRoute from './CatchAll'

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