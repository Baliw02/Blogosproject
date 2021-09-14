<template>
<div class="background">
    <div class="wrapper">
        <div style="max-height: 800px;">
            <h1>Lorem Ipsum</h1>
            <img class="register-image" src="../assets/register-background.jpg">
        </div>
        <div class="register-form">
            <h2>Register</h2>
            <i class="fa fa-user"> </i>
            <input class="register username" type="text" v-model="username"><br>
            <i class="fa fa-envelope"> </i>
            <input class="register email" type="text" v-model="email"><br>
            <i class="fa fa-lock"> </i>
            <input class="register password" type="password" v-model="password"><br>
            <input class="image-input" type="file" @change="handleImage"><br>
            <button @keyup.enter="register()" @click="register()">Register</button>
            <button @click="goToLogin()">Login</button>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import axios from 'axios'
export default{
    data(){
        return{
            username : "",
            email: "",
            password: "",
            profile_image:"",
            remoteUrl: ''
        }
    },    
    methods:{
        handleImage(e){
            const selectedImage = e.target.files[0]
            this.createBase64Image(selectedImage)
        },
        createBase64Image(fileObject){
            const reader = new FileReader()

            reader.onload = (e) => {
                this.image = e.target.result
                this.uploadImage()
            }
            reader.readAsDataURL(fileObject)
        },
        uploadImage(){
            const { image } = this
            axios.post('http://localhost:8082/images', {image})
            .then((response) => {
                this.remoteUrl = response.data.url
                console.log(this.remoteUrl)
            })
        },

        register(){
            axios.post('http://localhost:8082/register', {username: this.username, email: this.email, password: this.password, image: this.remoteUrl})
            .then(response => {
                if(response.status == 200){
                    this.$router.push('login')
                }
                else if(response.status == 401){
                    location.reload(true)
                }
            })
        },
        goToLogin(){
            this.$router.push('login')
        }
    }
}
</script>

<style lang="scss" scoped>
$primary-font: Quicksand;
$c-theme-blue: rgb(8, 67, 102);
$transition-type: linear;
$transition-time: .2s;
$transition-cat: all;
$transition-full: $transition-cat $transition-time $transition-type;
$large-font-size: 24px;
$medium-font-size: 16px;
$small-font-size: 12px;

.background{
    display:block;
    position:absolute;
    margin:auto;
    left:0;
    right:0;
    top:0;
    bottom:0;
    max-height: 800px;
}
.wrapper{
    font-family: $primary-font;
    margin-top: 5%;
    margin-bottom:5%;
    text-align: center;
    display:block;
    max-width: 1200px;
    margin:auto;
    position:relative;
    box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36);
    -webkit-box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36);
    -moz-box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36); 

    .register-image{
        max-height:800px;
        height:800px;
        width:100%;
        object-position:center;
        position:relative;
        margin:0;
    }

    h1{
        width: fit-content;
        max-height: 200px;
        display:block;
        margin:auto;
        font-size:120px;
        position:absolute;
        z-index: 99;
        color:transparent;
        margin:auto;
        top:0;
        bottom:0;
        right:0;
        left:23%;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: rgb(255, 255, 255);    
    }
    .register-form{
        color:rgb(8, 67, 102);
        border-top-right-radius: 10%;
        border-bottom-right-radius: 10%;
        margin:auto;
        position:absolute;
        top:0%;
        bottom:0;
        left:0;
        padding: 230px 50px;
        text-align: center;
        background-color: white;
        max-width:fit-content;
        display:block;
        align-items: center;
        color:$c-theme-blue;
        font-family: $primary-font;
        h2{
            text-align: center;
            padding:5px 5px;
            font-size: $large-font-size + 6;
            border-bottom:2px solid rgb(8, 67, 102);
            font-weight: 900;

        }
        .fa{
            font-size:$large-font-size;
            color:$c-theme-blue;
        }
        .register{
            text-align: center;
            font-family: $primary-font;
            font-weight: 500;
            display:block;
            margin-top:2%;
            margin-bottom:2%;
            background-color: transparent;
            border-color: transparent;
            border-bottom:1px solid $c-theme-blue;
            transition: $transition-full;
            font-size: 16px;
            padding:5px 5px;
            color: transparent;
            margin:auto;
            transform: scaleX(5%);
            &:focus{
                color:$c-theme-blue;
                transform: scaleX(100%);
                outline:none;
                border-color: transparent;
                border-bottom-color: $c-theme-blue;
                background-color: rgba(255, 255, 255, 0.507);
            }
            ::placeholder{
                color:$c-theme-blue;
            }
        }
        .image-input{
            margin:auto;
            text-align: center;
            width:80%;
        }
    button{
        margin-left:3%;
        margin-right:3%;
        font-size: $medium_font_size;
        margin-top:5%;
        font-weight: 700;
        padding:5px 5px;
        border:none;
        font-family: $primary-font;
        background-color: white;
        color: $c-theme-blue;
        border: 1px solid rgb(224, 218, 218);
    }
    }
}
</style>