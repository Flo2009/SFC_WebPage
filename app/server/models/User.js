const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt'); // Added bcrypt import for model-level safety

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
      lowercase: true, // Forces automatic lowercase normalization inside MongoDB fields
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
    currentChallenge: { type: String }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps for your admin users
  }
);

// 🚀 THE BULLETPROOF ENCRYPTION SHIELD FIX:
// Automatically salt and hash passwords cleanly in a single pass before writing to MongoDB!
userSchema.pre('save', async function (next) {
  // If the password field hasn't been modified or created fresh, skip hashing entirely
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10; // Employs industry-standard work factor encryption rounds
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

const User = model('User', userSchema);

module.exports = User;

