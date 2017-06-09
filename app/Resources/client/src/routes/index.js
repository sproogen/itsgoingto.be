import CoreLayout from '../layouts/PageLayout/PageLayout'
import AskRoute from './Ask'
import AnswerRoute from './Answer'

export const createRoutes = (store) => ({
  path        : '/react',
  component   : CoreLayout,
  indexRoute  : AskRoute(store),
  childRoutes : [
    AnswerRoute(store)
  ]
})

export default createRoutes
