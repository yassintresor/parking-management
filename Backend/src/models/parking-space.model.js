const db = require('../config/database');

class ParkingSpace {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM parking_spaces');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM parking_spaces WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create({ space_number, location, type, hourly_rate }) {
    try {
      const [result] = await db.query(
        'INSERT INTO parking_spaces (space_number, location, type, hourly_rate) VALUES (?, ?, ?, ?)',
        [space_number, location, type, hourly_rate]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { space_number, location, type, hourly_rate }) {
    try {
      const [result] = await db.query(
        'UPDATE parking_spaces SET space_number = ?, location = ?, type = ?, hourly_rate = ? WHERE id = ?',
        [space_number, location, type, hourly_rate, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM parking_spaces WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findAvailable() {
    try {
      const [rows] = await db.query('SELECT * FROM parking_spaces WHERE status = "AVAILABLE"');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE parking_spaces SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ParkingSpace;