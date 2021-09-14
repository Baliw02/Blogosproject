<template>
    <div class="sidebar-bar">
        <transition name="iconTran">
            <i v-if="!show" @click="showSideBar()" class="fa fa-bars" aria-hidden="true"></i>
            <i v-else @click="show = false" class="fa fa-times" aria-hidden="true"></i>
        </transition>
        <transition name="fadein">
        <div v-if="show" class="sidebar-box">
            <ul class="sidebar-ul">
                <li><router-link to='posts'>Home</router-link></li>
                <li><router-link to='create'>Create/Edit</router-link></li>
                <li><router-link to='profile'>Your Profile</router-link></li>
                <li><router-link to='login'>Log out</router-link></li>
            </ul>
        </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                show: false
            }
        },
        methods:{
            showSideBar(){
                if(!this.show){
                    this.show = true
                }
                else{
                    this.show = false
                }
            }
        }   
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
@import './design.scss';
$primary-font: Quicksand;
.fadein-enter-active{
    animation: fadeIn .2s;
}
.fadein-leave-active{
    animation: fadeIn .2s reverse; 
}


.sidebar-bar{
    z-index: 200;
    margin: auto;
    max-height: 61px;
    min-height: 61px;
    background-color: black;
    position:fixed;
    top:0;
    display:flex;
    width:100%;
    justify-content: left;
    align-items: center;
    i{
        padding:0px 30px;
        color:white;
        font-size: 30px;
        font-weight: 5;
    }
    .sidebar-box{
        transition: all .1s linear;
        display:block;
        position:fixed;
        top:61px;
        background-color: black;
        color:white;
        z-index: 201;
        height: 100%;
        ul{
            text-align: left;
            font-weight: 600;
            text-align: left;
            padding-left:10px;
            padding:0px 100px;
            list-style-type: none;
            font-size: 16px;
            font-family: $primary-font;            
            li{
                margin-bottom:1%;
                margin-top:1%;
            }
            li a{
                text-decoration: none;
                color:white;
            }
        }
    }

@keyframes fadeIn{
    from {
        transform: translateX(-100%);
    }
    to{
        transform: translateX(0);
    }
}
}
</style>