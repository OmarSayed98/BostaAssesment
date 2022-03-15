const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
require("./startup/routes")(app);
app.listen(3000);
module.exports = app;
