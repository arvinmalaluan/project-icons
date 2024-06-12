const services = require("../services/sql.services");
const formatter = require("../../Helpers/textFormatter");
const errorHandling = require("../../Helpers/errorHandling");

module.exports = {
  getAll: (req, res) => {
    const query_variables = {
      table_name: "tbl_newsletter",
      fields: "*",
    };

    services.get_all(query_variables, (error, results) => {
      errorHandling.check_results(res, error, results);

      console.log(results);

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Fetched Successfully",
          results: results,
        });
      }
    });
  },

  getSpecific: (req, res) => {
    const query_variables = {
      table_name: "tbl_newsletter",
      fields: "*",
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

  create: (req, res) => {
    const data = req.body;
    const query_variables = {
      table_name: "tbl_newsletter",
      fields: Object.keys(data),
      values: formatter.parseValues(Object.values(data)),
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

  update: (req, res) => {
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_newsletter",
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

  delete: (req, res) => {
    const query_variables = {
      id: req.params.id,
      table_name: req.params.table_name,
    };

    services.delete_syntax(query_variables, (error, results) => {
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
