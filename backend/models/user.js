const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String, //Ankit
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://images.unsplash.com/photo-1676909027666-03d2272ca573?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    fallowers:[{
        type:ObjectId, //["Ankit","Sumit","xyz"]
        ref:'User'
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]

})
module.exports = mongoose.model('User',userSchema)