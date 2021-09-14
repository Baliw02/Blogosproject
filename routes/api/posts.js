const { Router, application, response } = require('express');
const { token } = require('morgan');
const BlogPosts = require('../../models/BlogPosts')
const multer = require('multer')
const router = new Router()


router.get('/', async(req, res) => {
    try{
        const blogposts = await BlogPosts.find()
        if(!blogposts) throw new Error('Not have Blog Posts!')
        const sorted = blogposts.sort((a, b) => {

            return new Date(a.date).getTime() - new Date(b.date).getTime() 
        })
        res.status(200).json(sorted)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/create/', async(req, res) => {
    const new_BlogPost = new BlogPosts(req.body)
    try{
        const blogpost = await new_BlogPost.save()
        if(!blogpost) throw new Error('Something went wrong while upload post!')
        else{
            res.status(200).json({title:"Everything is ok!"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.put('/:id', async(req, res) =>{
    const {id} = req.params
    try{
        const response = await BlogPosts.findByIdAndUpdate(id, req.body)
        if(!response) throw Error('Something Went Wrong')
        const updated = { ...response._doc, ...req.body}
        res.status(200).json(updated)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.delete('/:id/comments', async(req, res) => {
    const {id} = req.params
    try{
        console.log(req.headers.index)
        const getThePost = await BlogPosts.findByIdAndUpdate(id)
        var selectedComm = getThePost.comments[req.headers.index]
        const response = await BlogPosts.findOneAndUpdate(id, {$pull:{comments: {profile: selectedComm.profile, message: selectedComm.message }}})
        
        if(!response){return res.status(401).json({title: "Dont find the comment"})}
        return res.status(200).json({title:"Comment is deleted"})
    }catch(err){
        console.log(err.message)
    }
})
router.post('/:id/comments', async(req, res) => {
    console.log("cs")
    const {id} = req.params
    console.log(id)
    console.log(req.body.comments)
    BlogPosts.findByIdAndUpdate(id, {$push:{comments: req.body.comments}}, (err, post) => {
        console.log(post._id)
        return res.status(200).json({title: "Commented!"})
    })
})
router.post('/:id/likes', async(req, res) => {
    const {id} = req.params
    const username = req.body.likedBy
    let check = false
    var blogpost = BlogPosts.findById(id, {})
    blogpost.findOne({likedBy: username}, (err, post) => {
        if(post){
            
            BlogPosts.findByIdAndUpdate(id, {$pull: {likedBy: req.body.likedBy}}, (err, post) => {
                console.log("unliked")
            })
            BlogPosts.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, post) => {
                console.log("Like is eltavolitva")
                return res.status(200).json({title: "unliked", message: "unliked"})
            })
        }
        if(!post){
            BlogPosts.findByIdAndUpdate(id, {$push: {likedBy: req.body.likedBy}}, (err, post) => {
                console.log("Likeolva")
            })
            BlogPosts.findByIdAndUpdate(id, {$inc:{likes: 1}}, (err, post) => {        
                console.log("+1")
                return res.status(200).json({title: "liked", message: "liked"})
            })
            }
    })
})
router.get('/:id', async(req, res) => {
    const {id} = req.params
    console.log("megvagy:" + id)
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params
    try{
        const removed = await BlogPosts.findByIdAndDelete(id)
        if(!removed) throw Error('Something Went Wrong while delete post!')
        res.status(200).json(removed)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router