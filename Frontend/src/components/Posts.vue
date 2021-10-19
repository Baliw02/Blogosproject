<template>
<div class="full-post-section">
<Header v-once v-if="screenW >= 1200" />
<Sidebar v-once v-if="screenW < 1200 "/>
<keep-alive>
    <carousel :perPage="1" :centerMode="false" :autoplay="true" :loop="true" :autoplayTimeout="15000" class="carousel" :paginationEnabled="true" :paginationPadding="2">
        <slide v-for="carousel_post in carouselFilter" :key="carousel_post.title">
                <a target="_blank" :href="carousel_post.link"><img rel="preload" alt="post-image" class="carousel-image" :src="carousel_post.image"></a>
                <div class="carousel-text">
                <p class="carousel-text-date">{{new Date(carousel_post.date).toDateString()}}</p>
                <a class="carousel-text-title" target="_blank" :href="carousel_post.link"><h2 >{{carousel_post.title}}</h2></a>
                <p class="carousel-text-content">{{carousel_post.content}}</p>
                </div>
        </slide>
    </carousel>
</keep-alive>
<div v-if="specialFilter.length >= 1" class="special-slider">
    <div class="slider-wrapper">
    <carousel :mouseDrag="true" :autoplay="true" :loop="true" :touchDrag="true" :scrollPerPage="false" :perPage="perpage" :paginationEnabled="false" :navigationEnabled="false" :navigationClickTargetSize="8" :navigateTo="carouselIndex">
    <slide v-for="(specialpost, i) in specialFilter" :key="specialpost.title + specialpost.content + specialpost.uploader + specialpost.image">
    <div class="post-boxes">
        <span class="post-boxes-uploader"><strong>{{specialpost.uploader}}</strong></span>
        <!-- Csak akkor lehessen editelni ha a post uploader megegyezik a most lekert usernameval -->
        <a target="_blank" :href="specialpost.link"><img alt="post-image" v-bind:href="specialpost.link" class="post-boxes-img" v-if="specialpost.image" :src="specialpost.image"></a>
        <h1 class="post-boxes-title"><a target="_blank" :href="specialpost.link">{{specialpost.title}}</a></h1>
        <span class="post-boxes-date">{{new Date(specialpost.date).toDateString()}}</span>
        <p class="post-boxes-content">{{specialpost.content}}</p>
        <div class="likes">
            <i :class="{liked: specialpost.likedBy.includes(username)}" @click="liking(specialpost, i)" class="fa fa-thumbs-up" aria-hidden="true"></i>
            <span :class="{liked: specialpost.likedBy.includes(username)}">{{specialpost.likes}}</span>
        </div> 
        </div>
    </slide>   
    </carousel>
    </div>
</div>
<!-- <input type="text" v-model="test">
{{test}} -->
<div v-if="postsfromstore.length >= 1" class="outter-wrapper">
    <h1>Posts</h1>
    <input class="search-in-post" type="text" placeholder="Search Post" v-model="search"><br>
    <!-- <button @click="showCategories()">Categories</button> -->
    <!-- <div class="category" :class="{categoryshow : true}">
        <h1>Categories:</h1>
        <ul>
            <li v-for="(selecter, index) in items" @click="setActiveCat(index)" :class="{active: index == activeCat}" :key="selecter.category">{{selecter.category}}</li>
        </ul>
    </div> -->
    <br>
<div v-if="searchFilter.length >= 1" class="wrapper">
    <div v-for="(post, i) in searchFilter" :key="post.image + post.content + post._id + post.title + post.date + post.link + post.comments" class="post-boxes">
        <div class="marks">
            <ul v-if="post.carousel || post.special">
                <li v-if="post.carousel">Carousel</li>
                <li v-if="post.special">Special</li>
            </ul>
        </div>
        <!-- <h3 style="width: 20%; margin:0; display:inline;">Status:</h3><input type="checkbox" v-model="activePost" value="true"> {{activePost}} -->
        <span class="post-boxes-uploader"><strong>{{post.uploader}}</strong></span>
        <!-- Csak akkor lehessen editelni ha a post uploader megegyezik a most lekert usernameval -->
        <router-link :to="'/posts/' + postLink"><img @click="getPostUrl(post)" class="post-boxes-img" v-if="post.image" alt="post-image" :src="post.image"></router-link>
        <h1 class="post-boxes-title"><a target="_blank" :href="postLink" @click="getPostUrl(post)">{{post.title}}</a></h1>
        <span class="post-boxes-date">{{new Date(post.date).toDateString()}}</span>
        <p class="post-boxes-content">{{post.content}}</p>
        <div class="likes">
            <i :class="{liked: post.likedBy.includes(username)}" @click="liking(post, i)" class="fa fa-thumbs-up" aria-hidden="true"></i>
            <span :class="{liked: post.likedBy.includes(username)}">{{post.likes}}</span>
        </div>
        <button class="post-boxes-button-showcomment" @click="isSelected(post) ? unselect() : selectMethod(post) ">Comments</button>
        <transition name="slide-down">
        <div v-if="isSelected(post)" class="comment-box">
            <input
                class="input-create-post-comment" 
                :class="{error: isError}" 
                placeholder="Write something"
                v-model="comment">
            <h3>Comments:</h3>
        <ul v-for="(comment, iter) in post.comments" :key="comment.profile + comment.message" class="comment-ul">
                <li><strong>{{comment.profile}}</strong> <br> {{comment.message}} <i v-if="comment.profile === username" @click="removeComment(post, iter, i)" class="fa fa-trash" aria-hidden="true"></i><hr></li>
        </ul>
        <button class="post-boxes-button-comment" @click="postComment(post, i)">Send</button>
        </div>
        </transition>
    </div>

</div>
</div>
<div v-else class="no-post">
    <h1>We dont have post! :(</h1>
</div>
<Footer />
</div>
</template>
<script>
const headers = {
    'Content-Type': 'application/json',
    'token': localStorage.getItem('token'),
    'index': 0,
}
import axios from 'axios'
import Header from './Header'
import {Carousel, Slide} from 'vue-carousel'
import Footer from './Footer'
import Sidebar from './Sidebar'
import {mapGetters} from 'vuex'
import {LOCAL_URI} from '../store/store'


export default {
    name:"Posts",
    components:{
        Header,
        Carousel,
        Slide,
        Footer,
        Sidebar
    },
    data(){
        return{
            postLink: 'null',
            carouselIndex:0,
            activeCat: 0,
            selectedlist:'',
            selected: {},
            route: '',
            username: '',
            comment: '',
            comments:[],
            activePost:null,
            categories: false,
            search: '',
            screenW: 0,
            perpage: 0,
            isError: ''
        }
    },
    methods:{
        showCategories(){
            if(!this.categories){
                this.categories = true
            }
            else{
                this.categories = false
            }
        },
        async selectMethod(post){
            this.selected = post
        },
        isSelected(post){
            return post._id === this.selected._id
        },
        unselect(){
            this.selected = {}
        },
        async setActiveCat(index){
            this.activeCat = index
        },
        async postComment(post, index){
            const comment = [{
                profile: this.username,
                message: this.comment
            }]
            headers.index = index
            axios.post(LOCAL_URI + 'posts/' + post._id + '/comments', {comments: comment,}, {headers:headers}).then((res) => {
                if(res.status == 200){
                    this.postsfromstore[index].comments.push({profile:this.username, message: this.comment})
                    this.comment = null
                }
            })
        },
        async removeComment(post, index, postIndex){
            headers.index = index
            axios.delete(LOCAL_URI + 'posts/' + post._id + '/comments', {headers:headers}).then((res) => {
                console.log("Comment is deleted" + index)
                console.log(res.status)
                if(res.status == 200){
                    this.postsfromstore[postIndex].comments.splice(index, 1)
                }
            })
        },
        async logOut(){
            localStorage.removeItem('token')
            this.$router.push('login')
        },
        
        async liking(post, index){
            axios.post(LOCAL_URI + 'posts/' + post._id + '/likes', {likedBy: this.username}, {headers: headers}).then((response) => {
                this.postsfromstore.likes = response.data.likes
                if(response.data.title == "liked"){
                    console.log("liked")
                    this.postsfromstore[index].likedBy.push(this.username)
                    this.postsfromstore[index].likes++
                }
                else{
                    console.log("unliked")
                    this.postsfromstore[index].likedBy.splice(this.username)
                    this.postsfromstore[index].likes--
                }
            })
        },
        async getPostUrl(post){
            axios.get(LOCAL_URI + 'posts/' + post._id, {headers:headers})
            this.postLink = post._id
            this.$store.state.postLink = this.postLink
            
        },
        handleResize(){
            this.screenW = window.innerWidth
            if(this.screenW >= 1366) {
                this.perpage = 3
            }
            else if(this.screenW <= 1280 && this.screenW > 780){
                this.perpage = 2
            }
            else if(this.screenW <= 780){
                this.perpage = 1
            }
        }

    },
    async created(){
        //Ez lefuttatja a sima actiont
        this.$store.dispatch("getPost")

        if(localStorage.getItem('token') === null){
            this.$router.push('login')
        }
        if(localStorage.getItem('token') != null){
            axios.get(LOCAL_URI + 'activeuser/', {headers: headers}) 
            .then(response => {
                this.username = response.data.user.username
            })
        }
        this.route = (this.$router.currentRoute.path)

        window.addEventListener('resize', this.handleResize);
            this.handleResize();
    },    

    computed:{
        postsfromstore(){
            return this.$store.state.items
        },
        ...mapGetters({
            getterSearch: 'searchFilter',
            getterCarousel: 'carouselFilter',
            getterSpecial: 'specialFilter'
        }),
        searchFilter(){
            return this.getterSearch(this.search)       
        },
        carouselFilter(){
            return this.getterCarousel
        },
        specialFilter(){
            return this.getterSpecial
        }
    },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
@import './common.scss';

$primary-font: Quicksand;
.no-post{
    height: 100vh;
    position:relative;
    h1{
        position:absolute;
        top:50%;
        bottom:0;
        left:0;
        right:0;
        text-align: center;
        font-family: $primary-font;
        font-size: 30px;
    }
}

@keyframes fadeIn{
    from{
        opacity:0; 
        transform: translateY(-10%);
    }
    to{
        transform: translateY(0%);
        opacity:1;
    }
}

.comment-bounce-enter-active{
    animation: bounce .3s;
}
.comment-bounce-leave-active{
    animation: bounce .3s reverse;
}

.slide-down-enter-active{
    animation: fadeIn .3s;
}
.slide-down-leave-active{
    animation: fadeIn .3s reverse;
}
.special-slider{
    position:relative;
    display:block;
    width:100%;
    
    background-color:rgba(21, 71, 119, 0.274);
    margin:auto;
    font-family: $primary-font;
    .carousel-slider-left{
        padding: 10px 8px;
        text-align: center;
        background-color:rgba(0, 0, 0, 0.719);
        font-size:30px;
        position:absolute;
        top:45%;
        left:55px;
        margin:auto;
    }
    .carousel-slider-right{
        padding: 10px 8px;
        text-align: center;
        background-color:rgba(0, 0, 0, 0.719);
        font-size:30px;
        position:absolute;
        top:45%;
        right:55px;
        margin:auto;
    }
    .slider-wrapper{
        text-align: center;
        max-width:1200px;
        margin:auto;
        .post-boxes{
            text-align: left;
            display:inline-block;
            padding:20px 20px;
            position:relative;
            margin:auto;
            width:100%;
            margin-inline-end: 1%;
            margin-inline-start: 1%;
            height: auto;
            max-height: 397px;
            min-height: 397px;
            margin-top:20px;
            margin-bottom:20px;
            background-color: aliceblue;
            text-align: left;
            max-width:336px;
            height: auto;
            -webkit-box-shadow: 0px 0px 13px 4px rgba(0,0,0,0.33); 
            box-shadow: 0px 0px 13px 4px rgba(0,0,0,0.33);
            @media only screen and (max-width:400px){
                max-height: 280px;
                max-width: 250px;
                margin-inline-end:2%;
            }
            .post-boxes-uploader{
                position:absolute;
                top:0px;
                right:20px;
                margin:auto;
                z-index: 98;
                font-size: 16px;
            }
            .post-boxes-date{
                margin:0;
                position:absolute;
                top:0px;
            }
            .post-boxes-img{
                text-align: center;
                max-width:100%;
                max-height: 250px;
                min-height: 250px;
                width:100%;
                height: 100%;
                object-position: center;
                object-fit: cover;
            }
            .post-boxes-title {
                width:fit-content;
                max-width:100%;
                margin-top: 0;
                margin-bottom: 1%;
                padding-bottom:1%;
                max-inline-size: 100%;
                word-break: break-all;
                height: fit-content;
                text-align: left;
                font-size: 24px;
                font-family: $primary-font;
                font-weight: 600;
                border-bottom: 2px solid $c-theme;
                a{
                    text-decoration: none;
                    color:black;
                    &:visited{
                        color:black;
                    }
                }
            }
            .post-boxes-content{
                inline-size: 100%;
                word-break: break-all;
                display:block;
                font-size: 16px;
                font-family: $primary-font;
                padding:15px 0px;
                margin-top:-2px;
                padding-top:0;
            }
            .likes{
                font-weight:600;
                font-size:20px;
                bottom:15px;
                position:absolute;
            }
            .liked{
                color:red;
            }
        }
    }
}




.input-create-post-comment{
    font-family: $primary-font;
    border-radius: 8px;
    border:1px solid rgb(219, 219, 219);
    width:70%;
    &:focus{
        outline: none;
    }
    &::placeholder{
        font-size: 16px;
    }
}
.radio-buttons{
    text-align:center;
}
//Itt igy kell hoverozni
// h3:hover + input{
//     visibility:visible;
//     display:block;
// }
button{
    font-weight: 700;
    padding:7px 7px;
    border:none;
    font-family: $primary-font;
    background-color: $c-theme;
    color:white;
    font-size: 14px;
}
textarea::placeholder{
    font-family: $primary-font;
    font-weight: 400;
    font-size: 15px;
}
.router-link{
    margin-left:2%;
    font-weight: 700;
    padding:7px 7px;
    border:none;
    font-family: $primary-font;
    background-color: $c-theme;
    color:white;
    font-size: 14px;    
    text-decoration: none;

}
.carousel{
    text-align: center;
    justify-content: center;
    width:100%;
    max-width:1280px;
    margin:auto;
    margin-top:-29px;
    @media only screen and(min-width: 1280px){
        max-width:1920px;
    }
}
.carousel-text{
    text-align:left;
    width:100%;
    display:block;
    position:absolute;
    z-index: 50;
    color:white;
    font-size:24px;
    font-family: $primary-font;
    margin:auto;
    bottom:5px;
    background-color: rgba(0, 0, 0, 0.459);
    padding: 15px 0px;
    .carousel-text-date{
        margin:0;
    }
    .carousel-text-title{
        margin:0;
        color:white;
        text-decoration: none;
        h2{
            margin-top:0px;
            margin-left:20px;
            font-size:36px;
            margin-bottom:0px;
        }
    }
    .carousel-text-content{
        margin:0;
        padding: 1px 30px;
        font-size:18px;
    }
}
//Kisebb kijelzonel levenni a mgassagot
.carousel-image{
    position:relative;
    width:100%;
    max-height: 650px;
    max-width: 1920px;
    height: 100%;
    object-fit: cover;
    object-position: center;
    @media only screen and (max-width:1366px){
        max-height: 650px;
    }
    @media only screen and (max-width:1280px){
        max-height: 600px;
    }
    @media only screen and (max-width: 600px){
        max-height: 500px;
    }
    @media only screen and (max-width:450px){
        max-height: 350px;
    }
}
.search-in-post{
    float:right;
    display:block;
    @media only screen and(max-width: 800px){
        float:none;
        margin:auto;
    }
}
.category{
    left:0;
    z-index: 50;
    text-align: center;
    position:absolute;
    padding: 10px 10px;
    color:rgb(122, 122, 122);
    background-color: rgb(230, 230, 230);
    font-family: $primary-font;
    max-width:230px;
    width:100%;
    height: 600px;
    border: 2px solid rgba(95, 95, 95, 0.315);
    border-left:none;
    border-right: none;
    transition: all .2s linear;
    transform: translateX(-100%);
    @media only screen and(max-width:1700px){
       top:71.5%;
    }

    h1{
        font-size: 24px;
        margin:0;
        padding:5px 0px;
        width:100%;
    }
    ul{
        text-align: left;
        list-style: none;
        padding:10px 10px;
        li{
            margin-top:1%;
            font-weight: 700;
            padding:5px 5px;
            font-size: 18px;
            &:hover{
                cursor:pointer;
                color:rgb(0, 0, 0);
            }
            &.active{
                color:black;
                background-color:rgba(122, 122, 122, 0.445);
            }
        }
    }
}
.category.categoryshow{
    visibility: visible;
    transform: translateX(0%);
}
.outter-wrapper{
    font-family: $primary-font;
    padding:40px 30px;
    position:relative;
    @media only screen and(max-width: 400px){
        padding:0;
    }
    button{
        font-size: 20px;
    }
    input{
        right: 30px;
        color:White;
        font-weight: 500;
        padding: 5px 5px;
        font-size: 20px;
        outline: none;
        border:2px solid rgb(206, 206, 206);
        background-color: rgb(184, 184, 184);
        &::placeholder{
            font-weight: 500;
            font-family: $primary-font;
            color:rgb(255, 255, 255);
        }
    }
    h1{
        width:fit-content;
        margin:auto;
    }
}
.liked{
    color:rgb(255, 0, 0);
}

</style>