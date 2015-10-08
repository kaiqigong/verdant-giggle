import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  name: {
    type: String,
    unique: true,
  },
  country: String,
  location: {
    streetAddress: String,
    apartmentNo: String,
    district: String,
    city: String,
    province: String,
    zipcode: String,
  },
  tel: String,
});

export default mongoose.model('College', schema);
