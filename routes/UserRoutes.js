const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


router.post('/login', async (req, res)=>{

    const user = await User.find({username: req.username})

    if(user==null){
        res.status(400).send("User not found")
    }

    try{
        if(bcrypt.compare(req.body.password, user.password)){
            const encryptedUser=jwt.sign(user, process.env.SECRET_KEY)
            res.status(200).json({token:encryptedUser}).send()
        }
        res.status(400).send("Error")

    }catch{
        res.status(500).send()
    }



})

router.post('/signup', async (req, res)=>{

    if(User.find({username:req.body.username}) != null){
        res.status(400).send("Username already in use")
    }

    if(User.find({username:req.body.email}) != null){
        res.status(400).send("Email already in use")
    }

    try{
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const user =new User({
            username: req.body.username,
            email: req.body.email,
            password:hashedPass,
            cdate: Date.now,
            pictureURL:req.body.pictureURL,
            admin:false
        })
    
        try{
            const messege = await user.save()
            const encryptedUser=jwt.sign(user, process.env.SECRET_KEY)
            res.status(200).json({token:encryptedUser}).send()
    
        } catch(err){
            res.status(500).json({messege:err}).send()
        }

    
    }catch{
       res.status(500).send() 
    }

})

router.get('/get/:id', (req, res)=>{


})



module.exports = router