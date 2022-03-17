const express = require('express');
const router = express.Router();
const {authorization} = require('../middleware/auth');

router.get("/logout", authorization, (req, res) => {
    return res
        .clearCookie("jwt")
        .status(200)
        .json({message: "user logged out"});
});

module.exports = router;