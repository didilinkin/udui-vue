<template>
<div id="user-center-box">
  <transition name="slide-fade">
    <div id="mall"  v-show="true">
    </div>
  </transition>
    <div class="loginBox" :class="[userInfo.isLogin?'loging':'ulogin']" @click="showNum()">
      <div class="toLogin" v-if="!userInfo.isLogin">
          <router-link to="/login">登录</router-link>
          <span>|</span>
          <router-link to="/login">注册</router-link>
      </div>
      <div v-if="userInfo.isLogin" class="uInfo">
        <router-link to="/login">
          <dl>
              <dd><img src="../../../src/assets/images/user/touxiang.png"></dd>
              <dt class="uName">{{userInfo.userName}}</dt>
              <dt class="uLevel">普通会员</dt>
              <dt class="fr">
              </dt>
          </dl>
        </router-link>
        <div class="uOrder">
            <ul>
                <li class="dd">
                  <router-link to="/userOrders">
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
            <router-link to="/myWallet">
              <i class="myWallet"></i>
              <p>我的钱包</p>
            </router-link>
          </li>
          <li>
            <router-link to="/myEnvlop">
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
    <ul class="uSeeting">
      <li>
        <router-link to="/login">
          <i class="set-ico"></i>
          <p>设置</p>
        </router-link>
      </li>
      <li>
        <router-link to="/login">
          <i class="kd-ico"></i>
          <p>我要开店<span>(同城商家申请)</span></p>
        </router-link>
      </li>
    </ul>
</div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import headnav from './../common/header.vue'

const components = { headnav }
export default {
  computed: mapGetters({
    userInfo : 'userInfo'
  }),
  components : components,
  methods : {
  	showNum : function() {
  		console.log(this.isLogin)
  	}
  },
  created () {
    if (!this.userInfo.isLogin) {
      this.$store.dispatch('getUserInfo');
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
  overflow: hidden; margin-bottom:0.36rem;
  ul{
    width: 7.52rem;
    li{
      width: 1.86rem; float:left; background:#fff; border-right:0.02rem solid #eeeeee;border-bottom:0.02rem solid #eeeeee;
      a{
        display: block; padding:0.58rem 0;
        i{display:block;width:0.42rem; height:0.42rem;margin:0 auto 0.3rem; background: url('../../../src/assets/images/user/user-icn.png') 0 0 no-repeat;}
        .hongbao  {background-position:-1.91rem 0;}
        .shoucang {background-position:-3.77rem 0;}
        .activity {background-position:-5.62rem 0;}
        .invite   {background-position:0        -1.01rem;}
        .friend   {background-position:-1.91rem -1.01rem;}
        .myReward {background-position:-3.77rem -1.01rem;}
        .partner  {background-position:-5.62rem -1.01rem;}
        p{
          color: #333333; font-size:0.24rem; text-align:center;
        }
      }
    }
  }
}
.uSeeting{
  border-top:0.02rem solid #e1e1e1;
  li{
    border-bottom:0.02rem solid #e1e1e1; background: #fff;
    a{
      display: block; overflow:hidden; height:0.88rem; margin:0 0.26rem 0 0.17rem; background:url('../../../src/assets/images/ico.png') no-repeat; background-position:6.83rem -0.42rem;
      p{
        color: #000; text-align:left; font-size:0.3rem; line-height:0.88rem; padding-left: 0.19rem; float:left;
        span{color:#878787;}
      }
      i{padding:0.44rem 0.14rem;background:url('../../../src/assets/images/ico.png') no-repeat;background-position: 0 -5.52rem; float:left;}
      .kd-ico{background-position: 0 -4.9rem;}
    }
  }
}
</style>