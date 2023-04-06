const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Post = require('../models/Posts')
const usersFunctions = require('./UserRoutes')
require('dotenv').config()


router.get('/:id', checkToken, async(res, req)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.posterID == req.user._id || req.user.admin){
            res.status(200).json({post:post}).send()
        }
        
    } catch (error) {
        return res.status(500).send(error)
        
    }
})

router.delete('/:id', usersFunctions.checkToken, async(res, req)=>{

    try {
        const posterID = await Post.findById(req.params.id).posterID

        if(req.user.id === posterID || user.admin){
            Post.findByIdAndDelete(req.params.id)
            return res.status(200).send()
        }
        return res.status(400).send()

        
    } catch (error) {
        return res.status(500).json({error:error}).send()
    }


})


router.patch('/updatethumb/:id', usersFunctions.checkToken, getPost, async (req, res)=>{
    if (req.body.thumbnailURL != null){
        req.post.thumbnailURL=req.body.thumbnailURL
        try {
            await post.save()
            return res.status(200).json({upDatedPost:post}).send()
        } catch (error) {
            return res.status(500).json({error:error}).send()
        }
    }
    return res.status(400).send()
})



async function getPost(req, res, next){
    if(req.user._id === req.params.id || req.user.admin){
        try {
            const post = await Post.findById(req.params.id)
            req.post=post
            next()
        } catch (error) {
            return res.status(500).json({error:error}).send()
        }
    }
    return res.status(400).send()
}






module.exports={router, getPost}