const services = require("../services/sql.services");
const formatter = require("../../Helpers/textFormatter");
const errorHandling = require("../../Helpers/errorHandling");

module.exports = {
  getUsers: (req, res) => {
    let query_variables;

    services.get_tbl_of_users(query_variables, (error, results) => {
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

  getArticles: (req, res) => {
    const query_variables = {
      fields: "*",
      table_name: "tbl_home_content",
      condition: "type = 'article'",
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

  getPrograms: (req, res) => {
    const query_variables = {
      fields: "*",
      table_name: "tbl_home_content",
      condition: "type = 'program'",
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

  getQueries: (req, res) => {
    const query_variables = {
      fields: "*",
      table_name: "tbl_queries",
    };

    services.get_all(query_variables, (error, results) => {
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
};
