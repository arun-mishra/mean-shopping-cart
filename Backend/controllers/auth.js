const User =require('../models/user');
const Admin =require('../models/admin')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         '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'
//     }
//   })
// );

exports.signup = (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()})
    }
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password)
    User.findOne({email:email})
    .then(user=>{
        if(user){
            console.log(user)
            return res.status(400).json('User already exists!!!')
        }
        console.log(user)
        bcrypt.hash(password,12)
    .then(hashedPw=>{
        const user = new User({
            email:email,
            password:hashedPw
        })
        user.save();
        res.status(201).json({
            message:'User is created',
            user:email
        })
    })
    })
    .catch(err=>{
        res.status(400).json('An unknown error occurred!')
        console.log(err)})
}



exports.login = (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()})
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            res.status(401).json('You are not an Authorized user, Try Sign up first!')
            const error = new Error('You are not an authorized user!!!')
            throw error;
        }
        loadedUser =user;
        return bcrypt.compare(password,user.password)
    })
    .then(isEqual=>{
        if(!isEqual){
            res.status(401).json('Entered password is wrong, Try again with correct password!')
            const error = new Error('You have entered wrong password!!! Try Again !!!')
            throw error;
        }
        const token = jwt.sign({email:loadedUser.email,userId:loadedUser._id.toString()},
       '#ighlySecureToken',{expiresIn:'1 h'})
        res.status(200).json({token:token,userId:loadedUser._id.toString()})
    })
    .catch(err=>{
        res.json(401).json('An unknown error occurred!')
        console.log(err)})
}

exports.admin = (req,res,next)=>{

  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(422).json({errors:errors.array()})
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedAdmin;
  Admin.findOne({email:email})
  .then(admin=>{
      if(!admin){
          res.status(401).json('You are not an Authorized user, Try Sign up first!')
          const error = new Error('You are not an authorized user!!!')
          throw error;
      }
      loadedAdmin =admin;
      return bcrypt.compare(password,admin.password)
  })
  .then(isEqual=>{
      if(!isEqual){
          res.status(401).json('Entered password is wrong, Try again with correct password!')
          const error = new Error('You have entered wrong password!!! Try Again !!!')
          throw error;
      }
      const token = jwt.sign({email:loadedAdmin.email,adminId:loadedAdmin._id.toString()},
     '#ighlySecureToken',{expiresIn:'1 h'})
      res.status(200).json({token:token,adminId:loadedAdmin._id.toString()})
  })
  .catch(err=>{
      res.json(401).json('An unknown error occurred!')
      console.log(err)})
}

exports.verifyUserToken = (req,res,next)=>{
    
    res.status(200).json(req.decodedToken)
}
exports.verifyAdminToken = (req,res,next)=>{
    
    res.status(200).json(req.decodedToken)
}

