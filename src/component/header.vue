<template>
  <header class="user-header">
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

<style>
#header{height: 0.5rem; background: #f7f7f7;}
#bacnBtn{position: absolute; display: block; background: red; height: 0.5rem; line-height: 0.5rem;}
p{font-size: 0.34rem; text-align: center;}
</style>