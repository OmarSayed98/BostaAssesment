const express = require("express");
const indexRouter = require("../routes/index");
const userRegistrationRouter = require('../routes/userRegistration');
const cookieParser = require("cookie-parser");
const userSignOutRouter = require('../routes/userSignOut');
const userLogInRouter = require('../routes/userLogIn');
const checkUrlRouter = require('../routes/checkUrl');
const getReportRouter = require('../routes/reportStatistics');
module.exports = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use('/signup', userRegistrationRouter);
    app.use('/', indexRouter);
    app.use('/logout', userSignOutRouter);
    app.use('/login', userLogInRouter);
    app.use('/check', checkUrlRouter);
    app.use('/report', getReportRouter);
};