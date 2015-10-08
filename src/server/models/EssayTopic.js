import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  topic: String,
  descripition: String,
});

export default mongoose.model('EssayTopic', schema);
