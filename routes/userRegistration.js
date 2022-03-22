const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', (req, res) => {
    userController.saveUser(req.body).then(message => {
        console.log(message);
        res.status(200).json(req.body);
    }).catch((error) => {
        res.status(403).json({message: error});
    });
});
router.get('/', (req, res) => {
    userController.activateUser(req.params.hash).then((token) => {
        res.cookie("jwt", token, {
            httpOnly: false,
            secure: false
        });
        res.status(200).json({message: "done"});
    }).catch(error => {
        res.status(400).json({message: error});
    })
});

module.exports = router;