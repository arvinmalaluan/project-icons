const express = require('express');
const router = express.Router();
const path = require('path');
const { forgotPassword, resetPassword  } = require('../controller/reset.password.controller');

router.post('/forgot', forgotPassword);

router.post('/reset', resetPassword);

router.get('/reset.html', (req, res) => {

    const filePath = path.join(__dirname, '..', '..', '..', 'src', 'reset.html');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File sent successfully'); 
        }
    });
});


router.get('/login.html', (req, res) => {

    const filePath = path.join(__dirname, '..', '..', '..', '..', '..', 'client-side-config', 'users', 'src', 'login.html');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File sent successfully'); 
        }
    });
});





module.exports = router;
