const express = require("express");
const indexRouter = require("../routes/index");
const userRegistrationRouter = require('../routes/userRegistration');
const cookieParser = require("cookie-parser");
const userSignOutRouter = require('../routes/userSignOut');

module.exports = (app)=>{
    app.use(express.json());
    app.use(cookieParser());
    app.use('/', indexRouter);
    app.use('/signup', userRegistrationRouter);
    app.use('/logout', userSignOutRouter)
};