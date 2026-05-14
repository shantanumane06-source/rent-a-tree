const db = require('./src/config/db');
async function run() {
  await db.query(`UPDATE admins SET password = ? WHERE email = ?`, ['$2a$10$Btu/3rQ1amHAtehJS9Tq9.LWlD0cIWb4iBG7YSA0cnRqHeIjIZMZ.', 'admin@rentAtree.com']);
  await db.query(`UPDATE farmers SET password = ? WHERE email = ?`, ['$2a$10$Pb2PcIZTHJrsc3rFC7nS/eswkMs5q95upbJfBmNTfFVFxIyoITFf6', 'farmer@test.com']);
  await db.query(`UPDATE customers SET password = ? WHERE email = ?`, ['$2a$10$XAXR7xrkErMoKsaqj7QqDObFP4WHAA6H5s457NAGPp5p7cBUafa92', 'customer@test.com']);
  console.log("Updated");
  process.exit(0);
}
run();
