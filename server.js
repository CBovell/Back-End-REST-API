const { application } = require('express')
const express = require('express')
const app =  express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/UserRoutes')
const postsRoutes = require('./routes/PostsRoutes')
require('dotenv').config()

app.use(express.json())

mongoose.connect(process.env.DB_STRING)
 .then((res)=> 
 console.log('connected'),
 app.listen(3000)
 )
 .catch((err) => console.log(err))


 app.use('/users', userRoutes.router)
 app.use('/posts', postsRoutes.router)


