// helperFunctions.js

const pool = require('../../Config/db.conn');

// Function to verify reset token and retrieve associated email
async function verifyResetToken(token) {
  const tokenQuery = 'SELECT email FROM password_reset_tokens WHERE token = ? AND expiration > NOW()';
  return new Promise((resolve, reject) => {
    pool.query(tokenQuery, [token], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve({ email: null });
        } else {
          resolve({ email: results[0].email });
        }
      }
    });
  });
}

// Function to update user password in the database
async function updateUserPassword(email, hashedPassword) {
  const updateQuery = 'UPDATE tbl_account SET password = ? WHERE email = ?';
  return new Promise((resolve, reject) => {
    pool.query(updateQuery, [hashedPassword, email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.affectedRows > 0);
      }
    });
  });
}

module.exports = { verifyResetToken, updateUserPassword };
