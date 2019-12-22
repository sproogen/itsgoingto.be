import Sequelize from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

if(process.env.NODE_ENV === 'development')
sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

export default sequelize
