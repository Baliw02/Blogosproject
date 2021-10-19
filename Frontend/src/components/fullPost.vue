<template>
    <div>
        <Header />
        <div v-if="postsfromstore.length >= 1" class="wrapper">
            <div class="post-box" v-for="post in postsfromstore" :key="post.title">
                <div class="image-date">
                    <img class="post-img" :src="post.image" alt="">
                    <span class="post-date">{{new Date(post.date).toDateString()}}</span><br>
                    <p class="small-content">{{post.content}}</p>
                </div>
                <div class="post-content">
                    <h1>{{post.title}}</h1>
                    <pre class="long-content">{{post.longContent}}/</pre>
                </div>
            </div>
            <carousel :perPage="1">
                <slide>1</slide>            
                <slide>2</slide>            
            </carousel>
        </div>
        <div v-else class="error">
            <h2>404 Not found</h2>
        </div>
        <Footer />       
    </div>
</template>

<script>
//If nem egyezik a post._id a this.$store.state.postLinkkel akkor dobjon egy 404 et!
import Header from './Header'
import Footer from './Footer'
import {Carousel, Slide} from 'vue-carousel'
export default {
    data(){
        return{

        }
    },
    components:{
        Header,
        Footer,
        Carousel,
        Slide
    },
    async created(){
        this.$store.dispatch("getPost")
    },
    computed:{
        postsfromstore(){
            return this.$store.state.items.filter(post => {
                return post._id.match(this.$store.state.postLink)
            })
        },

    },

}


</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
$primary-font: Quicksand;
//Kell majd carousel kep is, kulon folderbe.
.wrapper{
    max-width:1400px;
    margin:auto;
    @media only screen and (max-width: 1150px){
        margin-top: -30px;
    }
    .post-box{
        position:relative;
        font-family: $primary-font;
        justify-content: center;
        text-align: center;
        display:flex;
        flex-wrap: wrap;
        .image-date{
            position:relative;
            max-width:1200px;
            .post-img{
                min-width:300px;
                max-width:1200px;
                object-fit: contain;
                object-position: center;
                @media only screen and(max-width: 1400px){
                    max-width: 100%;
                }
            }
            .post-date{
                font-size: 24px;
                color:white;
                background-color: rgba(0, 0, 0, 0.384);
                z-index: 100;
                position:absolute;
                text-align: left;
                display:block;
                left:0;
                top:0;
                margin:auto;
                padding:5px 5px;
            }            
            .small-content{
                text-align: left;
                width:100%;
                position:absolute;
                left:0;
                bottom:5px;
                word-break: break-all;
                max-inline-size: 1180px;
                padding:10px;
                color:white;
                background-color: rgba(0, 0, 0, 0.486);
                font-size:20px;
                margin-bottom:0;
            }
        }
        .post-content{
            color:rgb(31, 30, 30);
            min-width: 300px;
            max-width: 580px;
            font-size:16px;
            text-align: left;
            flex:45%;
            padding:10px 10px;
            @media only screen and(max-width: 1150px){
                max-width: 100%;
            }
            h1{
                width: fit-content;
                border-bottom: 2px solid rgb(31, 30, 30);
                font-weight: 700;
                margin-top: 0;
                font-size:30px;
                height: fit-content;
            }
            .long-content{
                white-space: pre-wrap;
                text-align: left;
                max-inline-size: 1200px;
                max-width: 1200px;
            }
        }
    }
}
    
</style>