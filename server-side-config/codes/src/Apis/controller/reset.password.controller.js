const pool = require('../../Config/db.conn');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.forgotPassword = async (req, res) => {
  const email = req.body.email; 

  try {
    console.log('Fetching user with email:', email);
    const user = await getUserByEmail(email);
    console.log('User found:', user);
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const username = user.username;

    
    const token = generateResetToken();

    
    const expirationTimeInMinutes = 5;
    const expirationTimestamp = Date.now() + expirationTimeInMinutes * 60 * 1000;

    console.log('Expiration Timestamp Forgot Password:', expirationTimestamp);


    
    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/https/reset.html/reset.html?username=${username}&email=${email}&token=${token}&expires=${expirationTimestamp}`;

    const resetEmail = {
      from: 'the-icons-no-reply@gmail.com',
      to: email,
      subject: 'ICONS Password Reset Request',
      html: `
        <html>
          <body style="text-align: center; background-color: #f5f5f5; border-radius: 1.5rem; padding: 10px;">
            <h2>Hello ${username},</h2>
            <img src="../../../../../client-side-config/users/img/logo2.png" alt="The ICONS Logo" style="width: 150px; height: auto;">
            <p style="color: #000;">You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p style="color: #000;">Please click the button below to reset your password. This link will expire in ${expirationTimeInMinutes} minutes.</p>
            <a href="${resetLink}" style="display: inline-block; padding: 8px 16px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 1.5rem; font-size: 14px;">Reset Password</a>
            <p style="color: #000;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p style="font-weight: bold; font-size: 1.2rem;">The ICONS team</p>
          </body>
        </html>
      `
    };
  
    try {
      await sendEmail(resetEmail);
      return res.status(200).json({ message: 'Reset email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword; 
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message); 
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword, email } = req.body; 

  try {
    
    if (!token || !newPassword || !email) { 
      return res.status(400).json({ message: 'Token, email, and new password are required' });
    }

    
    const hashedPassword = await hashPassword(newPassword);
    console.log('Hashed Password:', hashedPassword); 

    
    const updateResult = await updateUserPasswordByEmail(email, hashedPassword);
    if (!updateResult) {
      console.error('Failed to update password in the database');
      return res.status(500).json({ message: 'Failed to update password' });
    }

    console.log('Password updated successfully');
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

async function updateUserPasswordByEmail(email, hashedPassword) {
  const updateQuery = 'UPDATE tbl_account SET password = ? WHERE email = ?';
  return new Promise((resolve, reject) => {
    
    pool.query(updateQuery, [hashedPassword, email], (err, results) => {
      if (err) {
        
        reject(err);
      } else {
        
        console.log('Update Result:', results);
        console.log('Email:', email);
        resolve(results.affectedRows > 0); 
      }
    });
  });
}

function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

async function getUserByEmail(email) {
  const userQuery = 'SELECT * FROM tbl_account WHERE email = ?';
  return new Promise((resolve, reject) => {
    pool.query(userQuery, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log('Results:', results);
        console.log('Email:', email);
        resolve(results[0]);
      }
    });
  });
}

async function sendEmail(emailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aacceex@gmail.com', 
      pass: 'lvyaogbwnbzmfjxz' 
    }
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
