const express = require("express");
const User = require('../models/userSchema')
const router = express.Router();
router.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//register
router.post('/register' , async (req,res) =>{
    const {username , password , email} = req.body

    const hashedPassword = await bcrypt.hash(password , 10)
    console.log(hashedPassword)
    const newUser = new User({
        username,
        password: hashedPassword,
        email
    })

    newUser.save().then((result)=>{
        if(result){
            res.json(result)
        }
    }).catch((err) =>{
        if(err){
            res.send(err)
        }else{
            res.send('user created')}

})

})

//login
// router.post('/login' , (req,res) =>{
//     const {email , password} = req.body
//     User.findOne({email}).then((result) =>{
//         if(!result){
//             res.json({message : "email not found"})
//         }
//         bcrypt.compare(password , result.password).then((passwordChecked) =>{
//             if(!passwordChecked){
//                 res.json({message : "password is not correct"})
//             }
//             const token = jwt.sign(
//                 {
//                   userId: result._id,
//                   userEmail: result.email,
//                 },
//                 "RANDOM-TOKEN",
//                 { expiresIn: "24h" }
//               );
      
//                //   return success response
//                response.status(200).send({
//                 message: "Login Successful",
//                 email: user.email,
//                 token,
//               });

//         }).catch((err) =>{
//             res.json(err)
//         });
        

        

//     }).catch((err) =>{
//         res.json(err)
//     });
// })

router.post("/login", (request, response) => {
    // check if email exists
    User.findOne({ email: request.body.email })
  
      // if email exists
      .then((user) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(request.body.password, user.password)
  
          // if the passwords match
          .then((passwordCheck) => {
  
            // check if password matches
            if(!passwordCheck) {
              return response.status(400).send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              process.env.JWTCODE ,
              { expiresIn: "24h" }
            );
  
            //   return success response
            
            response.cookie('token' , token , {maxAge: 3600000})
            response.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
              });
          })
          // catch error if password does not match
          .catch((error) => {
            response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  });



module.exports = router