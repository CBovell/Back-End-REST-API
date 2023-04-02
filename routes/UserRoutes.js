const express = require('express')
const router = express.Router()
const User = require('../models/Users')


router.post('/login', async (req, res)=>{

    const user = await User.find(username = req.username)

})

router.post('/signup', async (req, res)=>{



    const user =new User({
        username: req.body.username,
        email: req.body.email,
        password:String,
        cdate: Date.now,
        pictureURL:req.body.pictureURL,
        admin:false
    })

    try{
        const messege = await user.save()
    

    } catch(err){
        res.status(400).json({messege:err}).send()
    }
    

    

})

router.get('/get/:id', (req, res)=>{


})



module.exports = router