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
    passkeys: [
      {
        credentialID: { type: String, required: true },
        credentialPublicKey: { type: String, required: true }, // Saved as base64 string
        counter: { type: Number, default: 0 },
        transports: [{ type: String }]
      }
    ],
    currentChallenge: { 
      type: String 
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps for your admin users
  }
);

const User = model('User', userSchema);
module.exports = User;
