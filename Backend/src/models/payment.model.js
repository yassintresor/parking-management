const db = require('../config/database');

class Payment {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               u.name as user_name, 
               u.email as user_email,
               b.space_id
        FROM payments p
        JOIN users u ON p.user_id = u.id
        JOIN bookings b ON p.booking_id = b.id
        ORDER BY p.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               u.name as user_name, 
               u.email as user_email,
               b.space_id
        FROM payments p
        JOIN users u ON p.user_id = u.id
        JOIN bookings b ON p.booking_id = b.id
        WHERE p.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create({ booking_id, user_id, amount, currency, method }) {
    try {
      const [result] = await db.query(
        'INSERT INTO payments (booking_id, user_id, amount, currency, method) VALUES (?, ?, ?, ?, ?)',
        [booking_id, user_id, amount, currency, method]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(user_id) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               b.space_id
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `, [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE payments SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Payment;