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


async function searchUsers(keyword) {
  const userQuery = `
    SELECT A.id, A.username, P.name, P.photo
    FROM tbl_account A
    LEFT JOIN tbl_profile P ON A.id = P.account_fkid
    WHERE P.name LIKE ? OR A.username LIKE ?`;
  const userKeyword = `${keyword}%`;

  return new Promise((resolve, reject) => {
    pool.query(userQuery, [userKeyword, userKeyword], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}



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

