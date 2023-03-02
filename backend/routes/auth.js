const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { SECRETKEY } = require('../keys')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()


router.post("/signup",(req,res) =>{
    const {name,email,password,pic} = req.body
    if(!email || !name || !password){
        res.status(422).json({error:"Please add all the fields"})


    }else{
        User.findOne({email:email})
        .then((savedUser) =>{

            if(savedUser){
                res.status(422).json({error:"User Already Exists"})
            }else{
                bcrypt.hash(password,12)
                .then(hashedpassword => {
                    const user = new User({
                        name,
                        email,
                        password:hashedpassword,
                        pic
                    })
                    user.save()
                    .then(user => {
                        res.status(200).json({msg:"User Added Successfully"})
                    })
                })


            }

        })
    }
})

router.post("/login",(req,res) =>{
const {email,password} = req.body
if(!email || !password){
    return res.status(422).json({error:"please add Email and password"})
}else{
    User.findOne({email:email})
    .then(dbUser =>{
        if(!dbUser){
            return res.status(422).json({error:"invalid Email Id!!!"})
        }else{
            bcrypt.compare(password,dbUser.password)
            .then(doMatch =>{
                if(doMatch){

                    const token = jwt.sign({id:dbUser._id},SECRETKEY)
                    return res.json({token})
                }else{
                    return res.status(422).json({error:"Invalid Password"})
                }
            })

            
        }


    })
}

})    

router.get("/protected", requireLogin,(req,res) =>{
    res.json(req.user)


 })


module.exports = router


