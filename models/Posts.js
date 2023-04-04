const mongoose = require('mongoose')
const schema = mongoose.Schema

const postsSchema = new Schema({
    posterID:String,
    thumbnailURL:String,
    date:{type:Date, default:Date.now},
    upVotes:Number
})

module.exports=mongoose.model('Post', postsSchema)