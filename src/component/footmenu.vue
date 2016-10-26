<template>
    <transition name="foot">
      <div id="footMenu" v-if="true">
      	<router-link to="/index">  <p @click="heiline(1)" :class="{cur:iscur == 1}" >首页</p></router-link>
      	<router-link to="/mall">   <p @click="heiline(2)" :class="{cur:iscur == 2}">商城</p></router-link>
      	<router-link to="/tcshop">       <p @click="heiline(3)" :class="{cur:iscur == 3}">同城</p></router-link>
      	<router-link to="/shopcar">       <p @click="heiline(4)" :class="{cur:iscur == 4}">购物车</p></router-link>
      	<router-link to="/user">       <p @click="heiline(5)" :class="{cur:iscur == 5}">我的</p></router-link>
      </div>
  </transition>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      iscur: 1,
      show : true
    }
  },
  methods : {
  	heiline : function(num) {
      this.iscur = num;
  	}
  }
}
</script>

<style>
#footMenu{
  width: 100%; height: 0.92rem; background: #ccc; position: fixed; overflow: hidden;bottom: 0rem;
}
#footMenu a{display: block; float: left; width: 20%; height: 100%; text-align: center; line-height: 0.92rem; font-size: 0.3rem;}
.cur{color: #ff2772;}


.foot-enter-active, .foot-leave-active {
  transition: all 2s
}
.foot-enter, .foot-leave-active {
  margin-bottom:-0.92rem;
}


</style>