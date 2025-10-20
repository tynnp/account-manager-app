const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
  label: { type: String, default: 'Mật khẩu' },
  value: { type: String, required: true }
}, { _id: false });

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  category: { type: String, default: 'other' },
  passwords: { type: [PasswordSchema], default: [] },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', AccountSchema);
