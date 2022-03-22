const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", (req, res) => {
  console.log(req.cookies["jwt"]);
  if (req.cookies["jwt"] != null) {
    return res.status(200).json({ message: "user already logged in" });
  }
  userController
    .validateUser(req.body)
    .then((token) => {
      res.cookie("jwt", token, {
        httpOnly: false,
        secure: false,
      });
      res.status(200).json({ token });
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
});

module.exports = router;
