import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const PORT = 8082
export const LOCAL_URI = 'http://localhost:' + PORT + '/'

const headers = {
    'Content-Type': 'application/json',
    'token': localStorage.getItem('token')
}

export const store = new Vuex.Store({
    state:{
        postLink:null,
        items: [],
        token: false,
        searchKey:'',
        carouselitems: [],
        status: null,
        newPost: {
            title:'',
            image: '',
            content: '',
            uploader: '',
            carousel: false,
            special: false,
            longContent: ''
        }
    },
    getters:{
        searchFilter:(state) => (searchKey) => {
            return state.items.filter(post => 
                post.title.match(searchKey))
        },
        carouselFilter: (state) => {
            return state.items.filter(post => {
                if(post.carousel) return post
            })
        },
        specialFilter: (state) => {
            return state.items.filter(post => {
                if(post.special) return post
            })
        }
    },
    mutations:{
        // TEST(state, payload){
        //     state.test = payload
        //     console.log(state.test)
        // }

        newPostTitle(state, title){
            state.newPost.title = title
        },
        newPostImage(state, image){
            state.newPost.image = image
        },
        newPostContent(state, content){
            state.newPost.content = content
        },
        newPostUploader(state, uploader){
            state.newPost.uploader = uploader
        },
        newPostCarousel(state, carousel){
            state.newPost.carousel = carousel
        },
        newPostSpecial(state, special){
            state.newPost.special = special
        },
        longContent(state, content){
            state.newPost.longContent = content
        },
        getLink(state, link){
            state.postLink = link
        }
    },
    actions:{
        async getPost(){
            axios.get(LOCAL_URI + 'posts', {headers: headers}).then(response => {
                    this.state.items = response.data
            })
        },
        async createPost(){
            console.log("hello")
            var post = this.state.newPost
            axios.post(LOCAL_URI + 'posts/create/', {title: post.title, content: post.content, image: post.image, uploader: post.uploader, carousel: post.carousel, special: post.special, longContent: post.longContent}, {headers:headers}).then(response => {
                this.state.status = response.status
                console.log(this.state.status)
                
            })
        },
    }
})




//Ez itt vuebol jott.

// async sendPost(){
// const headers = {
//     'Content-Type': 'application/json',
//     'token': localStorage.getItem('token')
// }
// var title = this.title
// var content = this.content
// var image = this.newimage
// this.errorMessage = []
// if(title == null || title == undefined || title == ''){
//     this.errorMessage.push("Title need at least 1 character")
//     this.error_title = true 
// }
// else{
//     this.error_title = false
// }
// if(content == null || content == undefined || content == ''){
//     this.errorMessage.push("Content need at least 1 character")
//     this.error_content = true 
// }
// else{
//     this.error_content = false
// }
// if(image == null || image == undefined || image == ''){
//     this.errorMessage.push("Need image")
//     this.error_image = true 
// }
// else{
//     this.error_image = false
// }

// axios.post('http://localhost:8082/posts/create/', { title: this.create_title, content: this.create_content, image: this.remoteUrl, uploader: this.username, link: this.create_link, carousel: this.carousel, special: this.special, category: this.create_category}, {headers: headers})
// .then(res => {
//     if(res.status == 200){
//         location.reload()
//     }
// })
// },
