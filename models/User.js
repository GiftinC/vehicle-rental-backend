import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
 
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',  
  }],

  totalSpent: {
    type: Number,
    default: 0,
  },

  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

// Hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash if password is modified

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  console.log('Password hashed in Schema:', this.password);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
