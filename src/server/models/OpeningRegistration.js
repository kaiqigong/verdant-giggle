import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';

const {ObjectId} = Schema.Types;
const schema = BaseSchema.extend({
  user: {
    type: ObjectId,
    ref: 'User',
    unique: true, // 一个用户只能选择一次考试
  },
  opening: {
    type: ObjectId,
    ref: 'Opening',
  },
});

export default mongoose.model('OpeningRegistration', schema);
