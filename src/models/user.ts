import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const UnauthorizedError = require('../errors/UnauthorizedError');

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    default: 'Jacques-Yves Cousteau',
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The minimum length of the "name" field is 30'],
  },
  about: {
    type: String,
    default: 'explorer',
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [200, 'The minimum length of the "name" field is 200'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => /^(https?:\/\/)(w{3}.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/.test(v),
      message: 'Incorrect URL',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Incorrect email',
    },
    required: [true, 'The "email" field must be filled in'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The "password" field must be filled in'],
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Incorrect email or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Incorrect email or password');
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
