const mongoose = require("mongoose");
const connectionString = "mongodb://localhost/Bosta";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database Connection Error"));
