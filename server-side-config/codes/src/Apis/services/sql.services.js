const db_conn = require("../../Config/db.conn");

module.exports = {
  get_all: (query_variables, callback) => {
    db_conn.query(
      `SELECT ${query_variables.fields} FROM ${query_variables.table_name} `,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },

  get_w_condition: (query_variables, callback) => {
    console.log(query_variables.condition);
    db_conn.query(
      `SELECT ${query_variables.fields} FROM ${query_variables.table_name} WHERE ${query_variables.condition}`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        console.log(results);
        return callback(null, results);
      }
    );
  },

  post_: (query_variables, callBack) => {
    db_conn.query(
      `INSERT INTO ${query_variables.table_name}(${query_variables.fields}) VALUES (${query_variables.values})`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  patch_: (query_variables, callBack) => {
    db_conn.query(
      `UPDATE ${query_variables.table_name} SET ${query_variables.values} WHERE id = ${query_variables.id}`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  patchengage_: (query_variables, callBack) => {
    db_conn.query(
      `UPDATE ${query_variables.table_name} SET ${query_variables.values} WHERE community_post_fkid = ${query_variables.id} AND account_fkid = ${query_variables.id1}`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  delete_all: (query_variables, callBack) => {
    console.log(query_variables.condition);
    db_conn.query(
      `DELETE FROM ${query_variables.table_name} WHERE ${query_variables.condition}`,
      (error, results) => {
        if (error) {
          console.error("Error deleting from database:", error);
          return callBack(error); // Return the error to the caller
        }

        return callBack(null, results); // No error, return the results
      }
    );
  },

  delete_: (query_variables, callBack) => {
    db_conn.query(
      `DELETE FROM ${query_variables.table_name} WHERE community_post_fkid = ? AND account_fkid = ?`,
      [query_variables.id, query_variables.id1],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  get_community_posts_using_joins: (query_variables, callBack) => {
    db_conn.query(
      `
          SELECT
        post.id AS post_id,
        post.title,
        post.author,
        post.timestamp,
        post.image,
        post.content,
        profile.name AS author_name,
        profile.location AS author_location,
        profile.photo AS author_photo,
        profile.bio AS author_bio,
        account.email AS account_email,
        account.id AS user_id,
        (SELECT COUNT(*) FROM tbl_engagement WHERE community_post_fkid = post.id AND is_liked = 1) AS like_count,
        (SELECT COUNT(*) FROM tbl_engagement WHERE community_post_fkid = post.id AND is_disliked = 1) AS dislike_count,
        (SELECT COUNT(*) FROM tbl_comment WHERE community_post_fkid = post.id) AS comment_count
    FROM
        tbl_community_post AS post
    INNER JOIN
        tbl_profile AS profile ON post.profile_fkid = profile.id
    INNER JOIN
        tbl_account AS account ON post.account_fkid = account.id;


      `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  get_count_engagement: (query_variables, callBack) => {
    db_conn.query(
      `
      SELECT is_liked, is_disliked, COUNT(*) AS count
      FROM tbl_engagement
      WHERE ${query_variables.condition}
      GROUP BY is_liked, is_disliked;
      `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  get_community_posts_using_joins_with_condition: (
    query_variables,
    callBack
  ) => {
    db_conn.query(
      `
      SELECT
          post.id AS post_id,
          post.title,
          post.author,
          post.account_fkid,
          post.profile_fkid,
          post.timestamp,
          post.image,
          post.content,
          profile.name AS author_name,
          profile.photo AS author_photo,
          profile.location AS author_location,
          account.email AS account_email,
          (SELECT COUNT(*) FROM tbl_engagement WHERE community_post_fkid = post.id AND is_liked = 1) AS like_count,
          (SELECT COUNT(*) FROM tbl_engagement WHERE community_post_fkid = post.id AND is_disliked = 1) AS dislike_count,
          (SELECT COUNT(*) FROM tbl_comment WHERE community_post_fkid = post.id) AS comment_count
      FROM
          tbl_community_post AS post
      INNER JOIN
          tbl_profile AS profile ON post.profile_fkid = profile.id
      INNER JOIN
          tbl_account AS account ON post.account_fkid = account.id
      LEFT JOIN
          tbl_engagement AS engagement ON post.id = engagement.community_post_fkid
      LEFT JOIN
          tbl_comment AS comment ON post.id = comment.community_post_fkid
      GROUP BY
          post.id, post.title, post.author, post.content, profile.name, profile.photo, profile.location, engagement.is_liked, engagement.is_disliked
      HAVING ${query_variables.condition};
      `,
      [],
      (error, results, fields) => {
        if (error) {
          console.log(query_variables.condition);
          return callBack(error);
        } else {
          return callBack(null, results);
        }
      }
    );
  },

  get_tbl_of_users: (query_variables, callBack) => {
    db_conn.query(
      `SELECT 
            acc.email,
            acc.role_fkid,
            acc.status,
            acc.id,
            ls.login_time,
            prof.name
        FROM 
            tbl_account acc
        LEFT JOIN 
            tbl_login_session ls ON acc.id = ls.account_fkid
        LEFT JOIN 
            tbl_profile prof ON acc.id = prof.account_fkid;`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  get_tbl_of_users_w_condition: (query_variables, callBack) => {
    db_conn.query(
      `SELECT 
            acc.email,
            acc.role_fkid,
            acc.status,
            acc.username,
            acc.id,
            ls.login_time,
            prof.name,
            prof.photo
        FROM 
            tbl_account acc
        LEFT JOIN 
            tbl_login_session ls ON acc.id = ls.account_fkid
        LEFT JOIN 
            tbl_profile prof ON acc.id = prof.account_fkid
        WHERE 
            acc.id = ${query_variables.id}`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  get_comments_using_joins_with_condition: (query_variables, callBack) => {
    db_conn.query(
      `
          SELECT
        comment.id AS comment_id,
        comment.comment as comment_content,
        comment.timestamp AS comment_time,
        comment.image AS comment_image,
        profile.name AS profile_name,
        profile.photo AS profile_photo
    FROM
        tbl_comment AS comment
    INNER JOIN
        tbl_profile AS profile ON comment.profile_fkid = profile.id
    WHERE
        comment.${query_variables.condition}
    GROUP BY
        comment.id, comment.timestamp, comment.image, profile.name, profile.photo;

      `,
      [],
      (error, results, fields) => {
        if (error) {
          console.log(query_variables.condition);
          return callBack(error);
        } else {
          return callBack(null, results);
        }
      }
    );
  },

  delete_syntax: (query_variables, call_back) => {
    db_conn.query(
      `
      DELETE FROM ${query_variables.table_name}
      WHERE id = ${query_variables.id}`,
      [],
      (error, results, fields) => {
        if (error) {
          return call_back(error);
        }

        return call_back(null, results);
      }
    );
  },


  updatePassword: (userId, newPassword, callback) => {
    // Hash the new password
    bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
      if (error) {
        return callback(error);
      }
      // Update the user's password in the database
      db_conn.query(
        'UPDATE tbl_account SET password = ? WHERE id = ?',
        [hashedPassword, userId],
        (error, results) => {
          if (error) {
            return callback(error);
          }
          return callback(null, results);
        }
      );
    });
  },

  patch_: (query_variables, callBack) => {
    console.log('Query variables:', query_variables); // Log the query_variables object
    db_conn.query(
      `UPDATE ${query_variables.table_name} SET ${query_variables.values} WHERE id = ${query_variables.id}`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
},

};
