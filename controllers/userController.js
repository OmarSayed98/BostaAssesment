const bcrypt = require("bcrypt");
const saltRounds = 10;
const userModel = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const verificationHash = require('../models/verificationHash');
const jwt = require('jsonwebtoken');
exports.saveUser = (user) => {
    return new Promise((resolve, reject) => {
        userModel.findOne({email: user.email}).then(foundUser => {
            if (!foundUser) {
                bcrypt.hash(user.password, saltRounds, (err, hash) => {
                    if (err) {
                        reject(error);
                    }
                    user.password = hash;
                    const savedUser = new userModel({
                        name: user.name,
                        password: user.password,
                        email: user.email
                    });
                    savedUser.save().then(() => {
                        emailVerification(savedUser).catch(error => {
                            reject(error);
                        }).then(() => {
                            resolve("account created please activate it by checking your mail");
                        });
                    }).catch(error => {
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
        }).catch(error => {
            reject(error);
        });
    })
}

const emailVerification = async (user) => {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const verificationUrl = 'http://localhost:3000/signup?hash=' + randomBytes;

    const userVerificationHash = new verificationHash({
        userEmail: user.email,
        hash: randomBytes
    });
    await userVerificationHash.save();


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.VERIFICATION_EMAIL,
            pass: process.env.VERIFICATION_EMAIL_PASS,
        },
    });
    let email = await transporter.sendMail({
        from: 'Bosta Assessment', // sender address
        to: user.email, // list of receivers
        subject: "Bosta Assessment account verification", // Subject line
        text: "Thank You for taking time and creating account at Bosta Backend Assessment please visit the url sent below for activating your accout \n" +
            verificationUrl
    });
}

const createToken = (userId) => {
    return jwt.sign(
        {userId: userId},
        process.env.TOKENKEY,
        {
            expiresIn: "24h",
        }
    );
}

exports.activateUser = (hash) => {
    return new Promise((resolve, reject) => {
        verificationHash.findOne({hash}).then(foundHash => {
            if (!foundHash) {
                reject('invalid Verification URL');
            } else {
                userModel.findOneAndUpdate({email: foundHash.userEmail}, {active: true}).then(foundUser => {
                    console.log(foundHash)
                    if (!foundUser) {
                        reject('cannot find user');
                    }
                    deleteVerificationHash(foundHash.userId).then(() => {
                        console.log('verification hash deleted ');
                    }).catch(error => {
                        reject(error);
                    })
                    console.log(foundUser);
                    resolve(createToken(foundUser._id));
                }).catch(error => {
                    reject('failed to activate user' + error);
                });
            }
        }).catch(error => {
            reject('failed to search for hash' + error);
        });
    })
}

exports.validateUser = (user) => {
    return new Promise((resolve, reject) => {
        userModel.findOne({email: user.email}).then(foundUser => {
            if (!foundUser) {
                reject('invalid user name or password');
            }
            bcrypt.compare(user.password, foundUser.password).then(result => {
                if (!result) {
                    reject('invalid user name or password');
                }
                resolve(createToken(foundUser._id));
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

const deleteVerificationHash = (userId) => {
    return verificationHash.findOneAndDelete({userId}).then(hash => {
        console.log('verification hash deleted' + hash);
    }).catch(error => {
        throw new Error(error);
    });
}