<template>
<div>
<Header v-if="screenW >= 1200" />
<Sidebar v-if="screenW < 1200 "/>
    <div class="full-profile">
        <div class="user-data">
            <div class="userdata-left">
                <ul>
                    <li class="image">
                        <img :src="user.image" alt="">
                        <input class="profile-image-file" type="file" @change="handleImage">
                    </li>
                    <h1>Datas:</h1>
                    <li class="datas">
                        Email: <span v-if="!editable"> {{user.email}}</span>
                        <input v-if="editable" type="text" v-model="email">
                    </li>
                    <li class="datas">
                        Username: <span v-if="!editable"> {{user.username}}</span> 
                        <input v-if="editable" type="text" v-model="username">
                    </li>
                        <button @click="saveEditedData()">Save</button>
                        <button @click="editInfo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                    <hr>
                    <li @click="deleteUser(user)" class="delete-profile">Delete Profile</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Header from './Header'
import Sidebar from './Sidebar'
import axios from 'axios'
// import PictureInput from 'vue-picture-input'

export default{
    components:{
        Header,
        Sidebar
        // PictureInput
    },
    data(){
        return{
            user: [],
            about_user: '',
            remoteUrl: '',
            screenW: 0,
            editable: false,
            email: '',
            username: ''
        }
    },
    created(){

        const headers = {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
        axios.get('http://localhost:8082/activeUser', {headers: headers}).then(response => {
            this.user = response.data.user
        })
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    methods:{
        editInfo(){
            if(!this.editable){
                this.editable = true
            }
            else{
                this.editable = false
            }
        },
        handleResize(){
            this.screenW = window.innerWidth
        },

        saveEditedData(){
        const headers = {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
        if(this.email == ''){
            this.email = this.user.email
        }
        if(this.username == ''){
            this.username = this.user.username
        }
        if(this.remoteUrl == ''){
            this.remoteUrl = this.user.image
        }
            axios.put('http://localhost:8082/edit-user', {image: this.remoteUrl, email: this.email, username: this.username}, {headers: headers}).then((response) => {
                if(response.status == 200){
                    this.user.image = this.remoteUrl
                    this.user.email = this.email
                    this.user.username = this.username
                }
            })
        },
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

        deleteUser(){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }
            var email = this.user.email
            axios.delete('https://localhost:8082/activeUser/' + email, {headers: headers})
            
        }
    },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
@import './common.scss';
$primary-font: Quicksand;
.full-profile{
    margin:auto;
    margin-top:-30px;
    justify-content: center;
    text-align: right;
    max-width:550px;
    @media only screen and (max-width: 320px){
        max-width: 320px;
    }
    ul{
        list-style: none;
        padding:0;
        max-width: 100%;
        width:100%;
        display:block;
        margin:auto;
        @media only screen and (max-width:450px){
            max-width:430px;
        }
        @media only screen and (max-width:320px){
            max-width:320px;
        }
        li{
            text-align: center;
            position:relative;
            margin-bottom:1%;
            margin-top:1%;
            inline-size: 100%;
            word-break: break-all;
            font-weight: 600;
            font-size: 16px;
            max-width: 100%;
            padding: 15px 2px;
            i{
                position:absolute;
                right:0;
                font-size:14px;
                background-color:black;
                color:White;
                padding:5px;
                border-radius: 5px;
            }
        }
        .datas{
            margin:auto;
            text-align: left;
        }
    }
    .delete-profile{
        margin-top: 2px;
        margin-bottom: 2px;
        float:right;
        font-weight: 1000;
        padding:8px;
        width:fit-content;
        background-color: red;
        color:White;
    }
    .user-data{
        display:flex;
        font-family: $primary-font;
        margin:auto;
        justify-content: center;
        .userdata-left{
            padding:10px 10px;
            margin-top: 0px;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid black;
            background-color: rgb(255, 255, 255);
            color:black;
            max-width:100%;
            font-size: 36px;
            img{
                margin:auto;
                max-width: 400px;
                max-height: 400px;
                min-height: 400px;
                min-width: 400px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
                display:block;
                @media only screen and(max-width:410px){
                    min-width:320px;
                    min-height: 320px;
                    max-width: 320px;
                    max-height: 320px;
                }
            }
            input[type="file"]{
                background-color: white;
                font-family: $primary-font;
                font-weight: 700;
            }
            h1{
                text-align: center;
                color:White;
                background-color: $c-theme;
                font-size: 25px;
            }
            button{
                margin-left:1%;
                margin-right:1%;
            }
            i{
                font-size: 16px;
            }
        }
    }   
}
.profile-image-file::-webkit-file-upload-button {
    margin:auto;
  border:none;
  font-family: $primary-font;
  font-size: 14px;
  background-color: black;
  border:1px solid black;
  color:White;
  font-weight: 700;
}

</style>