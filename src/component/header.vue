<template>
  <header class="nav-header">
    <router-link id="back" to="/index">返回</router-link>
    <p class="headTxt">{{title}}</p>
    <a class="goAhead"><i class="iconfont icon-"></i></a>
  </header>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
    }
  },
  methods : {
  	showNum : function() {
  		alert(1)
  	}
  },
  props : ['title']
}
</script>

<style lang="scss">
.nav-header{
  height: 0.5rem; background: #000;
  #back{position: absolute; display: block; background: red; height: 0.5rem; line-height: 0.5rem;}
}

p{font-size: 0.34rem; text-align: center;}
</style>