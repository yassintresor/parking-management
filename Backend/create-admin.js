const bcrypt = require('bcrypt');
const db = require('./src/config/database');

const createAdminUser = async () => {
  try {
    // Default admin credentials
    const email = 'admin@example.com';
    const password = 'Admin123!';
    const name = 'Administrator';
    const phone = '+1234567890';
    const role = 'ADMIN';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the admin user into the database
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, role]
    );

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', result.insertId);

    // Close the database connection
    await db.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdminUser();