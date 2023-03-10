
const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = require('../models/post')

router.post("/createPost",requireLogin,(req,res) =>{
const {title,body,pic} = req.body
if(!title || !body ||!pic){

    return res.status(422).json({error:"Please add all the Fields"})
}else{
    const post = new Post({title,body,photo:pic,postedBy:req.user})
    post.save()
    .then(result => res.json(result))
}

})

router.get("/allpost",requireLogin,(req,res) =>{
    Post.find()
    .populate("postedBy","_id name")

    .then(posts => res.json(posts))

})


router.get("/mypost",requireLogin,(req,res) =>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost => {
        res.json(mypost)
    })
    
})

router.put("/like",requireLogin,(req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .then(result => res.json(result))
})

router.put("/unlike",requireLogin,(req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","name")
    .then(result => res.json(result))
})

router.put("/comment",requireLogin,(req,res) =>{
    const Comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:Comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id email")
    .populate("postedBy","_id name")
    .exec((err,result) =>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            return res.json(result)
        }
    })

})

router.delete("/deletepost/:postId",requireLogin,(req,res) =>{
Post.findOne({_id:req.params.postId})
.populate("postedBy","_id name")
.exec((err,post) =>{
    console.log(err)
    if(err || !post ){

        return res.status(422).json({error:err})
    }

    if(post.postedBy._id.toString() === req.user._id.toString()){
        console.log("test")
        post.remove()
        .then(result =>{
            return res.json({result})
        })
    }
})

})





module.exports = router