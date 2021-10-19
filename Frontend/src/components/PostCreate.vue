<template>
    <div class="Posts-Create">
    <Header v-if="screenW >= 1200" />
    <Sidebar v-if="screenW < 1200 "/>
        <div class="wrapper">
            Active Posts: {{postsfromstore.length}}
            <div class="create-flex-box">
                <div v-once class="send-post">
                    <div class="create-input-box">
                        <h3>Post title:</h3>
                        <input class="input-create-post-title" placeholder="Post Title" v-model="title">
                    </div>
                    <div class="create-input-box" >
                        <h3 class="image-dropdown">Image link:</h3>
                        <input class="input-create-image" type="file" ref="file" placeholder="Image link" @change="handleImage">
                    </div>
                    <div class="create-input-box">
                        <h3>Short content:</h3>
                        <textarea cols="79" rows="5" class="input-create-post-content" placeholder="Post Content" v-model="content"/>
                    </div>
                    <div class="create-input-box">
                        <h3>Long content:</h3>
                        <textarea rows="15" class="input-create-post-content" placeholder="Post Content" v-model="longContent"/>
                    </div>
                    <input class="input-create-post-link"  :class="{error: isError}" placeholder="Post Link" v-model="link">
                    <ul class="errors-ul">
                        <li v-for="error in errorMessage" :key="error">
                            * {{error}}
                        </li>
                    </ul>
                    <div class="radio-buttons"> 
                        <input type="checkbox" value="carousel" v-model="carousel">
                        <label>Carousel</label><br>
                        <input type="checkbox" value="special" v-model="special">
                        <label>Special</label><br>
                    </div>
                </div>
                <div class="preview-post">
                    <div class="preview-box">
                        <span class="preview-box-uploader"><strong>{{uploader}}</strong></span>
                        <img class="preview-box-img" :src="remoteUrl">
                        <h1 class="preview-box-title">{{title}}</h1>
                        <span class="preview-box-date">{{new Date().toDateString()}}</span>
                        <p class="preview-box-content">{{content}}</p>     
                    </div>

                </div>
            </div>
            <button class="post-boxes-button-create" @click="createPost()">Create Post</button>
                <div v-for="(post, index) in postsfromstore" :key="post.image + post.content + post._id + post.title + post.date + post.link + post.comments" class="post-boxes">
                    <div class="marks">
                        <ul v-if="post.carousel || post.special">
                            <li v-if="post.carousel">Carousel</li>
                            <li v-if="post.special">Special</li>
                        </ul>
                    </div>
                    <!-- <h3 style="width: 20%; margin:0; display:inline;">Status:</h3><input type="checkbox" v-model="activePost" value="true"> {{activePost}} -->
                    <span class="post-boxes-uploader"><strong>{{post.uploader}}</strong></span>
                    <!-- Csak akkor lehessen editelni ha a post uploader megegyezik a most lekert usernameval -->
                    <a target="_blank" :href="post.link"><img v-bind:href="post.link" class="post-boxes-img" v-if="post.image" :src="post.image"></a>
                    <input class="post-boxes-edit-title" v-if="isSelected(post) && username == post.uploader" :placeholder="post.title" v-model="edited_title">
                    <textarea class="post-boxes-edit-content" rows="3" v-if="isSelected(post) && username == post.uploader" :placeholder="post.content" v-model="edited_content"/>
                    <h1 class="post-boxes-title" v-else><a target="_blank" :href="post.link">{{post.title}}</a></h1>
                    <span class="post-boxes-date">{{new Date(post.date).toDateString()}}</span>
                    <p v-if="!isSelected(post) || (isSelected(post) && username != post.uploader)" class="post-boxes-content">{{post.content}}</p>
                    <span class="post-boxes-date"></span>
                        <div class="likes">
                            <i class="fa fa-thumbs-up" aria-hidden="true"></i>{{post.likes}}
                        </div>
                    <button class="post-boxes-button-showcomment" @click="isSelected(post) ? unselect() : selectMethod(post) ">Comments</button>
                    <button v-if="post.uploader === username" class="post-boxes-button-editor edit" @click="isSelected(post) ? unselect() : selectMethod(post)"><span class="post-boxes-button-text"> {{ isSelected(post) ? 'Close' : 'Edit'}} </span></button>
                    <button v-if="post.uploader === username"  class="post-boxes-button-editor delete" @click="isSelected(post) ? updatePost(post) : removePost(post, index)"><span>{{isSelected(post) ? 'Save' : 'Delete'}}</span>
                    </button>
                    <div v-if="isSelected(post)" class="comment-box">
                        <input class="input-create-post-tags" placeholder="Write something" v-model="comment">
                        <h3>Comments:</h3>
                        <ul v-for="(comment, iter) in post.comments" :key="comment.profile + comment.message" class="comment-ul">
                                <li><strong>{{comment.profile}}</strong> <br> {{comment.message}} <i v-if="comment.profile === username || post.uploader == username" @click="removeComment(post, iter, i)" class="fa fa-trash" aria-hidden="true"></i><hr></li>
                        </ul>
                        <button class="post-boxes-button-comment" @click="postComment(post)">Send</button>
                    </div>
                </div>
        </div>
        <Footer v-once class="footer" />
    </div>
</template>


<script>
import {LOCAL_URI} from '../store/store'
import axios from 'axios'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default {
    name:'PostSection',
    components:{
        Header,
        Footer,
        Sidebar
    },
    data(){
        return{
            isError:false,
            errorMessage:[],
            items: [],
            edited_img: '',
            edited_title: '',
            edited_content: '',
            selected: {},
            route: '',
            token: '',
            username: '',
            comment: '',
            comments:[],
            activePost:null,
            selectedFile: null,
            screenW: 0,
            remoteUrl: '',
            link:'',
            //Kepekre
            images: [],
        }   
    },

    methods:{
        formatText(){
            longContent.split('\n').forEach(item=>arr.push(`<p>${item.trim()}</p>`));
        },
        createPost(){
            this.$store.dispatch('createPost')
            location.reload()
        },
        handleResize(){
            this.screenW = window.innerWidth
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
            axios.post(LOCAL_URI + 'images', {image})
            .then((response) => {
                this.remoteUrl = response.data.url
                this.newimage = this.remoteUrl 
                if(response.status != 200){
                    this.errorMessage = "Image is not uploaded!"
                }
                
            })
        },

        async removePost(post, index){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }
            axios.delete(LOCAL_URI + 'posts/' + post._id, {headers: headers}).then(response => {
                console.log(response.status)
                this.postsfromstore.splice(index, 1)
            })
        },
        async selectMethod(post){
            this.selected = post
        },
        isSelected(post){
            return post._id === this.selected._id
        },
        unselect(){
            this.selected = {}
            this.edited_content = ""
        },
        async updatePost(post , i){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }

            if(this.edited_title.length > 0 && this.edited_content.length > 0){
                const response = axios.put(LOCAL_URI + 'posts/' + post._id, {
                    title: this.edited_title,
                    content: this.edited_content,
                }, 
                {headers:headers})

                this.postsfromstore[i] = response.data
                this.unselect()
                location.reload()
            }
        },
        async removeComment(post, index, postIndex){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token'),
                'index': index,
            }
            axios.delete(LOCAL_URI + 'posts/' + post._id + '/comments', {headers:headers}).then((res) => {
                console.log("Comment is deleted" + index)
                console.log(res.status)
                if(res.status == 200){
                    this.postsfromstore[postIndex].comments.splice(index, 1)
                }
            })
        },
        async postComment(post){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }
            const comment = [{
                "profile": this.username,
                "message": this.comment
            }]
            axios.post(LOCAL_URI + 'posts/' + post._id + '/comments', {comments: comment,}, {headers:headers})
            location.reload()
        },
    },
    created(){
        this.$store.dispatch("getPost")

        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        if(localStorage.getItem('token') === null){
            this.$router.push('login')
        }
        else{
            this.token = localStorage.getItem('token')
        }
        if(localStorage.getItem('token') != null){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }
            axios.get(LOCAL_URI + 'activeuser', {headers: headers}) 
            .then(response => {
                this.username = response.data.user.username
                this.uploader = response.data.user.username
            })
        }
        this.route = (this.$router.currentRoute.path)
    },
    computed:{
        postsfromstore(){
            return this.$store.state.items.filter((post) => {
                if(post.uploader === this.username){
                    return post.uploader.match(this.username)
                }
            })
        },

        title:{
            get(){return this.$store.state.newPost.title},
            set(value){this.$store.commit('newPostTitle', value)}
        },
        newimage:{
            get(){return this.$store.state.newPost.image},
            set(value){
                this.$store.commit('newPostImage', value)
            }
        },
        content:{
            get(){return this.$store.state.newPost.content},
            set(value){this.$store.commit('newPostContent', value)}
        },
        uploader:{
            get(){return this.$store.state.newPost.uploader},
            set(value){this.$store.commit('newPostUploader', value)}
        },
        // carousel: this.carousel, special: this.special,
        carousel:{
            get(){return this.$store.state.newPost.carousel},
            set(value){this.$store.commit('newPostCarousel', value)}
        },
        special:{
            get(){return this.$store.state.newPost.special},
            set(value){this.$store.commit('newPostSpecial', value)}
        },
        longContent:{
            get(){return this.$store.state.longContent},
            set(value){this.$store.commit('longContent', value)}
        }
    }

}
</script>

<style scoped lang="scss">
@import './common.scss';

.errors-ul{
    width:fit-content;
    margin:auto;
    text-align: left;
    color:red;
    list-style-type: none;
    padding-left:0;
    font-size: 14px;
}
</style>