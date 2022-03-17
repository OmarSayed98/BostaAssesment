const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send({message: "Bosta Assesment"});
});

module.exports = router;
