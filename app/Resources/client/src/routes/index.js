import CoreLayout from '../layouts/PageLayout/PageLayout'
import AskRoute from './Ask'

export const createRoutes = (store) => ({
  path        : '/react',
  component   : CoreLayout,
  indexRoute  : AskRoute(store),
  childRoutes : [
  ]
})

export default createRoutes
