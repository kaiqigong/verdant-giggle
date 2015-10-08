import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';

const {ObjectId} = Schema.Types;
const schema = BaseSchema.extend({
  payer: {
    type: ObjectId,
    ref: 'User',
  },
  confrimDate: Date,
  peymentInfo: { // 根据支付宝字段
    date: Date,
    amount: Number,
    method: String, // 交易方式，alipay
    transaction: String, // 交易号
  },
});

export default mongoose.model('Payment', schema);
