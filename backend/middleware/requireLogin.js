const jwt = require('jsonwebtoken')
const { SECRETKEY } = require('../keys')
const User = require('../models/user')
const router = require('../routes/auth')

module.exports = (req,res,next) =>{
    const{authorization} = req.headers  //Barer XXXX.YYYY.ZZZZZ
   
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }else{
        const token = authorization.replace("Bearer ","")

        jwt.verify(token,SECRETKEY,(err,payload) =>{
            if(err){
                return res.status(401).json({error:"You must be looged in"})
            }else{
                // console.log(payload)
                const {id} = payload

                User.findById(id)
                .then(userData => {
                    userData.password = undefined
                    console.log(userData)
                    req.user = userData  
                    next()
                   


                })

            
                
            }
        })
    }

    
}


