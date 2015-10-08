import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  startTime: Date, // 2015-11-09T10:00:00.000Z
  endTime: Date, // 2015-11-09T11:00:00.000Z
  registerType: String, // HS/noHS
  capacity: Number, // 1000
});

export default mongoose.model('Opening', schema);
