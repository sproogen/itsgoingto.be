import sequelize, { Poll, User } from './index'
import createStubData from './create-stub-data'

if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ force: true })
    .then(createStubData(Poll, User))
    .then(() => {
      console.log('Database & tables created!')
    })
}
