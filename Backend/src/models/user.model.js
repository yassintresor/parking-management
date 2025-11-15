const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, name, phone, role = 'USER' }) {
    try {
      console.log('Creating user in database with data:', { email, password: '****', name, phone, role });
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, phone, role]
      );
      console.log('User inserted with result:', result);
      return result.insertId;
    } catch (error) {
      console.error('Database error during user creation:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id, email, name, phone, role, created_at FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { name, phone, role }) {
    try {
      const [result] = await db.query(
        'UPDATE users SET name = ?, phone = ?, role = ? WHERE id = ?',
        [name, phone, role, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;