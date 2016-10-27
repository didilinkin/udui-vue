<template>
<div>
  <transition name="slide-fade">
    <div id="mall"  v-show="true">
    </div>
  </transition>
    <div class="loginBox" :class="[isLogin?'loging':'ulogin']">
      <div class="toLogin" v-if="!isLogin">
          <router-link to="/login">登录</router-link>
          <span>|</span>
          <router-link to="/login">注册</router-link>
      </div>
      <div v-if="isLogin" class="uInfo">
        <router-link to="/login">
          <dl>
              <dd><img src="../../../src/assets/images/user/touxiang.png"></dd>
              <dt class="uName">小蘑菇</dt>
              <dt class="uLevel">普通会员</dt>
              <dt class="fr">
              </dt>
          </dl>
        </router-link>
        <div class="uOrder">
            <ul>
                <li class="dd">
                  <router-link to="/login">
                        <i></i>我的订单
                  </router-link>
                </li>
                <li class="md">
                  <router-link to="/login">
                        <i></i>我的买单
                  </router-link>
                </li>
            </ul>
        </div>
      </div>
    </div>
    <div class="uMenu">
      <ul class="clearfix">
          <li>
            <router-link to="/login">
              <i class="myWallet"></i>
              <p>我的钱包</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="hongbao"></i>
              <p>我的红包</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="shoucang"></i>
              <p>我的收藏</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="activity"></i>
              <p>我的活动</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="invite"></i>
              <p>邀请会员</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="friend"></i>
              <p>我的好友</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="myReward"></i>
              <p>我的奖励</p>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <i class="partner"></i>
              <p>合伙人福利</p>
            </router-link>
          </li>
      </ul>
    </div>
</div>
</template>

<script type="text/javascript">

import headnav from './../common/header.vue'
const components = { headnav }
export default {
  data () {
    return {
      isLogin : true
    }
  },
  components : components,
  methods : {
  	showNum : function() {
  		alert(1)
  	}
  }
}
</script>

<style lang="scss">
.loginBox{
  height: 3.7rem; overflow: hidden; position: relative;margin-bottom:0.36rem;
  .toLogin{
    width: 2.68rem; height:0.68rem;margin:1.7rem auto 0; border:2px solid #fff6f9;border-radius:0.04rem;overflow:hidden;
    a{color:#fff6f9; font-size:0.32rem;float:left;display:inline-block;width:1.3rem; line-height:0.68rem;}
    span{color:#fff6f9;font-size: 0.32rem;width:0.02rem;float:left;display:inline-block; line-height:0.64rem;}
  }
  .uInfo{
    margin: 1.16rem 0.18rem 0;
    dl{
      width:100%;height:1.24rem; overflow:hidden;
      dd{
        width:1.2rem; height:1.2rem; border:0.02rem solid rgba(255,255,255,0.5); border-radius:50%; float:left;
        img{width:100%; height:100%; display:block;}
      }
      .uName{
        padding: 0 0.18rem 0 0.29rem; font-size:0.3rem; line-height:1.24rem;float:left;
      }
      .uLevel{font-size:0.24rem; line-height:1.24rem; float:left;}
      .fr{
        float: right; width:0.15rem; height:1.24rem; background:url('../../../src/assets/images/user/right-ico.png') left center no-repeat;
      }
    }
  }
  .uOrder{
    position: absolute; width:100%;  left:0; bottom:0;
    ul{
      overflow:hidden;height:0.9rem;
      .dd{
        float:left;
        i{padding:0 0.11rem; margin-right:0.1rem; background:url('../../../src/assets/images/user/ddmd.png') no-repeat;}
      }
      .md{
        float:right;
        i{padding:0 0.11rem; margin-right:0.1rem; background:url('../../../src/assets/images/user/ddmd.png') no-repeat;}
      }
      li{
        width:3.74rem; height:100%; background:rgba(0,0,0,0.35);
        a{
          display:block; line-height:0.9rem; text-align: center; font-size:0.29rem;
        }
      }
    }
  }
}
.loging{background:url('../../../src/assets/images/user/ulogined.jpg') no-repeat; background-size:100% 100%;}
.ulogin{background:#fa6297;}

.uMenu{
  overflow: hidden;
  ul{
    width:
    li{
      width: 1.86rem; float:left; border-right:0.02rem solid #000;
      a{
        p{
          color: #333333;
        }
      }
    }
  }
}
</style>