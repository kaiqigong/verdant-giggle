import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';

const {ObjectId} = Schema.Types;
const schema = BaseSchema.extend({
  author: {
    type: ObjectId,
    ref: 'User',
    unique: true, // 一个用户只能选择一次考试
  },
  session: {
    type: ObjectId,
    ref: 'EssaySession',
  },
  topic: {
    type: ObjectId,
    ref: 'EssayTopic',
  },
  answer: String,
  viewers: [{
    type: ObjectId,
    ref: 'User',
  }],
  score: [{ // todo: multiple viewers have multiple scores?
    viewer: {
      type: ObjectId,
      ref: 'User',
    },
    value: Number, // 1~5
  }],
});

export default mongoose.model('Essay', schema);
