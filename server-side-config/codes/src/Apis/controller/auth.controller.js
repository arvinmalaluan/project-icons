require("dotenv").config();

const userAuth = require("../../Helpers/userAuthentication");
const jwt = require("jsonwebtoken");
const textFormatter = require("../../Helpers/textFormatter");
const services = require("../services/sql.services");
const errorHandling = require("../../Helpers/errorHandling");

module.exports = {
  authSignup: async (req, res) => {
    console.log(req.body.role_fkid);
    try {
      const formatValues = {
        email: req.body.email,
        password: await userAuth.hashing(req.body.password),
        role_fkid: req.body.role_fkid,
        recovery_email: req.body.recovery_email,
        username: req.body.username,
      };

      const queryVariables = {
        fields: "email, password, role_fkid, recovery_email, username",
        table_name: "tbl_account",
        values: textFormatter
          .parseValues(Object.values(formatValues))
          .join(", "),
      };

      // Call the post_ service function
      services.post_(queryVariables, (error, results) => {
        console.log(results);
        if (error) {
          // Handle error and send response
          return res.status(500).json({
            success: 0,
            message: "Error occurred during signup",
            error: error.message,
          });
        }

        // Handle success and send response
        res.status(200).json({
          success: 1,
          message: "Signup successful",
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
        fields: "id, username, email, password, role_fkid",
        table_name: "tbl_account",
        condition: `email = '${req.body.email}' OR username = '${req.body.email}'`,
      };

      try {
        services.get_w_condition(queryVariables, async (error, results) => {
          try {
            errorHandling.check_results(res, error, results);

            if (results.length !== 0) {
              const response = await userAuth.signin(results, req.body);
              console.log(response);
              if (response !== "valid") {
                return res.status(200).json({
                  success: 0,
                  message: response,
                });
              } else {
                return res.status(200).json({
                  success: 1,
                  message: response,
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
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Error occurred during sign in",
        error: error.message,
      });
    }
  },
};
