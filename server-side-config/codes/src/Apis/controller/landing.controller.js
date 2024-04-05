const services = require("../services/sql.services");
const formatter = require("../../Helpers/textFormatter");
const errorHandling = require("../../Helpers/errorHandling");

module.exports = {
  createQuery: (req, res) => {
    const query_variables = {
      table_name: "tbl_queries",
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

  getSpecificHomeContent: (req, res) => {
    const queryVariables = {
      fields: "*",
      table_name: "tbl_home_content",
      condition: req.params.condition,
    };

    services.get_w_condition(queryVariables, (error, results) => {
      errorHandling.check_results(res, error, results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched successfully",
          data: results,
        });
      }
    });
  },

  getGallery: (req, res) => {
    const query_variables = {
      table_name: "tbl_gallery",
      fields: "*",
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
