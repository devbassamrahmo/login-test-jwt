const express =require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouter')
app.use(express.json())
app.use('/user',userRouter)
const authanticate = require('./middleware/authUser')

mongoose.connect(process.env.DB_URL).then((result) =>{
    
    console.log("server is connected to db")
}).catch((err) =>{
    console.log(err)
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

app.get('/' , (req,res) =>{
    res.send("<h1>welcome to my page</h1>")
})

app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
  });
  
  // authentication endpoint
  app.get("/auth-endpoint", authanticate, (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });


  app.post('/logout' , (req,res) =>{
    response.cookie('token' , '' , {maxAge: 1})
  })



  app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})