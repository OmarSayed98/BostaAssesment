const express = require('express');
const router = express.Router();
const {authorization} = require('../middleware/auth');
const checkController = require('../controllers/checkController');

router.post('/', authorization, (req, res) => {
    checkController.saveCheck(req.body).then(message => {
        res.status(200).json({message});
    }).catch((error) => {
        res.status(403).json({message: error});
    });
});

router.put('/', authorization, (req, res) => {
    checkController.updateCheck(req.body).then(message => {
        res.status(200).json({message});
    }).catch(error => {
        res.status(403).json({message: error});
    })
});

router.delete('/', authorization, (req, res) => {
    checkController.deleteCheck(req.body).then(message => {
        res.status(200).json({message});
    }).catch(error => {
        res.status(403).json({message: error});
    })
});

module.exports = router;

