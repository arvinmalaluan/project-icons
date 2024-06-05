const services = require("../services/sql.services");
const formatter = require("../../Helpers/textFormatter");
const errorHandling = require("../../Helpers/errorHandling");
const pool = require("../../Config/db.conn");

module.exports = {
  getStartupInfo: (req, res) => {
    const query_variables = {
      table_name: "tbl_startup_info",
      fields: "id, title,name, description, link, profile_fkid",
      condition: `profile_fkid = ${req.params.id}`,
    };

    services.get_w_condition(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched Successfully",
          results: results,
        });
      }
    });
  },

  getStartupInfoByAccountFkid: (req, res) => {
    const query = `
        SELECT 
            tbl_startup_info.id, 
            tbl_startup_info.title, 
            tbl_startup_info.name, 
            tbl_startup_info.description, 
            tbl_startup_info.link, 
            tbl_startup_info.profile_fkid
        FROM 
            tbl_startup_info
        LEFT JOIN 
            tbl_profile ON tbl_startup_info.profile_fkid = tbl_profile.id
        LEFT JOIN 
            tbl_account ON tbl_profile.account_fkid = tbl_account.id
        WHERE 
            tbl_account.id = ?`; // Use parameterized query

    console.log("SQL Query:", query); // Add console log here

    pool.query(query, [req.params.id], (error, results) => {
      if (error) {
        console.error("Error fetching startup info:", error); // Add console error here
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
          error: error,
        });
      }

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched Successfully",
          results: results,
        });
      } else {
        console.warn("No startup info found for account ID:", req.params.id); // Add console warn here
        return res.status(404).json({
          success: 0,
          message: "No records found",
        });
      }
    });
  },

  getSpecificStartupInfo: (req, res) => {
    const query_variables = {
      table_name: "tbl_startup_info",
      fields: "id, title,name, description, link, profile_fkid",
      condition: `id = ${req.params.id}`,
    };

    services.get_w_condition(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched Successfully",
          results: results,
        });
      }
    });
  },

  createStartupInfo: (req, res) => {
    const query_variables = {
      table_name: "tbl_startup_info",
      fields: Object.keys(req.body),
      values: formatter.parseValues(Object.values(req.body)),
    };

    services.post_(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(201).json({
          success: 1,
          message: "Created Successfully",
          results: results,
        });
      }
    });
  },

  deleteStartupInfo: (req, res) => {
    console.log("1");
    const query_variables = {
      table_name: "tbl_startup_info",
      fields: "id, title,name, description, link, profile_fkid",
      condition: `${req.params.condition}`,
    };

    services.delete_all(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched Successfully",
          results: results,
        });
      }
    });
  },

  updateStartupInfo: (req, res) => {
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_startup_info",
      id: req.params.id,
    };

    services.patch_(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Updated Successfully",
          results: results,
        });
      }
    });
  },
};
