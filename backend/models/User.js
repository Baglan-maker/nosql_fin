const mongoose = require('mongoose');

// Схема для адреса (вложенный документ)
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, 
  role: { 
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  addresses: [addressSchema],  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
