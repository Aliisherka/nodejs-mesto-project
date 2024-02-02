import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The minimum length of the "name" field is 30'],
  },
  about: {
    type: String,
    required: [true, 'The "about" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [200, 'The minimum length of the "name" field is 200'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Incorrect URL',
    },
    required: [true, 'The "avatar" field must be filled in'],
  },
}, { versionKey: false });

export default mongoose.model('user', userSchema);
