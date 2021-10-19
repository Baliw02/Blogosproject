const { Router} = require('express');
const BlogPosts = require('../../models/BlogPosts')
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
    var title = req.body.title
    var content = req.body.content
    var image = req.body.image
    if(title == null || title == undefined || title == ''){
        return res.status(204).json({title:"Title is required"})
    }
    else if(content == null || content == undefined || content == ''){
        return res.status(204).json({title:"Title is required"})
    }
    else if(image == null || image == undefined || image == ''){
        return res.status(204).json({title:"Title is required"})
    }
    const blogpost = await new_BlogPost.save()
    if(!blogpost) throw new Error('Something went wrong while upload post!')
    else{
        res.status(200).json({title:"Everything is ok!"})
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
        const getThePost = await BlogPosts.findByIdAndUpdate(id)
        var selectedComm = getThePost.comments[req.headers.index]
        const response = await BlogPosts.findOneAndUpdate({_id: id}, {$pull:{comments: selectedComm},}, {new: true})
        
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