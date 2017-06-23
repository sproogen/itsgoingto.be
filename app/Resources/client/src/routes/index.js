import CoreLayout from '../layouts/PageLayout/PageLayout'
import AskRoute from './Ask'
import AnswerRoute from './Answer'
import NotFoundRoute from './NotFound'
import CatchAllRoute from './CatchAll'

export const createRoutes = (store) => ({
  path        : '/react',
  component   : CoreLayout,
  indexRoute  : AskRoute(store),
  childRoutes : [
    NotFoundRoute(),
    AnswerRoute(store),
    CatchAllRoute(),
  ]
})

export default createRoutes
