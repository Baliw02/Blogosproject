<template>
<div class="Posts-Create">
    <Header />
    <div class="wrapper">
        Active Posts: {{filteredPosts.length}}

        <div class="create-flex-box">
            <div class="send-post">
                <div class="create-input-box">
                    <h3>Post title:</h3>
                    <input
                        class="input-create-post-title" 
                        placeholder="Post Title"
                        v-model="create_title">
                </div>
                <div class="create-input-box">
                    <h3 class="image-dropdown">Image link:</h3>
                    <input
                        class="input-create-image" 
                        type="file"
                        ref="file"
                        placeholder="Image link"
                        @change="handleImage"
                        >
                </div>
                <div class="create-input-box">
                    <h3>Post content:</h3>
                    <textarea
                        cols="79"
                        rows="15"
                        class="input-create-post-content" 
                        placeholder="Post Content"
                        v-model="create_content"/>
                </div>
                <input
                    class="input-create-post-link" 
                    :class="{error: isError}" 
                    placeholder="Post Link"
                    v-model="create_link">
                <input
                    class="input-create-post-tags"
                    :class="{error: isError}" 
                    placeholder="Category"
                    v-model="create_category">
                    <span v-if="isError" class="error-message">{{errorMessage}}</span>
                <div class="radio-buttons">
                    <input type="checkbox" value="carousel" v-model="carousel">
                    <label>Carousel</label><br>
                    <input type="checkbox" value="special" v-model="special">
                    <label>Special</label><br>
                </div>
            </div>
            <div class="preview-post">
                <div class="preview-box">
                    <span class="preview-box-uploader"><strong>{{username}}</strong></span>
                    <img class="preview-box-img" :src="remoteUrl">
                    <h1 class="preview-box-title">{{create_title}}</h1>
                    <span class="preview-box-date">{{new Date().toDateString()}}</span>
                    <p class="preview-box-content">{{create_content}}</p>     
                </div>

            </div>
            </div>
            <button class="post-boxes-button-create" @click="sendPost()">Create Post</button>
            <div v-for="(post, index) in filteredPosts" :key="post.image + post.content + post._id + post.title + post.date + post.link + post.comments" class="post-boxes">
                <div class="marks">
                    <ul v-if="post.carousel || post.special">
                        <li v-if="post.carousel">Carousel</li>
                        <li v-if="post.special">Special</li>
                    </ul>
                </div>

                <!-- <h3 style="width: 20%; margin:0; display:inline;">Status:</h3><input type="checkbox" v-model="activePost" value="true"> {{activePost}} -->
                <span class="post-boxes-uploader"><strong>{{post.uploader}}</strong></span>
                <!-- Csak akkor lehessen editelni ha a post uploader megegyezik a most lekert usernameval -->
                <a target="_blank" :href="post.link">
                    <img v-bind:href="post.link" class="post-boxes-img" v-if="post.image" :src="post.image">
                </a>
                <input class="input-edit-image" v-if="isSelected(post) && username == post.uploader" :placeholder="create_image" v-model="edited_img">
                <input class="post-boxes-edit-title" v-if="isSelected(post) && username == post.uploader" :placeholder="post.title" v-model="edited_title">
                <textarea class="post-boxes-edit-content" rows="3" v-if="isSelected(post) && username == post.uploader" :placeholder="post.content" v-model="edited_content"/>
                <h1 class="post-boxes-title" v-else>
                    <a target="_blank" :href="post.link">{{post.title}}</a>
                </h1>
                <span class="post-boxes-date">{{new Date(post.date).toDateString()}}</span>
                <p v-if="!isSelected(post) || (isSelected(post) && username != post.uploader)" class="post-boxes-content">{{post.content}}</p>
                <span class="post-boxes-date"></span>
                <div class="likes">
                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    {{post.likes}}
                </div>
                <button class="post-boxes-button-showcomment" @click="isSelected(post) ? unselect() : selectMethod(post) ">Comments</button>
                <button v-if="post.uploader === username" class="post-boxes-button-editor edit" @click="isSelected(post) ? unselect() : selectMethod(post)">
                    <span class="post-boxes-button-text"> {{ isSelected(post) ? 'Close' : 'Edit'}} </span>
                </button>
                <button v-if="post.uploader === username"  class="post-boxes-button-editor delete" @click="isSelected(post) ? updatePost(post) : removePost(post, index)">
                    <span>{{isSelected(post) ? 'Save' : 'Delete'}}</span>
                </button>
                <div v-if="isSelected(post)" class="comment-box">
                    <input
                        class="input-create-post-tags" 
                        :class="{error: isError}" 
                        placeholder="Write something"
                        v-model="comment">
                    <h3>Comments:</h3>
                <ul v-for="(comment, iter) in post.comments" :key="comment.profile + comment.message" class="comment-ul">
                    <li v-if="iter < 12">{{comment.profile}} <br> {{comment.message}}<button @click="removeComment(post, iter)"></button></li>
                </ul>
                <button class="post-boxes-button-comment" @click="postComment(post)">Send</button>
            </div>
        </div>
    </div>
    <Footer class="footer" />
</div>
</template>

<script>
import axios from 'axios'
import Header from './Header'
import Footer from './Footer'

export default {
    name:'PostSection',
    components:{
        Header,
        Footer
    },
    data(){
        return{
            isError:false,
            errorMessage:'',
            items: [],
            create_title: '',
            create_content: '',
            create_image: 'https://source.unsplash.com/1600x900/?nature,water',
            create_link: '',
            create_category: '',
            edited_img: '',
            edited_title: '',
            edited_content: '',
            selected: {},
            route: '',
            token: '',
            username: '',
            comment: '',
            comments:[],
            limit: 1,
            special: false,
            carousel: false,
            activePost:null,
            selectedFile: null,
            //For Style


            //Kepekre
            image:'',
            remoteUrl: '',
            images: []

        }
    },
    async mounted(){
        const headers = {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
        axios.get('http://localhost:8082/posts/', {headers: headers}).then(response => {
            response.data.reverse()
            this.items = response.data


        })
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
                console.log(response.data)
            })
        },

        async sendPost(){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }

        axios.post('http://localhost:8082/posts/create/', { title: this.create_title, content: this.create_content, image: this.remoteUrl, uploader: this.username, link: this.create_link, carousel: this.carousel, special: this.special, category: this.create_category}, {headers: headers})
        .then(response => {
            if(response.status == 200){
                location.reload()
            }
        })
        },
        async removePost(post, index){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token')
            }

        axios.delete('http://localhost:8082/posts/' + post._id, {headers: headers})
            this.items.splice(index, 1)
        },
        async selectMethod(post){
            this.selected = post
        },
        // async selectComment(comm){
        //     this.selected.comments = comm.comments
        // },
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
                const response = axios.put('http://localhost:8082/posts/' + post._id, {
                    image: this.edited_img,
                    title: this.edited_title,
                    content: this.edited_content,
                }, 
                {headers:headers})

                this.items[i] = response.data
                this.unselect()
                location.reload()
            }
        },
        async removeComment(post, index){
            const headers = {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token'),
                'index': index,
            }
            axios.delete('http://localhost:8082/posts/' + post._id + '/comments', {headers:headers}).then((res) => {
                console.log("Comment is deleted" + index)
                console.log(res.status)
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
            axios.post('http://localhost:8082/posts/' + post._id + '/comments', {comments: comment,}, {headers:headers})
            location.reload()
        },
    },
    created(){
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
            axios.get('http://localhost:8082/activeuser', {headers: headers}) 
            .then(response => {
                this.username = response.data.user.username
            })
        }
        this.route = (this.$router.currentRoute.path)
    },
    computed:{
        filteredPosts(){
            return this.items.filter((posts) => {
                if(posts.uploader === this.username){
                    return posts.uploader.match(this.username)
                }
            })
        }
    }

}
</script>

<style scoped lang="scss">
@import './design.scss';
</style>