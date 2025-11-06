const db = require('../config/database');

class Vehicle {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM vehicles');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create({ user_id, license_plate, make, model, color }) {
    try {
      const [result] = await db.query(
        'INSERT INTO vehicles (user_id, license_plate, make, model, color) VALUES (?, ?, ?, ?, ?)',
        [user_id, license_plate, make, model, color]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { license_plate, make, model, color }) {
    try {
      const [result] = await db.query(
        'UPDATE vehicles SET license_plate = ?, make = ?, model = ?, color = ? WHERE id = ?',
        [license_plate, make, model, color, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(user_id) {
    try {
      const [rows] = await db.query('SELECT * FROM vehicles WHERE user_id = ?', [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vehicle;