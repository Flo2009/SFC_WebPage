const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: [/.+@.+\..+/, 'Must use a valid email address'] 
    },
    password: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String 
    },
    donationAmount: [
      {
        type: Number
      }
    ],
    donated: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { 
      virtuals: true 
    },
    id: false
  }
);

// Virtual property to support tracking arrays if needed
userSchema.virtual('stationCount').get(function () {
  return this.donationAmount ? this.donationAmount.length : 0;
});

const User = model('User', userSchema);
module.exports = User;
