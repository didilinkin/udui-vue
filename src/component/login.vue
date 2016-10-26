<template>
  <div id="mall">
  	<headnav v-bind:title="pagetitle"></headnav>
    <div class="login">
      <input v-model="userName" type="text"/>
      <input v-model="passWord" type="text"/>
      <button @click="loginfn({phone:userName,pwd:passWord})">登录</button>
      <ul class="clearfix other">
          <li><a>手机注册</a></li>
          <li class="divd"></li>
          <li><a>忘记密码</a></li>
      </ul>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from 'vuex'
import headnav from './common/header.vue'
const components = { headnav }
export default {
  data () {
    return {
      pagetitle: "登录",
      userName : '',
      passWord : ''
    }
  },
  components : components,
  methods: mapActions([
    'loginfn'
  ])
  // methods : {
  // 	loginfn : function() {
  // 		this.$store.dispatch(this.userName,this.passWord)
  // 	}
  // }
}
</script>

<style>
input{width: 80%; display: block; border: 1px solid #000; margin: 20px auto; height: 30px;}
.other{color: #000;}
</style>