const { application } = require('express')
const express = require('express')
const app =  express()
const mongoose = require('mongoose')
require('dotenv').config

app.use(express.json())

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true})
 .then((res)=> 
 console.log(res),
 app.listen(3000)
 )
 .catch((err) => console.log(err))


