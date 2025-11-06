const db = require('../config/database');

const getOccupancyReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        ps.type,
        COUNT(*) as total_spaces,
        SUM(CASE WHEN ps.status = 'AVAILABLE' THEN 1 ELSE 0 END) as available_spaces,
        SUM(CASE WHEN ps.status = 'OCCUPIED' THEN 1 ELSE 0 END) as occupied_spaces,
        SUM(CASE WHEN ps.status = 'RESERVED' THEN 1 ELSE 0 END) as reserved_spaces,
        ROUND(
          (SUM(CASE WHEN ps.status IN ('OCCUPIED', 'RESERVED') THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
          2
        ) as occupancy_rate
      FROM parking_spaces ps
      GROUP BY ps.type
    `;
    
    const [rows] = await db.query(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating occupancy report',
      error: error.message
    });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(p.created_at) as date,
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_payments
      FROM payments p
      WHERE p.status = 'PAID'
      GROUP BY DATE(p.created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const [rows] = await db.query(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating revenue report',
      error: error.message
    });
  }
};

const getUsageReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        ps.type,
        COUNT(b.id) as total_bookings,
        AVG(TIMESTAMPDIFF(HOUR, b.start_time, b.end_time)) as avg_duration_hours
      FROM bookings b
      JOIN parking_spaces ps ON b.space_id = ps.id
      WHERE b.status = 'COMPLETED'
      GROUP BY ps.type
    `;
    
    const [rows] = await db.query(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating usage report',
      error: error.message
    });
  }
};

const getDailyReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(b.created_at) as date,
        COUNT(b.id) as total_bookings,
        COUNT(DISTINCT b.user_id) as unique_users,
        SUM(p.amount) as total_revenue
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'PAID'
      GROUP BY DATE(b.created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const [rows] = await db.query(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating daily report',
      error: error.message
    });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        YEAR(b.created_at) as year,
        MONTH(b.created_at) as month,
        COUNT(b.id) as total_bookings,
        COUNT(DISTINCT b.user_id) as unique_users,
        SUM(p.amount) as total_revenue
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'PAID'
      GROUP BY YEAR(b.created_at), MONTH(b.created_at)
      ORDER BY year DESC, month DESC
      LIMIT 12
    `;
    
    const [rows] = await db.query(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating monthly report',
      error: error.message
    });
  }
};

module.exports = {
  getOccupancyReport,
  getRevenueReport,
  getUsageReport,
  getDailyReport,
  getMonthlyReport
};