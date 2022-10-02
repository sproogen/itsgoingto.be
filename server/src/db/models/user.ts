import {
  Model, DataTypes, Sequelize, Optional, ModelCtor,
} from 'sequelize'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_PASSPHRASE = process.env.JWT_PASSPHRASE || ''

interface UserAttributes {
  id: string
  username: string
  salt: string
  hash: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'salt' | 'hash'> { } // eslint-disable-line

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  password?: string

  createdAt?: Date
  updatedAt?: Date
}

const generateHash = (password: string, salt: string): string => (
  crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
)

export const validatePassword = (user: UserInstance, password: string): boolean => (
  generateHash(password, user.salt) === user.hash
)

export const generateJWT = (user: UserInstance): string => jwt.sign(
  {
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  },
  JWT_PASSPHRASE,
)

const UserFactory = (sequelize: Sequelize): ModelCtor<UserInstance> => sequelize.define<UserInstance>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  },
  {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    setterMethods: {
      password(password) {
        const salt = crypto.randomBytes(16).toString('hex')
        this.setDataValue('salt', salt)
        this.setDataValue('hash', generateHash(password, salt))
      },
    },
  },
)

export default UserFactory
