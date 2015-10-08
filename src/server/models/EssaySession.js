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
  beginTime: Date,
  endTime: Date,
  // will be updated every 5 seconds during writing time
  // should be cached in redis with key: sessionId, value: draftEassy
  draftEassy: {
    topic: {
      type: ObjectId,
      ref: 'EssayTopic',
    },
    answer: String,
  },
});

export default mongoose.model('EssaySession', schema);
