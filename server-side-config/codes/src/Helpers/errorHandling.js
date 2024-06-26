module.exports = {
  check_results: (res, error, results) => {
    if (error) {
      return res.status(500).json({
        success: 0,
        message: "Error occured",
        error: error,
      });
    }

    if (results.length === 0 || results == "undefined") {
      return res.status(200).json({
        success: 0,
        message: "No records found",
        data: [],
      });
    }
  },
};
