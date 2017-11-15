import CoreLayout from 'layouts/PageLayout'
import askRoute from './Ask'
import answerRoute from './Answer'
import notFoundRoute from './NotFound'
import catchAllRoute from './CatchAll'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : askRoute(store),
  childRoutes : [
    notFoundRoute(),
    answerRoute(store),
    catchAllRoute(),
  ]
})

export default createRoutes
