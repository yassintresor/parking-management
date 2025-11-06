const db = require('../config/database');

class Booking {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT b.*, 
               u.name as user_name, 
               u.email as user_email,
               ps.space_number,
               v.license_plate
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN parking_spaces ps ON b.space_id = ps.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT b.*, 
               u.name as user_name, 
               u.email as user_email,
               ps.space_number,
               v.license_plate
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN parking_spaces ps ON b.space_id = ps.id
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create({ user_id, space_id, vehicle_id, start_time, end_time }) {
    try {
      const [result] = await db.query(
        'INSERT INTO bookings (user_id, space_id, vehicle_id, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [user_id, space_id, vehicle_id, start_time, end_time]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { start_time, end_time }) {
    try {
      const [result] = await db.query(
        'UPDATE bookings SET start_time = ?, end_time = ? WHERE id = ?',
        [start_time, end_time, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(user_id) {
    try {
      const [rows] = await db.query(`
        SELECT b.*, 
               ps.space_number,
               ps.location,
               ps.type as space_type,
               v.license_plate
        FROM bookings b
        JOIN parking_spaces ps ON b.space_id = ps.id
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `, [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;