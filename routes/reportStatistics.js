const express = require('express');
const router = express.Router();
const {authorization} = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.post('/', authorization, (req, res) => {
    reportController.getReportStatistics(req.params.tagValue).then(result=>{
        res.status(200).json(result);
    }).catch(error=>{
        res.status(403).json(error);
    });
});