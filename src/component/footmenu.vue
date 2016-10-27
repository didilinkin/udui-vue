<template>
    <transition name="foot">
      <div id="footMenu" v-if="true">
      	<router-link to="/index">    <p @click="heiline(1)" :class="[iscur==1 ?'ac1':'a1']"></p></router-link>
      	<router-link to="/mall">     <p @click="heiline(2)" :class="[iscur==2 ?'ac2':'a2']"></p></router-link>
      	<router-link to="/tcshop">   <p @click="heiline(3)" :class="[iscur==3 ?'ac3':'a3']"></p></router-link>
      	<router-link to="/shopcar">  <p @click="heiline(4)" :class="[iscur==4 ?'ac4':'a4']"></p></router-link>
      	<router-link to="/user">     <p @click="heiline(5)" :class="[iscur==5 ?'ac5':'a5']"></p></router-link>
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

<style lang="scss">
#footMenu{
  width: 100%; height: 0.88rem; background-color:#f7f7f7; position: fixed; overflow: hidden;bottom: 0rem;border-top: 0.01rem solid #dcdcdc;
  .a1{background-position: 0.06rem 0; }
  .a2{background-position: -1.43rem 0; }
  .a3{background-position: -2.95rem 0; }
  .a4{background-position: -4.43rem 0; }
  .a5{background-position: -5.95rem 0; }
}
#footMenu{
  .ac1{background-position:  0.06rem -1.38rem; }
  .ac2{background-position: -1.43rem -1.38rem; }
  .ac3{background-position: -2.95rem -1.38rem; }
  .ac4{background-position: -4.44rem -1.38rem; }
  .ac5{background-position: -5.96rem -1.38rem; }
}
#footMenu a{display: block; float: left; width: 20%; height: 100%;}
#footMenu p{width: 0.53rem; height: 0.62rem; margin: 0.14rem auto 0; background: url('../../src/assets/images/footMenu.png') no-repeat; background-position:0 0; }



.foot-enter-active, .foot-leave-active {
  transition: all 1.8s
}
.foot-enter, .foot-leave-active {
  margin-bottom:-0.89rem;
}


</style>