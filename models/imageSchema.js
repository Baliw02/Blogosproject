const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ImageSchema = new Schema({
    image:{
        type: String
    }
})

module.exports = mongoose.model('Image', ImageSchema)