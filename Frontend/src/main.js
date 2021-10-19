import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {store} from './store/store'

Vue.config.productionTip = false
Vue.use(VueRouter)


//Define the components
import Login from './components/Login'
import Posts from './components/Posts'
import PostCreate from './components/PostCreate'
import Register from './components/Register'
import UserProfile from'./components/UserProfile'
import fullPost from './components/fullPost'

const createPost =  PostCreate
const routes = [
  {
    props: true,
    name:'posts',
    path:'/posts',
    component: Posts
  
  },
  {
    props:true,
    path: '/posts/create', 
    component: createPost,
    meta:{ requiresAuth: true }
  },
  {
    props:true,
    name: 'post-view',
    path:'/posts/:id',
    component: fullPost
  },
  {
    props:true,
    name: 'login',
    path:'/login',
    component: Login
  },
  {
    props:true,
    path: '/register',
    component: Register
  },
  {
    props: true,
    name:'profile',
    path:'/profile',
    component: UserProfile
  },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store: store,
  render: h => h(App),
}).$mount('#app')
