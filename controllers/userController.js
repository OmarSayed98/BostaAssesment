const bcrypt = require("bcrypt");
const saltRounds = 10;
const userModel = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const verificationHash = require('../models/verificationHash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
exports.saveUser = (user) => {
    userModel.find({email: user.email}).then(foundUser => {
        if (!foundUser.length) {
            bcrypt.hash(user.password, saltRounds, (err, hash) => {
                if (err) {
                    throw new Error(error);
                }
                user.password = hash;
                const savedUser = new userModel({
                    name: user.name,
                    password: user.password,
                    email: user.email
                });
                savedUser.save().then(() => {
                    emailVerification(savedUser).catch(error => {
                        throw new Error(error);
                    });
                }).catch(error => {
                    throw new Error(error);
                });
            });
        } else {
            console.log(foundUser.name);
            if (foundUser.active === 1) {
                throw new Error(error);
            } else {
                throw new Error(error);
            }
        }
    }).catch(error => {
        throw new Error(error);
    });
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
    console.log(email.messageId);
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
    return verificationHash.findOne({hash}).then(foundHash => {
        if (!foundHash) {
            throw new Error('invalid Verification URL');
        } else {
            userModel.findOneAndUpdate({email: foundHash.userEmail}, {active: true}).then(foundUser => {
                console.log(foundHash)
                if(!foundUser){
                    throw new Error('cannot find user');
                }
                deleteVerificationHash(foundHash.userId);
                console.log(foundUser);
                return createToken(foundUser._id);
            }).catch(error => {
                throw new Error('failed to activate user' + error);
            });
        }
    }).catch(error => {
        throw new Error('failed to search for hash' + error);
    });
}

exports.validateUser = (user) => {
    userModel.find({email: user.email}).then(foundUser => {
        if (!foundUser) {
            throw new Error('invalid user name or password');
        }
        bcrypt.compare(user.password, foundUser.password).then(result => {
            if (!result) {
                throw new Error('invalid user name or password');
            }
            return createToken(foundUser._id);
        }).catch(error => {
            throw new Error(error);
        });
    }).catch(error => {
        throw new Error(error);
    });
}

const deleteVerificationHash = (userId) => {
    verificationHash.findOneAndDelete({userId}).then(hash => {
        console.log('verification hash deleted' + hash);
    }).catch(error => {
        throw new Error(error);
    });
}