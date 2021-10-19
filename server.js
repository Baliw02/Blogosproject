const express = require('express')
const mongoose = require('mongoose')
const BlogPosts = require('./routes/api/posts')
const cors = require('cors')
const bodyParser = require('body-parser')
const {PORT, mongoUri} = require('./config')
const app = express()
const bcrypt = require('bcrypt')
const User = require('./models/UserModel')
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator')
const base64Img = require('base64-img')
const ImageSchema = require('./models/imageSchema') 




app.set('secretKey', 'nodeRestApi')
app.use(cors())
app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }))

//Registration
app.post('/register', body('email').isEmail(), body('password').isLength({min:5}), (req, res, next) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        return res.status(400).json({
            title:"Your information is not real"
        })
    }
    else{
        User.findOne({email: req.body.email}, (err,user) => {
            if(!user){
                User.findOne({username: req.body.username}, (err, user_name) => {
                if(!user_name){
                    const newUser = new User({
                        image: req.body.image,
                        username: req.body.username,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10),
                    })
                    if(newUser){
                        newUser.save()
                        return res.status(200).json({
                            title:"User is registered!",
                            message: "You are automatically navigated to login!"
                        })
                    }
                }
                else{
                    return res.status(401).json({
                        title: "Error",
                        message: "Email or username is already used."
                    })
                }
                })
            }
            else{
                return res.status(401).json({
                    title: "Error",
                    message: "Email is already in use!"
                })
            }
        })
    }
})
//Ha netan nem jo nezz ra az adatbazisra, rosszul regisztralt es azert nem jo a jelszo
//ne idegeskedj!!!
//Login Function
// db.blogposts.insertOne({"comments": ["asd"]})
app.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            console.log("user not find")
            return res.status(401).json({
                title:"User Not Found!",
                message: "Invalid Credentials!"
            })
        }
        else{
            if(err){
                return res.status(500)
            }
            const pwdresult = bcrypt.compareSync(req.body.password, user.password)
            if(pwdresult){
                let token = jwt.sign({userId: user._id}, 'secretKey')
                return res.status(200).json({
                    message: "Logged in",
                    token:token
            })
            }
            else if(!pwdresult){
                return res.status(401).json({
                    title:"Wrong Password!",
                    message:"Wrong Password."
            })
        }
    }
    })
})
//Validate checker
function validateUser(req, res, next){
    let token = req.headers.token
    jwt.verify(token,'secretKey',
    function(err, decoded){
        if(err){
            res.json({message:'Token error', data:null})
        }else{
            req.body.userId = decoded.id
            next()
        }
    }
    )
}

//Active User
app.get('/activeUser', (req, res, next) => {
    let token = req.headers.token
    jwt.verify(token, 'secretKey', (err, decoded) => {
        if(err){ return res.status(401).json({title:"Token is invalid"})}
        User.findOne({_id: decoded.userId}, (err, user) =>{
            if(err){return console.log(err)}
            return res.status(200).json({
                title:"User is grabbed",
                user:{
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    image: user.image
                }
            })
        })
    })
})
//Edit User
app.put('/edit-user' ,async(req, res) =>{
    let token = req.headers.token
    jwt.verify(token, 'secretKey', (err, token) => {
        if(err){return res.status(401).json({title: "Invalid Token"})}
        else{
                User.findOneAndUpdate({_id: token.userId},{$set:{image: req.body.image, email: req.body.email, username: req.body.username}}, {new: true} ,(err, user) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        return res.status(200).json({title:"User is edited"})
                    }                
                })
            }
    })
})
//Delete User
app.delete('/activeUser/:email/', (req, res) => {
    let {email} = req.body.email
    let token = req.headers.token
    jwt.verify(token, 'secretKey', (err, decoded) => {
        if(err){return res.status(401).json({title: "Token is invalid!"}
        )}
        User.findByIdAndDelete(email, (err, user) => {
            console.log(decoded._id)
            if(err){res.status(401).json({title: "User is not deleted"})}
            return res.status(200).json({title: "User is deleted"})
        })
    })
})

app.use('/posts', validateUser, BlogPosts)

app.use(express.static('./images'))

//Upload image to server and then elkapom az urlt vueba es ugy postolom post imagehez
app.post('/images', async (req, res) => {
    const { image } = req.body
    const imgbody = new ImageSchema(req.body)
    const img = base64Img.img(image, './images', Date.now(), (err, filePath) => {
        const pathArr = filePath.split('/')
        const fileName = pathArr[pathArr.length - 1]

        res.status(200).json({
            success:true,
            url: 'http://localhost:8082/' + fileName
        })
    })
    console.log(imgbody._id)
    imgbody.image = img

    imgbody.save()
})
app.delete('/images/:imagename', (req, res) => {
    const { imagename } = req.params
    console.log(imagename)

})


mongoose.connect(mongoUri, {})
.then(
    () => console.log("MongoDB is Connected Successfully!") 
)
.catch(
    (err) => console.log(err))


app.get('/', (req, res) => res.send("Working!"))
app.use(function(req, res, next){
    res.set('Cache-control', 'public, max-age=31536000')
})

app.listen(PORT, () => console.log("App is listening on: " + "-->" + PORT + "<--" + " port"))