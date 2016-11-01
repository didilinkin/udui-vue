import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import appIndex from './../App.vue'
import footMenu from './../component/footmenu.vue'
import mall from './../component/mall.vue'
import tcshop from './../component/tcshop.vue'
import shopcar from './../component/shopcar.vue'
import userCenter from './../component/user/user-center.vue'
import userOrders from './../component/user/user-orders.vue'
import login from './../component/login.vue'





// const routes = [
//     // 动态路径参数 以冒号开头
//   { path: '/user/:id', component: User }
// ]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: appIndex,
        footerMenu : footMenu
      }
    },
  	{
      path: '/index',
      components: {
        default: appIndex,
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
        default: userCenter,
        footerMenu : footMenu
      }
    },
    {
      path: '/userOrders',
      components: {
        default: userOrders,
        footerMenu : footMenu
      }
    },
    {
      path: '/login',
      components: {
        default: login
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
// router.beforeEach((to, from, next) => {
//   //console.log(to)
// })
// router.afterEach(route => {
//   console.log(route.path)
// })
// router.beforeEach((to, from, next) => {
//   // ...
// })
export default {
  router
}