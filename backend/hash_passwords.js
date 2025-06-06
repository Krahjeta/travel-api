const mysql = require('mysql');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelagency"
});

function isHashed(pwd) {
  return typeof pwd === 'string' && pwd.startsWith('$2') && pwd.length === 60;
}

db.connect(async (err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database.");

  try {
    const users = await new Promise((resolve, reject) => {
      db.query("SELECT id, password FROM login", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    for (const user of users) {
      if (isHashed(user.password)) {
        console.log(`Skipping user id ${user.id} (already hashed)`);
        continue;
      }

      const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);

      await new Promise((resolve, reject) => {
        db.query("UPDATE login SET password = ? WHERE id = ?", [hashed, user.id], (err) => {
          if (err) reject(err);
          else {
            console.log(`✅ Hashed password for user id: ${user.id}`);
            resolve();
          }
        });
      });
    }

    console.log("🎉 All passwords hashed successfully.");
  } catch (error) {
    console.error("❌ Error hashing passwords:", error.message);
  } finally {
    db.end();
  }
});
