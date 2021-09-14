import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRouter)


//Define the components
import Login from './components/Login'
import Posts from './components/Posts'
import PostCreate from './components/PostCreate'
import Register from './components/Register'
import UserProfile from'./components/UserProfile'

const createPost =  PostCreate
const routes = [
  {
    props: true,
    name:'posts',
    path:'/posts',
    component: Posts
  
  },
  {
    props: true,
    name:'profile',
    path:'/profile',
    component: UserProfile
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
    props:true,
    path: '/create', 
    component: createPost,
    meta:{ requiresAuth: true }
  },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
