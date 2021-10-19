<template>
<div class="background">
    <div class="login-wrapper">
        <h1>WELCOME</h1>
        <div class="img">
            <img class="login-image" src="../assets/login-background.jpg">
        </div>
        <div class="login-form">
            <h2>Login</h2>
            <i class="fa fa-envelope" :class="{error: error_email}"></i>
            <input type="text" class="input-email" v-model="email" :class="{error: error_email}">
            <i class="fa fa-lock" :class="{error: error_password && password == ''}"></i>
            <input type="password" class="input-password" v-model="password" :class="{error: error_password && password == ''}">
            <button @keyup.enter="sendLoginData()" @click="sendLoginData()">Login</button>
            <button @click="goToRegister()">Register</button>
            <ul class="errors">
                <li v-for="error in errorMessage" :key="error">{{error}}</li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import validator from 'email-validator'

import axios from 'axios'

export default{
    name:'Login',
    data(){
        return{
            username: '',
            password: '',
            email:'',
            token:'',
            items: [],
            message:[],
            error_email: false,
            error_password: false,
            errorMessage:[]
        }

    },
    methods:{
        
        sendLoginData(){
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var valid = re.test(this.email)
            if(valid && this.password != ''){
                axios.post('http://localhost:8082/login', {email: this.email, password: this.password})
                .then(res => {                
                    if(res.status === 401){
                        this.errorMessage.push("Invalid credentials")
                    }

                    else if(res.status === 200){
                        localStorage.setItem('token', res.data.token)
                        this.$router.push('/posts')
                        this.errorMessage = []
                    }
                    
                })
            }
            else{
                this.errorMessage = []
                if(!valid){
                    this.error_email = true
                    this.errorMessage.push("Email is need")
                }
                if(this.password == ''){
                    this.error_password = true
                    this.errorMessage.push("Password is need")
                }
            }
        },
        goToRegister(){
            this.$router.push('/register')
        }
    },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
@import './common.scss';
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
    left:0;
    right:0;
    top:0%;
    bottom:0%;
    position:absolute;
    margin:auto;
    max-height: 800px;
    max-width:1200px;
}
.login-wrapper{
    max-height: 800px;
    max-width:1200px;
    position:relative;
    box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36);
    -webkit-box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36);
    -moz-box-shadow: 0px -2px 27px 6px rgba(0,0,0,0.36); 
    font-family: $primary-font;
    h1{
        max-height: 180px;
        margin:auto;
        font-size:150px;
        position:absolute;
        z-index: 99;
        color:rgba(255, 255, 255, 0.178);
        bottom:0%;
        top:0%;
        left:6%;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: rgb(255, 255, 255);    
    }
    .login-image{
        width:100%;
        object-position:center;
        position:relative;
        margin:0;
    }
    .login-form{
        border-top-left-radius: 10%;
        border-bottom-left-radius: 10%;
        margin:auto;
        position:absolute;
        top:0%;
        right:0%;
        bottom:0%;
        padding: 230px 50px;
        text-align: center;
        // Sokkal jobb feheren, holnapi melo az lesz!!
        background: white;
        color:rgb(8, 67, 102);
        h2{
            text-align: left;
            padding:5px 5px;
            font-size: $large-font-size + 6;
            border-bottom:2px solid rgb(8, 67, 102);
            font-weight: 900;
        }
        .fa{
            font-size: 24px;
        }
        .input-email, .input-password{
            font-family: $primary-font;
            font-weight: 500;
            display:block;
            margin-top:2%;
            margin-bottom:2%;
            background-color: transparent;
            border-color: transparent;
            border-bottom:1px solid rgb(8, 67, 102);
            transition: $transition-full;
            font-size: 16px;
            padding:10px 10px;
            color: transparent;
            transform: scaleX(5%);
            &:focus{
                color:black;
                transform: scaleX(100%);
                outline:none;
                border-color: transparent;
                background-color: rgba(255, 255, 255, 0.507);
                border-bottom:1px solid rgb(8, 67, 102);
            }
            ::placeholder{
                color:black;
            }
        }
        .error{
            border-bottom-color:red;
            color:red;
            &:focus{
                border-bottom-color:red;
            }
        }
        i.error{
            border:none;
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
            background-color: rgba(255, 255, 255, 0.507);;
            color: $c-theme-blue;
            border: 1px solid rgb(224, 218, 218);
        }

    }
}
.errors{
    color:red;
    list-style-type: none;
    padding-left:0;
}
</style>