const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', (req, res)=>{
    userController.saveUser(req.body).catch(error=>{
        res.status(403).json({message: error});
    });
});

router.get('/signup:hash', (req, res)=>{
    userController.activateUser(req.params.hash).
        then((token)=>{
            res.cookie("jwt", token, {
                httpOnly: false,
                secure: false
            });
            res.redirect('/reports');
    }).catch(error=>{
        res.status(403).json({message: error});
    })
});