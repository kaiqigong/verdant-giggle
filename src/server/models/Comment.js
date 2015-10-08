import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';

const {ObjectId} = Schema.Types;
const schema = BaseSchema.extend({
  content: String,
  postBy: {
    type: ObjectId,
    ref: 'User',
  },
  type: {
    type: String, // Eassy
    required: true,
  },
  belongTo: { // Eassy id
    type: ObjectId,
    required: true,
  },
});

export default {
  Comment: mongoose.model('Comment', schema),
  EssayComment: mongoose.model('EssayComment', schema),
};
