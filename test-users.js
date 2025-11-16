const db = require('./Backend/src/config/database');

async function testUsers() {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    console.log('Existing users:', rows);
  } catch (error) {
    console.error('Error querying users:', error);
  } finally {
    process.exit(0);
  }
}

testUsers();