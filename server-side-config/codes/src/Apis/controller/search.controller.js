const pool = require('../../Config/db.conn');

exports.search = async (req, res) => {
  const { keyword } = req.query;

  try {
    const userResults = await searchUsers(keyword);
    const postResults = await searchPosts(keyword);
    res.json({ users: userResults, posts: postResults });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to search for users
async function searchUsers(keyword) {
  const userQuery = `SELECT * FROM tbl_account WHERE username LIKE ?`;
  const userKeyword = `${keyword}%`;

  return new Promise((resolve, reject) => {
    pool.query(userQuery, [userKeyword], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to search for posts
async function searchPosts(keyword) {
  const postQuery = `SELECT * FROM tbl_community_post WHERE title LIKE ? OR content LIKE ?`;
  const postKeyword = `${keyword}%`;

  return new Promise((resolve, reject) => {
    pool.query(postQuery, [postKeyword, postKeyword], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

