require("dotenv").config();
const nodemailer = require("nodemailer");
const userAuth = require("../../Helpers/userAuthentication");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const textFormatter = require("../../Helpers/textFormatter");
const services = require("../services/sql.services");
const errorHandling = require("../../Helpers/errorHandling");



async function sendVerificationEmail(email, verificationToken, protocol, host, userId) {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aacceex@gmail.com', 
      pass: 'lvyaogbwnbzmfjxz' 
    }
  });

  const verificationLink = `${protocol}://${host}/api/v1/https/verify/verify_email.html?token=${verificationToken}&userId=${userId}`;
  const mailOptions = {
    from: 'the-icons-no-reply@gmail.com',
    to: email,
    subject: 'ICONS Email Verification',
    html: `
      <html>
        <body style="text-align: center; background-color: #f5f5f5; border-radius: 1.5rem; padding: 10px;">
          <h2>Hello,</h2>
          <img src="#" alt="The ICONS Logo" style="width: 150px; height: auto;">
          <p style="color: #000;">You are receiving this because you (or someone else) have requested to verify your email address.</p>
          <p style="color: #000;">Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 8px 16px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 1.5rem; font-size: 14px;">Verify Email</a>
          <p style="color: #000;">If you did not request this, please ignore this email.</p>
          <p style="font-weight: bold; font-size: 1.2rem;">The ICONS Team</p>
        </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
}


function generateVerificationToken(userId) {

  console.log('User ID in payload:', userId);
  const payload = {userId}; 
  const secretKey = '2851ee5044db499aa595b93a79eb75af12050222c52df524bdca191519bbd93d2dee2a89fda68e6c166108c8bfd1aa09a759eab0ed9a270622c4e09f56cbb076'; // Replace 'your_secret_key' with your actual secret key

  // Sign the payload to generate the token
  const token = jwt.sign(payload, secretKey); 
  
  return token;
}


const token = "2851ee5044db499aa595b93a79eb75af12050222c52df524bdca191519bbd93d2dee2a89fda68e6c166108c8bfd1aa09a759eab0ed9a270622c4e09f56cbb076";

module.exports = {
  authSignup: async (req, res) => {
    try {
      const formatValues = {
        email: req.body.email,
        password: await userAuth.hashing(req.body.password),
        role_fkid: req.body.role_fkid,
        // recovery_email: req.body.recovery_email,
        username: req.body.username,
      };

      const queryVariables = {
        fields: "email, password, role_fkid, username",
        table_name: "tbl_account",
        values: textFormatter
          .parseValues(Object.values(formatValues))
          .join(", "),
      };

      services.post_(queryVariables, async (error, results) => {
        if (error) {
          return res.status(500).json({
            success: 0,
            message: "Error occurred during signup",
            error: error.message,
          });
        }

        const verificationToken = generateVerificationToken(results.insertId);

        try {
          await sendVerificationEmail(req.body.email, verificationToken, req.protocol, req.get('host'), results.insertId);
        } catch (error) {
          console.error("Error sending verification email:", error);
          return res.status(500).json({
            success: 0,
            message: "Failed to send verification email",
            error: error.message,
          });
        }

        res.status(200).json({
          success: 1,
          message: "Signup successful. Verification email has been sent.",
          data: results,
          insertId: results.insertId,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Error occurred during signup",
        error: error.message,
      });
    }
  },

authSignin: async (req, res) => {
  try {
      const queryVariables = {
          fields: "id, username, email, isVerified, password, role_fkid",
          table_name: "tbl_account",
          condition: `username = '${req.body.email}'`,
      };

      services.get_w_condition(queryVariables, async (error, results) => {
          try {
              errorHandling.check_results(res, error, results);

              if (results.length !== 0) {
                  const response = await userAuth.signin(results, req.body);

                  // Include the isVerified status in the response
                  const { id, username, role_fkid, isVerified } = results[0];

                  if (response.auth !== "valid") {
                      return res.status(200).json({
                          success: 0,
                          message: response,
                      });
                  } else {
                      return res.status(200).json({
                          success: 1,
                          message: {
                              id,
                              auth: "valid",
                              username,
                              role: role_fkid,
                              isVerified // Include the isVerified status in the response
                          },
                      });
                  }
              }
          } catch (error) {
              console.error("Error occurred during sign in:", error);
              return res.status(500).json({
                  success: 0,
                  message: "Error occurred during sign in",
                  error: error.message,
              });
          }
      });
  } catch (error) {
      return res.status(500).json({
          success: 0,
          message: "Error occurred during sign in",
          error: error.message,
      });
    }
  },

  checkval: (req, res) => {
    const queryVariables = {
      fields: "*",
      table_name: "tbl_account",
      condition: req.params.condition,
    };

    services.get_exist(queryVariables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results[0].it_exists === 0) {
       
        return res.status(200).json({
          success: 1,
          message: "Fetched successfully",
          data: results,
        });
      } else {
        return res.status(204).json({
          success: 1,
          message: "No records found",
        });
      }
    });
  },

};