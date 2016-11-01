<template>
  <header class="nav-header">
    <!-- <router-link class="backBtn" to="/index"></router-link> -->
    <a class="backBtn" @click="backfn()"></a>
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
  	backfn : function() {
  		this.$router.go(-1)
  	}
  },
  props : ['title']
}
</script>

<style lang="scss">
$grayBg : #f7f7f7;
$header-border : 0.01rem solid #dfdfdf;
$header-height : 0.6rem;
.nav-header{
  height: $header-height; background: $grayBg; border-bottom:$header-border;
  .backBtn{position: absolute; display: block; width:0.22rem; height: 0.38rem; left:0.27rem; top:0.3rem; background: url('../../../src/assets/images/ico.png') 0.01rem 0.01rem no-repeat;}
  p{font-size: 0.32rem; text-align: center; line-height:$header-height;}
}
</style>