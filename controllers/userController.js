const bcrypt = require("bcrypt");
const saltRounds = 10;
const userModel = require("../models/userModel");
const crypto = require("crypto");
const mailSender = require("../services/emailSender");
const verificationHash = require("../models/verificationHashModel");
const jwt = require("jsonwebtoken");

exports.saveUser = (user) => {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email: user.email })
      .then((foundUser) => {
        if (!foundUser) {
          bcrypt.hash(user.password, saltRounds, (err, hash) => {
            if (err) {
              reject(error);
            }
            user.password = hash;
            const savedUser = new userModel({
              name: user.name,
              password: user.password,
              email: user.email,
            });
            savedUser
              .save()
              .then(() => {
                emailVerification(savedUser)
                  .catch((error) => {
                    reject(error);
                  })
                  .then(() => {
                    resolve(
                      "account created please activate it by checking your mail"
                    );
                  });
              })
              .catch((error) => {
                reject(error);
              });
          });
        } else {
          if (foundUser.active) {
            reject("user already registered");
          } else {
            reject("please activate your account by checking your mail");
          }
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const emailVerification = async (user) => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const verificationUrl = "http://localhost:3000/signup?hash=" + randomBytes;

  const userVerificationHash = new verificationHash({
    userId: user._id,
    hash: randomBytes,
  });
  await userVerificationHash.save();
  mailSender
    .sendMail(
      "Thank You for taking time and creating account at Bosta Backend Assessment please visit the url sent below for activating your accout \n" +
        verificationUrl,
      user.email
    )
    .then(() => {
      console.log("verification email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const createToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.TOKENKEY, {
    expiresIn: "24h",
  });
};

exports.activateUser = (hash) => {
  return new Promise((resolve, reject) => {
    verificationHash
      .findOne({ hash })
      .then((foundHash) => {
        if (!foundHash) {
          reject("invalid Verification URL");
        } else {
          userModel
            .findOneAndUpdate({ _id: foundHash.userId }, { active: true })
            .then((foundUser) => {
              console.log(foundHash);
              if (!foundUser) {
                reject("cannot find user");
              }
              deleteVerificationHash(foundHash.userId)
                .then(() => {
                  console.log("verification hash deleted ");
                })
                .catch((error) => {
                  reject(error);
                });
              console.log(foundUser);
              resolve(createToken(foundUser._id));
            })
            .catch((error) => {
              reject("failed to activate user" + error);
            });
        }
      })
      .catch((error) => {
        reject("failed to search for hash" + error);
      });
  });
};

exports.validateUser = (user) => {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email: user.email })
      .then((foundUser) => {
        if (!foundUser) {
          reject("invalid user name or password");
        }
        bcrypt
          .compare(user.password, foundUser.password)
          .then((result) => {
            if (!result) {
              reject("invalid user name or password");
            }
            resolve(createToken(foundUser._id));
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteVerificationHash = (userId) => {
  return verificationHash
    .findOneAndDelete({ userId })
    .then((hash) => {
      console.log("verification hash deleted" + hash);
    })
    .catch((error) => {
      throw new Error(error);
    });
};
