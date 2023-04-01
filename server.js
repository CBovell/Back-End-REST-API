const { application } = require('express')
const express = require('express')
const app =  express()
const mongoose = require('mongoose')
require('dotenv').config

app.use(express.json())


