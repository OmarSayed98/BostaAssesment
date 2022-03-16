const bcrypt = require("bcrypt");
const saltRounds = 10;
const userModel = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const verificationHash = require('../models/verificationHash');
const jwt = require('jsonwebtoken');

export const saveUser = (user)=>{
    userModel.find({email: user.email}).
        then(foundUser=>{
            if(!foundUser){
                bcrypt.hash(user.password, saltRounds, (err, hash) =>{
                    if(err){
                        throw new Error("Failed to Hash Password");
                    }
                    user.password = hash;
                    user.save().
                        then(()=>{
                            emailVerification(foundUser.email).catch(error=> throw new Error('Failed to send email verification \n' + error));
                    }).catch(error=> throw new Error(error));
                });
            }
            else{
                if(foundUser.active === 1){
                    throw new Error('email already registered');
                }
                else{
                    throw new Error('user account not activated please check your email');
                }
            }
    }).catch(error=> throw new Error(error));
}

const emailVerification = async (user)=>{
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const verificationUrl = 'localhost:3000/signup?hash='+randomBytes;

    const userVerificationHash = new verificationHash({
        userId: user._id,
        hash: randomBytes
    });
    await userVerificationHash.save();

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    await transporter.sendMail({
        from: 'Bosta Backend Assessment', // sender address
        to: user.email, // list of receivers
        subject: "Bosta Assessment account verification", // Subject line
        text: "Thank You for taking time and creating account at Bosta Backend Assessment please visit the url sent below for activating your accoutn \n" +
            verificationUrl
    });
}

export const activateUser = (hash)=>{
    verificationHash.find({hash}).
        then(foundHash=>{
            if(!foundHash){
                throw new Error ('invalid Verification URL');
            }
            else{
                userModel.findByIdAndUpdate(foundHash.userId, {active: true}).
                    then(foundUser=>{
                        return jwt.sign(
                            { userId: foundUser._id },
                            process.env.TOKENKEY,
                            {
                                expiresIn: "24h",
                            }
                        );
                }).catch(error=>{
                    throw new Error('failed to activate user' + error);
                });
            }
    }).catch(error=>{
        throw new Error('failed to search for hash' + error);
    });
}