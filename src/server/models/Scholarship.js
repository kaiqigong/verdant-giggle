import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';

const {ObjectId} = Schema.Types;
const schema = BaseSchema.extend({
  name: {
    type: String,
    unique: true,
  },
  college: {
    type: ObjectId,
    ref: 'College',
  },
  descripition: String,
  type: {
    type: String,
  },
  capacity: Number,
  date: Date,
});

export default mongoose.model('Scholarship', schema);
