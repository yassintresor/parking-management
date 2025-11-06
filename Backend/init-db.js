const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS parking_db');
    console.log('Database created or already exists');

    // Use the database
    await connection.query('USE parking_db');

    // Drop existing tables in correct order to avoid foreign key constraints
    const dropTables = [
      'DROP TABLE IF EXISTS audit_logs',
      'DROP TABLE IF EXISTS payments',
      'DROP TABLE IF EXISTS bookings',
      'DROP TABLE IF EXISTS vehicles',
      'DROP TABLE IF EXISTS pricing_rules',
      'DROP TABLE IF EXISTS parking_spaces',
      'DROP TABLE IF EXISTS users'
    ];

    for (const dropTable of dropTables) {
      await connection.query(dropTable);
    }

    // Create tables with correct schema
    const createTables = [
      `CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role ENUM('ADMIN','OPERATOR','USER') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE parking_spaces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        space_number VARCHAR(50) UNIQUE NOT NULL,
        location VARCHAR(255),
        type ENUM('COMPACT','LARGE','HANDICAP','ELECTRIC') DEFAULT 'COMPACT',
        status ENUM('AVAILABLE','RESERVED','OCCUPIED','OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
        hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 1.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        license_plate VARCHAR(50) NOT NULL,
        make VARCHAR(100),
        model VARCHAR(100),
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        space_id INT NOT NULL,
        vehicle_id INT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        status ENUM('ACTIVE','CANCELLED','COMPLETED') DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (space_id) REFERENCES parking_spaces(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        INDEX (space_id, start_time, end_time, status)
      )`,
      `CREATE TABLE payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'RWF',
        method ENUM('CARD','MOBILE_WALLET','SUBSCRIPTION','CASH') DEFAULT 'MOBILE_WALLET',
        status ENUM('PENDING','PAID','REFUNDED','FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE pricing_rules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        space_type ENUM('COMPACT','LARGE','HANDICAP','ELECTRIC') NOT NULL,
        time_slot ENUM('PEAK','OFF_PEAK') NOT NULL,
        day_of_week TINYINT NOT NULL COMMENT '0=Sun...6=Sat',
        rate_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    ];

    for (const createTable of createTables) {
      await connection.query(createTable);
    }
    console.log('All tables created successfully');

    // Close connection
    await connection.end();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();