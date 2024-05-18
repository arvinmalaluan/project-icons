// Import the socket.io library
const io = require("socket.io-client");

// Connect to the socket server
const socket = io("http://localhost:3000");

const services = require("../services/sql.services");
const formatter = require("../../Helpers/textFormatter");
const computation = require("../../Helpers/computeValue");
const errorHandling = require("../../Helpers/errorHandling");
const pool = require('../../Config/db.conn');

const handleSocketMessage = () => {
  socket.on("messageFromServer", (data) => {
    console.log("Message received from server:", data);

    // Send a response to the frontend
    // Here you can send any data you want to the frontend
    // For example, you can send a success message
    // You can customize this message as per your requirement
    io.emit("messageToClient", { message: "Message received from server" });
  });
};

const handleView = (query_variables) => {
  services.patch_(query_variables, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: 0,
        message: "Encountered Error",
        results: error,
      });
    } else {
      return res.status(201).json({
        success: 1,
        message: "Created Successfully",
        results: results,
      });
    }
  });
};

module.exports = {
  startListeningToSocket: () => {
    handleSocketMessage();
  },

  getPost: (req, res) => {
    const queryVariables = {
      fields: "*",
      table_name: "tbl_community_post",
    };

    services.get_community_posts_using_joins(
      queryVariables,
      (error, results) => {
        errorHandling.check_results(res, error, results);

        if (results.length !== 0) {
          return res.status(200).json({
            success: 1,
            message: "Fetched successfully",
            data: results,
          });
        }
      }
    );
  },

  getPostWCondition: (req, res) => {
    const queryVariables = {
      condition: req.params.condition,
    };

    services.get_community_posts_using_joins_with_condition(
      queryVariables,
      (error, results) => {
        errorHandling.check_results(res, error, results);

        if (results.length != 0) {
          return res.status(200).json({
            success: 1,
            message: "Fetched successfully",
            data: results,
          });
        }
      }
    );
  },

  getSinglePost: (req, res) => {
    const postId = req.query.id;

    const query_variables = {
      fields: "title, content", // Fetch all fields for the post
      table_name: "tbl_community_post",
      condition: `id = ${postId}`, // Search by post ID
    };

    services.get_w_condition(query_variables, (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({
          success: 0,
          message: "Internal server error",
          error: error,
        });
      }

      console.log('SQL query:', query_variables); // Log the generated SQL query
      console.log('Query results:', results); // Log the query results

      if (results.length !== 0) {
        return res.status(200).json({
          success: 1,
          message: "Post fetched successfully",
          post: results[0],
        });
      } else {
        return res.status(404).json({
          success: 0,
          message: "Post not found",
        });
      }
    });
  },


  getUserPost: (req, res) => {
    const query = `
    SELECT 
    p.id, 
    p.title, 
    p.content,
    p.image,
    p.timestamp,
    pr.name AS author,
    p.views,
    pr.photo AS authorAvatar,
    COUNT(c.id) AS commentCount,
    SUM(CASE WHEN e.is_liked = 1 THEN 1 ELSE 0 END) AS likeCount,
    SUM(CASE WHEN e.is_disliked = 1 THEN 1 ELSE 0 END) AS dislikeCount,
    GROUP_CONCAT(DISTINCT liker.name) AS likers,
    GROUP_CONCAT(DISTINCT disliker.name) AS dislikers
FROM 
    tbl_community_post p
JOIN 
    tbl_profile pr ON p.profile_fkid = pr.id
LEFT JOIN 
    tbl_comment c ON p.id = c.community_post_fkid
LEFT JOIN 
    tbl_engagement e ON p.id = e.community_post_fkid
LEFT JOIN 
    tbl_profile liker ON e.profile_fkid = liker.id AND e.is_liked = 1
LEFT JOIN 
    tbl_profile disliker ON e.profile_fkid = disliker.id AND e.is_disliked = 1
WHERE 
    p.profile_fkid IN (
        SELECT 
            id 
        FROM 
            tbl_profile 
        WHERE 
            account_fkid = ?
    )
GROUP BY
    p.id, 
    p.title, 
    p.content,
    p.image,
    p.timestamp,
    pr.name,
    p.views,
    pr.photo;

    `;


    console.log("SQL Query:", query);

    pool.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error("Error fetching user posts:", error);
            return res.status(500).json({
                success: 0,
                message: "Internal Server Error",
                error: error
            });
        }

        if (results.length !== 0) {
          return res.status(200).json({
              success: 1,
              message: "Fetched Successfully",
              data: results,
          });
      } else {
          console.warn("No posts found for user ID:", req.params.id); // Use req.params.id here
          return res.status(404).json({
              success: 0,
              message: "No records found",
          });
      }
      
    });
},




  


  createPost: (req, res) => {
    const data = req.body;
    const query_variables = {
      table_name: "tbl_community_post",
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

  deletePost: (req, res) => {
    console.log("1");
    const query_variables = {
      table_name: "tbl_community_post",
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

  updatePost: (req, res) => {
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_community_post",
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

  // ! ------> Not yet working // Make this Count
  getEngagement: (req, res) => {
    const query_variables = {
      fields: "",
      table_name: "tbl_engagement",
      id: "",
    };
  },

  getLikeorDislike: (req, res) => {
    console.log("gumana");
    const queryVariables = {
      fields: "*",
      table_name: "tbl_engagement",
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

  getCountEngagement: (req, res) => {
    const queryVariables = {
      fields: "*",
      table_name: "tbl_engagement",
      condition: req.params.condition,
    };

    services.get_count_engagement(queryVariables, (error, results) => {
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

  createEngagement: (req, res) => {
    const query_variables = {
      table_name: "tbl_engagement",
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

  updateEngagement: (req, res) => {
    console.log("wow");
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_engagement",
      id: req.params.id,
      id1: req.params.id1,
    };

    services.patchengage_(query_variables, (error, results) => {
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

  deleteEngagement: (req, res) => {
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_engagement",
      id: req.params.id,
      id1: req.params.id1,
    };

    services.delete_(query_variables, (error, results) => {
      if (error) {
        // Handle database errors
        return res.status(500).json({
          success: 0,
          message: "Database error",
          error: error,
        });
      }

      if (results.affectedRows !== 0) {
        // Deletion successful
        return res.status(204).json({
          success: 1,
          message: "Engagement deleted successfully",
        });
      } else {
        // No engagement found with the given IDs
        return res.status(404).json({
          success: 0,
          message: "No engagement found with the given IDs",
        });
      }
    });
  },

  getComment: (req, res) => {
    const query_variables = {
      fields: "*",
      table_name: "tbl_comment",
      condition: req.params.id,
    };
    services.get_comments_using_joins_with_condition(
      query_variables,
      (error, results) => {
        errorHandling.check_results(res, error, results);

        if (results.length !== 0) {
          return res.status(200).json({
            success: 1,
            message: "Fetched successfully",
            data: results,
          });
        }
      }
    );
  },

  createComment: (req, res) => {
    const query_variables = {
      table_name: "tbl_comment",
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

  updateComment: (req, res) => {
    const query_variables = {
      values: formatter.formatUpdate(
        Object.keys(req.body),
        Object.values(req.body)
      ),
      table_name: "tbl_comment",
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

  deleteComment: (req, res) => {
    const query_variables = {
      table_name: "tbl_comment",
      fields: "*",
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

  // ! ------> Not yet working
  updateViewCount: (req, res) => {
    const queryVariables = {
      fields: "name",
      table_name: "testingtable",
      condition: `id = ${req.params.id}`,
    };

    services.get_w_condition(queryVariables, (error, results) => {
      errorHandling.check_results(res, error, results);

      const query_variables = {
        fields: results,
        values: computation.increaseCount(1, 2),
        table_name: "testingtable",
        id: req.params.id,
      };

      if (results.length !== 0) {
        handleView(query_variables);
      }
    });
  },
};
