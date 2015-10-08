// app/models/User.js
// load the things we need
import bcrypt from 'bcrypt-nodejs';
import mongoose, {Schema} from 'mongoose';
import BaseSchema from './BaseSchema';
const {ObjectId} = Schema.Types;

// define the schema for our user model
const userSchema = BaseSchema.extend({
  local: {
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  roles: [String], // ADMIN, EDITOR, STUDENT
  registerType: String, // HS/noHS
  profile: {
    basicInfo: {
      lastName: String,
      firstName: String,
      dateOfBirth: Date,
      sex: Boolean,
      countryOfBirth: String,
      nationality: String,
    },
    permanentAddress: {
      streetAddress: String,
      apartmentNo: String,
      district: String,
      city: String,
      province: String,
      zipcode: String,
    },
    livingAddress: {
      streetAddress: String,
      apartmentNo: String,
      district: String,
      city: String,
      province: String,
      zipcode: String,
    },
    contacts: {
      email: String,
      phone: String,
      wechat: String,
      qq: String,
    },
    parents: [{
      wechat: String,
      relationship: String,
      phone: String,
      email: String,
      lastName: String,
      firstName: String,
    }],
    appliedScholarships: [{
      scholarship: {
        type: ObjectId,
        ref: 'Scholarship',
      },
    }],
  },
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
export default mongoose.model('User', userSchema);
