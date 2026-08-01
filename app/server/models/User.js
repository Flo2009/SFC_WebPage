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
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps for your admin users
  }
);

const User = model('User', userSchema);
module.exports = User;
