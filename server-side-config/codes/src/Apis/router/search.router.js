const express = require('express');
const { search } = require('../controller/search.controller');
const path = require('path');

const router = express.Router();


router.get('/', search);

router.get('/results', (req, res) => {
    
    res.sendFile(path.join(__dirname, '../../../../../client-side-config/users/src/search-results.html'));
});

router.get('/other', (req, res) => {
    
    res.sendFile(path.join(__dirname, '../../../../../client-side-config/users/src/other_profile.html'));
});


module.exports = router;

