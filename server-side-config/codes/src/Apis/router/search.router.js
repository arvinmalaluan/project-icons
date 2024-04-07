const express = require('express');
const { search } = require('../controller/search.controller');

const router = express.Router();

// Search users and posts
router.get('/', search);

module.exports = router;

