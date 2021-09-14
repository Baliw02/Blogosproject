<template>
<div>
<Header />
    <div class="full-profile">
        <div class="user-data">
            <div class="userdata-left">
                <ul>
                    <li class="image">
                        <img :src="user.image" alt="">
                        <input class="profile-image-file" type="file" @change="handleImage">
                        <button @click="saveEditedData()">Save</button>
                    </li>
                    <h1>Datas:</h1>
                    <li class="datas">
                        Email: {{user.email}}
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </li>
                    <li class="datas">
                        Username: {{user.username}} 
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </li>
                    <hr>
                    <li @click="deleteUser(user)" class="delete-profile">Delete Profile</li>
                </ul>
            </div>
            <div class="userdata-right">
                <ul>
                    <li>
                        <h1>Informations:</h1>
                    </li>
                    <li>
                        <textarea rows="10" v-model="about_user"></textarea>
                    </li>
                    <li>
                        <p>asdasdasdasdasdasdasdasdasdasasdasdasdasdasda asdasdasdas asd asd asdasdas das</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Header from './Header'
import axios from 'axios'
// import PictureInput from 'vue-picture-input'

export default{
    components:{
        Header,
        // PictureInput
    },
    data(){
        return{
            user: [],
            about_user: '',
            remoteUrl: ''
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
    },
    methods:{
        saveEditedData(){
        const headers = {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }

            axios.put('http://localhost:8082/edit-user', {image: this.remoteUrl}, {headers: headers}).then((response) => {
                if(response.status == 200){
                    this.user.image = this.remoteUrl
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
    }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
@import './design.scss';
$primary-font: Quicksand;
.full-profile{
    display:flex;
    width: 100%;
    margin:auto;
    margin-top:-30px;
    max-width: 1200px;
    flex-wrap: wrap;
    ul{
        padding: 20px 10px;
        list-style: none;
        padding-left:0;
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
    .user-box{
        font-family: $primary-font;
        margin:auto;
        justify-content: center;
        display:flex;
        .userinfo-left{
            display:flex;
            background-color: $c-theme;
            color:white;
            flex:50%;
            width:100%;
            font-size: 20px;
            padding: 10px 10px;
            justify-content: center;
        }
        .userinfo-right{
            display:flex;
            font-size: 20px;
            justify-content: center;
            padding: 10px 10px;
            flex:50%;
            width:100%;
            background-color: white;
            border-bottom: 3px solid $c-theme;
            border-right: 3px solid $c-theme;
        }
    }
    .user-data{
        display:flex;
        font-family: $primary-font;
        margin:auto;
        justify-content: center;
        flex-wrap: wrap;
        .userdata-left{
            margin-top: 0px;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 20px solid black;
            display:flex;
            background-color: rgb(255, 255, 255);
            color:black;
            flex:50%;
            max-width:560px;
            font-size: 36px;
            justify-content: center;
            img{
                width: 400px;
                height: 400px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
            }
            input[type="file"]{
                background-color: white;
                font-family: $primary-font;
                font-weight: 700;
            }
            #file-upload-button{
                color:white;
            }
            h1{
                text-align: center;
                color:White;
                background-color: $c-theme;
                font-size: 25px;
            }
        }
        .userdata-right{
            display:flex;
            align-items: center;
            justify-content: left;
            flex:50%;
            max-width:600px;
            background-color: white;
            h1{
                display:block;
                width:100%;
            }
            textarea{
                width:100%;
                margin-top:1%;
                max-width:600px;
            }
            
        }
    }   
}
.profile-image-file::-webkit-file-upload-button {
  border:none;
  font-family: $primary-font;
  font-size: 14px;
  background-color: black;
  border:1px solid black;
  color:White;
  font-weight: 700;
}

</style>