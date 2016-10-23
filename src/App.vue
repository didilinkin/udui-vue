<template>
  <div id="app">
    <header class="clearfix">
      <div class="sc">优兑商城</div>
    </header>
    <banner></banner>
    <indexContent></indexContent>
    <testContent></testContent>
  </div>
</template>

<script>

import _store from './vuex/store' // import 我们刚刚创建的 store
import banner from './component/banner.vue'
import indexContent from './component/indexContent.vue'
import testContent from './component/testcontent.vue'

const components = { banner,indexContent,testContent }
export default {
  name: 'app',
  components : components,
  store: _store // 在根组件加入 store，让它的子组件和 store 连接,
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
