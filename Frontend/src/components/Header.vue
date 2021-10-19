<template>
    <div class="navbar">
        <div class="wrapper">
            <ul class="navbar-ul">
                <li class="navbar-li" >
                    <router-link class="router-link" to="/posts/">Home</router-link>
                </li>
                <li class="navbar-li">
                    <router-link class="router-link"  to="create">Create/Edit</router-link>
                </li>
                <li class="navbar-li">
                    <router-link class="router-link"  to="../profile">Your Profile</router-link>
                </li>
                <li class="navbar-li" @click="clearLocal()">
                    <router-link class="router-link"  to="login">Log out</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                menu:[
                    "Home",
                    "Create",
                    "Your Profile",
                    "About me",
                    "Log out"
                ]
            }
        },
        methods:{
            clearLocal(){
                localStorage.removeItem('token')
            },
        }
        
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
$primary-font: Quicksand;
$c-theme: black;
// Ha kicsuszik az egesz oldal akk margin auto arra az elemre ami nagyobb
.navbar{
    background-color: $c-theme;
    position:absolute;
    width:100%;
    margin:auto;
    top:0;
    
    z-index: 200;
    max-height: 90px;
}
.wrapper{
    color:white;
    margin:auto;
    max-width:1200px;
    .navbar-ul{
        padding-left:0;
        margin-top:0;
        font-weight: 800;
        font-family: $primary-font;
        min-height: 61px;
        justify-content: center;
        text-align:center;
        display:flex;
        width:100%;
        align-items: center;
        margin-bottom:0;
        .navbar-li{
        margin-inline:3%;
        list-style-type: none;        
            .router-link{
                color:white;
                text-decoration:none;
                &:visited{
                    color:white;
                }
            }
        }
    }
}
</style>