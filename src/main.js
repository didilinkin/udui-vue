import Vue from 'vue'
//import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

//Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource);

import store from './vuex/store' // import 我们刚刚创建的 store

import appIndex from './App.vue'
import _footMenu from './component/footmenu.vue'
import _mall from './component/mall.vue'
import _tcshop from './component/tcshop.vue'
import _shopcar from './component/shopcar.vue'
import _user from './component/user.vue'

const app 	   = appIndex;
const mall 	   = _mall;
const tcshop   = _tcshop;
const shopcar  = _shopcar;
const user     = _user;
const footMenu = _footMenu

// const routes = [
//     // 动态路径参数 以冒号开头
//   { path: '/user/:id', component: User }
// ]

const router = new VueRouter({

  routes: [
    {
      path: '/',
      components: {
        default: app,
        footerMenu : footMenu
      }
    },
  	{
      path: '/index',
      components: {
        default: app,
        footerMenu : footMenu
      }
    },
    {
      path: '/mall',
      components: {
        default: mall,
        footerMenu : footMenu
      }
    },
    {
      path: '/tcshop',
      components: {
        default: tcshop,
        footerMenu : footMenu
      }
    },
    {
      path: '/shopcar',
      components: {
        default: shopcar,
        footerMenu : footMenu
      }
    },
    {
      path: '/user',
      components: {
        default: user,
        footerMenu : footMenu
      }
    }
    // { 
    // 	path: '/user/:id', 
    // 	component: User ,
    // 	children :[
    // 		{
	   //        // 当 /user/:id/profile 匹配成功，
	   //        // UserProfile 会被渲染在 User 的 <router-view> 中
	   //        path: 'profile',
	   //        component: UserProfile
	   //      },
	   //      {
	   //        // 当 /user/:id/posts 匹配成功
	   //        // UserPosts 会被渲染在 User 的 <router-view> 中
	   //        path: 'posts',
	   //        component: UserPosts
	   //      },
    // 		{ path: '', component: UserHome }
    // 	]
    // }
  ]
})

new Vue({
  el: '#app',
  router,
  store
}).$mount('#app')















