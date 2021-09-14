const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    username: {
        type: String, required: true
    },
    image: {
        type:String, required: false
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User