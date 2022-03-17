const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', (req, res) => {
    userController.validateUser(req.body).then(token => {
        res.cookie("jwt", token, {
            httpOnly: false,
            secure: false
        });
        res.status(200).json({token});
    }).catch(error => {
        res.status(403).json({message: error});
    });
});

module.exports = router;