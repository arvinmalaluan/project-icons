module.exports = {
  check_results: (res, error, results) => {
    if (error) {
      return res.status(500).json({
        success: 0,
        message: "Error occured",
        error: error,
      });
    }

    console.log(results.length === 0, results == "undefined", results);

    if (results.length === 0 || results == "undefined") {
      return res.status(404).json({
        success: 0,
        message: "No records found",
        data: [],
      });
    }
  },
};
