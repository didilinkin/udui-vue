<template>
  <div id="login-box">
  	<headnav v-bind:title="pagetitle"></headnav>
    <div class="login">
      <div class="input-form">
        <i class="user-ico"></i>
        <input v-model="userName" type="text" placeholder="用户名/手机号"/>
        <span v-show="userName!=''" @click="userName=''" class="del-txst"></span>
      </div>
      <div class="input-form">
        <i class="pw-ico"></i>
        <input v-model="passWord" type="password" placeholder="密码"/>
        <span v-show="passWord!=''" @click="passWord=''" class="del-txst"></span>
        <span class="show-pw"></span>
      </div>
      <button class="subBtn" @click="loginfn({phone:userName,pwd:passWord})">登录</button>
      <button class="subBtn" @click="loginfn({phone:userName,pwd:passWord})">验证</button>
      <ul class="clearfix other">
          <li><router-link to="/login">手机注册</router-link></li>
          <li class="divd">|</li>
          <li><router-link to="/login">忘记密码</router-link></li>
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
}
</script>

<style lang="scss">
#login-box{height:100%;}
.login{
  height:100%; padding: 0.72rem 0.18rem 0; background : #fff;
  .input-form{
    height: 0.86rem; border:0.02rem solid #dadada; border-radius:0.04rem; margin-bottom:0.36rem; overflow: hidden;
    i{width:0.68rem; height:100%;dispaly:block;float:left; background:url('../../src/assets/images/ico.png') no-repeat;}
    .user-ico{background-position:0.14rem -1.3rem;}
    .pw-ico{background-position:0.14rem -2.3rem;}
    input{
      width: 5.3rem; height:100%; dispaly:block;float:left; font-size:0.36rem; color:#000; line-height:100%;
      
    }
    // input:-webkit-autofill {
    // -webkit-box-shadow: 0 0 0px 1000px white inset;
    // border: 1px solid #CCC!important;
    // }
    span{dispaly:block;  height:100%;background:url('../../src/assets/images/ico.png') no-repeat;}
    .del-txst{width:0.46rem;float:left; background-position:0 -3.04rem;}
    .show-pw{width:0.46rem;float:right; background-position:0 -3.72rem}
  }
  .subBtn{
    display: block; width:100%; height:0.72rem; color:#fff; border:none; border-radius:0.06rem; background: #ff2772; font-size:0.3rem; line-height:100%; font-weight:blod; margin-bottom:0.7rem;
  }
  .other{
    overflow: hidden; margin:0 auto; width:3.08rem;
    li{
      float:left;
      a{font-size: 0.3rem; color:#ff2772;float:left;}
    }
    .divd{font-size: 0.3rem; color:#ff2772; width:0.68rem; text-align:center; float:left;}
  }
}

</style>