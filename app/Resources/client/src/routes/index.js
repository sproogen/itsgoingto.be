import CoreLayout from 'layouts/PageLayout'
import askRoute from './Ask'
import answerRoute from './Answer'
import loginRoute from './Login'
import adminRoute from './Admin'
import notFoundRoute from './NotFound'
import catchAllRoute from './CatchAll'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : askRoute(store),
  childRoutes : [
    notFoundRoute(),
    loginRoute(),
    adminRoute(),
    answerRoute(store),
    catchAllRoute(),
  ]
})

export default createRoutes
