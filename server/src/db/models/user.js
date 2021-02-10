import { Model, DataTypes } from 'sequelize'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const user = (sequelize) => {
  class User extends Model {
    set password(password) {
      this.salt = crypto.randomBytes(16).toString('hex')
      this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    }

    validatePassword(password) {
      const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
      return this.hash === hash
    }

    generateJWT() {
      return jwt.sign(
        {
          username: this.username,
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },
        process.env.JWT_PASSPHRASE
      )
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    sequelize
  })
  return User
}

export default user
