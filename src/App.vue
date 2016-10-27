<template>
  <div>
    <!-- 页面加载loading -->
    <!-- <loading :show="loading"></loading> -->
    <cover :show="loading"></cover>
    <transition name="slide-fade">
      <div v-show="!loading">
        <header class="clearfix">
          <div class="sc">优兑商城</div>
        </header>
        <banner v-bind:imgArr="getCarousel"></banner>
        <indexContent></indexContent>
        <testContent></testContent>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import banner from './component/common/banner.vue'
import indexContent from './component/indexContent.vue'
import testContent from './component/testcontent.vue'
import loading from './component/common/loading.vue'
import cover from './component/cover.vue'//欢迎动画组件

const components = { banner,indexContent,testContent,loading,cover }
export default {
  data(){
    return {
      lo : false
    }
  },
  computed: mapGetters({
    loading : 'loading',
    getCarousel: 'getCarousel'
  }),
  created () {
    this.$store.dispatch('getIndexData')
  },
  name: 'app',
  components : components
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
header{
    padding: 0.2rem 0.3rem;
    background: #ff2772;
    height: 0.35rem;
  }
.sc {    
    width: 100%;
    text-align: center;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.27rem;
    color: #fff;
    float: left;
}
</style>
