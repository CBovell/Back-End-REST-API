const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Post = require('../models/Posts')
require('dotenv').config()


router.post('/login', async (req, res)=>{

    const user = await User.find({username: req.username})

    if(user==null){
        return res.status(400).send("User not found")
    }

    try{
        if(bcrypt.compare(req.body.password, user.password)){
            const encryptedUser=jwt.sign(user, process.env.SECRET_KEY)
            return res.status(200).json({token:encryptedUser}).send()
        }
        return res.status(400).send("Error")

    }catch{
        return res.status(500).send()
    }



})

router.post('/signup', async (req, res)=>{

    if(User.find({username:req.body.username}) != null){
        return res.status(400).send("Username already in use")
    }

    if(User.find({username:req.body.email}) != null){
        return res.status(400).send("Email already in use")
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

            await user.save()
            const encryptedUser=jwt.sign(user, process.env.SECRET_KEY)
            return res.status(200).json({token:encryptedUser}).send()
    
        } catch(err){
            return res.status(500).json({messege:err}).send()
        }

    
    }catch{
        return res.status(500).send() 
    }

})

router.delete('/delete/:id',checkToken, async(req, res)=>{
    if(req.user._id === req.params.id || req.user.admin){
        const validPass=bcrypt.compare(req.body.validPassword, req.user.password)

        if(validPass || req.user.admin){
            try{
                const deletedUser = await User.findByIdAndDelete(req.params.id)
                res.status(200).json({username:deletedUser.username, email: deletedUser.email,pictureURL:deletedUser.pictureURL, id:deletedUser.id})
    
            }catch(error){
                res.status(500).json({error:error}).send()
            }

        }
        res.status(400).send() 
    }
    res.status(400).send() 
    
})

router.patch('/updatePassword/:id',checkToken, validatePassword, async (req, res)=>{
    try {
        const salt = await bcrypt.genSalt()
        try {
            const hashedPass = await bcrypt.hash(req.body.newPassword, salt)
            await User.findByIdAndUpdate(req.params.id, {password: hashedPass})
            return res.sendStatus(200)
        } catch (error) {
            res.send(500).json({error:error}).send()
        }


    } catch (error) {
        res.send(500).send()
    }
})

router.patch('/updateUserInfo/:id', checkToken, async(req, res)=>{

    if(req.user._id === req.params.id || req.user.admin){
        const validPass=bcrypt.compare(req.body.validPassword, req.user.password)
        if(validPass || req.user.admin){
            const user=req.user
            if(req.user.admin && req.user._id != req.params.id){
                try {
                    const user = await User.findById(req.params.id)

        
                } catch (error) {
                    res.sendStatus(500)
                }
            }

            if(req.body.username!=null){
                try {
                    const usernameCheck = await User.find({username:req.body.username})
                    if(usernameCheck == null){
                        user.username=req.body.username
                    }
                    res.sendStatus(400)
                } catch (error) {
                    res.sendStatus(500)
                }
            }

            if(req.body.email!=null){
                try {
                    const emailCheck = await User.find({email:req.body.email})
                    if(emailCheck == null){
                        user.email=req.body.email
                    }
                    res.sendStatus(400)
                } catch (error) {
                    res.sendStatus(500)
                }
            }

            user.save()

        }
        res.sendStatus(400)

    }
    res.sendStatus(400)



})

function checkToken(req, res, next){
    const header = req.headers['authorization']
    const token = header && header.split(' ')
    if (token == null){
        return res.status(400).send()
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(400).send()
        }
        req.user=user
        next()

    })
}

async function validatePassword(req, res, next){
    if(req.user._id===req.params.id){
        if(req.body.newPassword !=null){
            const validPass = bcrypt.compare(req.body.oldPassword, req.user.password)

            if(validPass){
                next()
            }
            return res.status(400).send()


        }
        return res.status(400).send()
    }
    return res.status(400).send()




}

module.exports = {router, checkToken}