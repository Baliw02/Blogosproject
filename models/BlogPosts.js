const stringify = require('fast-json-stable-stringify')
const {Schema, model, Mongoose} = require('mongoose')




const BlogPostsSchema = new Schema(
    {
        image:{
            type: String,
        },
        link:{
            type: String,
            required: false,
        },
        tags:{
            type: String,
            required: false,
        },
        category:{
            type: String,
            required: false
        },
        title:{
            type: String,
            required: true
        },
        content:{
            type: String,
            required: true,
        },
        date:{
            type: Date,
            default: Date.now()
        },
        uploader:{
            type: String,
            required: true
        },
        comments:[
        ],
        likes:{
            type:Number, default: 0,
        },
        likedBy:[],
        carousel:{
            type: Boolean
        },
        special: {
            type: Boolean
        },
    }
)
const BlogPosts = model('blogposts', BlogPostsSchema)
module.exports = BlogPosts
