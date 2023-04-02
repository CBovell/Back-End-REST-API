const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    email: String,
    username: String,
    password:String,
    cdate:{type:Date, default:Date.now},
    pictureURL:String
})

const User = mongoose.model('User', userSchema)