const express = require('express');
const router = express.Router();
const path = require('path');
const { forgotPassword, resetPassword  } = require('../controller/reset.password.controller');

// Route for requesting a password reset
router.post('/forgot', forgotPassword);

router.post('/reset', resetPassword);

router.get('/reset.html', (req, res) => {
    // Construct the file path to reset.html
    const filePath = path.join(__dirname, '..', '..', '..', 'src', 'reset.html');
    // Send the file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File sent successfully'); // Log success message
        }
    });
});


router.get('/login.html', (req, res) => {
    // Construct the file path to login.html
    const filePath = path.join(__dirname, '..', '..', '..', '..', '..', 'client-side-config', 'users', 'src', 'login.html');
    // Send the file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File sent successfully'); // Log success message
        }
    });
});





module.exports = router;
