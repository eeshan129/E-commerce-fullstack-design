const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // Delete any existing admin to avoid duplicates
  await User.deleteOne({ email: 'admin@myshop.com' });

  await User.create({
    name: 'Admin',
    email: 'admin@myshop.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('✅ Admin created: admin@myshop.com / admin123');
  mongoose.connection.close();
}

createAdmin();