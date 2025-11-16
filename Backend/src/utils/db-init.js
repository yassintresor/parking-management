const db = require('../config/database');

const initializeTables = async () => {
  try {
    console.log('Checking and initializing database tables...');
    
    // Check if users table exists, create if not
    try {
      await db.query('DESCRIBE users');
      console.log('Users table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            role ENUM('ADMIN','OPERATOR','USER') DEFAULT 'USER',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Users table created');
      } else {
        throw error;
      }
    }

    // Check if parking_spaces table exists, create if not
    try {
      await db.query('DESCRIBE parking_spaces');
      console.log('Parking spaces table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE parking_spaces (
            id INT AUTO_INCREMENT PRIMARY KEY,
            space_number VARCHAR(50) UNIQUE NOT NULL,
            location VARCHAR(255),
            type ENUM('COMPACT','LARGE','HANDICAP','ELECTRIC') DEFAULT 'COMPACT',
            status ENUM('AVAILABLE','RESERVED','OCCUPIED','OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
            hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 1.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Parking spaces table created');
      } else {
        throw error;
      }
    }

    // Check if vehicles table exists, create if not
    try {
      await db.query('DESCRIBE vehicles');
      console.log('Vehicles table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            license_plate VARCHAR(50) NOT NULL,
            make VARCHAR(100),
            model VARCHAR(100),
            color VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `);
        console.log('Vehicles table created');
      } else {
        throw error;
      }
    }

    // Check if bookings table exists, create if not
    try {
      await db.query('DESCRIBE bookings');
      console.log('Bookings table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE bookings (
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
          )
        `);
        console.log('Bookings table created');
      } else {
        throw error;
      }
    }

    // Check if payments table exists, create if not
    try {
      await db.query('DESCRIBE payments');
      console.log('Payments table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE payments (
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
          )
        `);
        console.log('Payments table created');
      } else {
        throw error;
      }
    }

    // Check if pricing_rules table exists, create if not
    try {
      await db.query('DESCRIBE pricing_rules');
      console.log('Pricing rules table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE pricing_rules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            space_type ENUM('COMPACT','LARGE','HANDICAP','ELECTRIC') NOT NULL,
            time_slot ENUM('PEAK','OFF_PEAK') NOT NULL,
            day_of_week TINYINT NOT NULL COMMENT '0=Sun...6=Sat',
            rate_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Pricing rules table created');
      } else {
        throw error;
      }
    }

    // Check if audit_logs table exists, create if not
    try {
      await db.query('DESCRIBE audit_logs');
      console.log('Audit logs table already exists');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(`
          CREATE TABLE audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            action VARCHAR(100) NOT NULL,
            resource_type VARCHAR(100) NOT NULL,
            resource_id INT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `);
        console.log('Audit logs table created');
      } else {
        throw error;
      }
    }

    console.log('Database table initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
};

module.exports = { initializeTables };