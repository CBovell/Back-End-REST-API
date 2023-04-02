const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    email: String,
    username: String,
    password:String,
    cdate:{type:Date, default:Date.now},
    pictureURL:String,
    admin:Boolean
})

module.exports = mongoose.model('User', userSchema)