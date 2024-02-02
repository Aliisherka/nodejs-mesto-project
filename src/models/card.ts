import mongoose from 'mongoose';
import validator from 'validator';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The minimum length of the "name" field is 30'],
  },
  link: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Incorrect URL',
    },
    required: [true, 'The "link" field must be filled in'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'The "owner" field must be filled in'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

export default mongoose.model('card', cardSchema);
