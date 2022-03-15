const express = require("express");
const indexRouter = require("../routes/index");

module.exports = (app)=>{
    app.use(express.json());
    app.use('/', indexRouter);
};