import sequelize, { Poll, Response, User } from './index'
import createStubData from './create-stub-data'

if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ force: true })
    .then(createStubData(Poll, Response, User))
    .then(() => {
      console.log('Database & tables created!')
    })
}
