const router = require("express").Router();
const controller = require("../controller/auth.controller");
const path = require('path');
const jwt = require("jsonwebtoken");

const secretKey = '2851ee5044db499aa595b93a79eb75af12050222c52df524bdca191519bbd93d2dee2a89fda68e6c166108c8bfd1aa09a759eab0ed9a270622c4e09f56cbb076'; 
const db_conn = require('../../Config/db.conn');

router.post("/signin", controller.authSignin);
router.post("/signup", controller.authSignup);

router.get('/verify_email.html', (req, res) => {

    const filePath = path.join(__dirname, '..', '..', '..', 'src', 'verify_email.html');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File sent successfully'); 
        }
    });
});


router.get('/verify-email', async (req, res) => {
    const verificationToken = req.query.token;
    const userId = req.query.userId; // Get the user ID from the request URL

    try {
        // Decode verification token to get user ID
        const decodedToken = jwt.verify(verificationToken, secretKey);
        
        // Parse user IDs as integers
        const userIdFromToken = parseInt(decodedToken.userId);
        const userIdFromURL = parseInt(userId);

        // Check if the user ID from the token matches the one from the URL
        if (userIdFromToken !== userIdFromURL) {
            console.error('User ID from token does not match the one from URL');
            return res.status(400).send('Invalid user ID');
        }

        // If user IDs match, continue with verification process
        
        // Update isVerified status in the database
        db_conn.query(
            'UPDATE tbl_account SET isVerified = ? WHERE id = ?',
            [true, userIdFromToken],
            (error, results) => {
                if (error) {
                    console.error('Error updating isVerified status:', error);
                    // Respond with error message
                    res.status(500).send('An error occurred while verifying email.');
                } else {
                    // Check if any rows were affected by the update
                    if (results.affectedRows > 0) {
                        console.log('Email verified successfully.');
                        // Respond with success message
                        res.status(200).send('Email verified successfully.');
                    } else {
                        console.log('No rows updated. User ID may not exist.');
                        // Respond with error message
                        res.status(404).send('User ID not found or already verified.');
                    }
                }
            }
        );
        
    } catch (error) {
        console.error('Error verifying email:', error);
        // Respond with error message
        res.status(500).send('An error occurred while verifying email.');
    }
});


  
  
module.exports = router;
