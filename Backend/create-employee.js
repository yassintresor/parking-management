const bcrypt = require('bcrypt');
const db = require('./src/config/database');

const createEmployeeUser = async () => {
  try {
    // Default employee credentials
    const email = 'employee@example.com';
    const password = 'Employee123!';
    const name = 'Employee User';
    const phone = '+1987654321';
    const role = 'OPERATOR';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the employee user into the database
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, role]
    );

    console.log('Employee user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', result.insertId);

    // Close the database connection
    await db.end();
  } catch (error) {
    console.error('Error creating employee user:', error);
  }
};

createEmployeeUser();