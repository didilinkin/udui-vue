<template>
  <div id="indexComtent">
    <h1>{{mas}}</h1>
    <button @click="increment">按钮</button>
  </div>
</template>
<script type="text/javascript">
import store from './../vuex/store' // import 我们刚刚创建的 store
import { incrementCounter } from './../vuex/actions'
export default {
  data () {
    return {
      mas: "主体内容"
    }
  },
  vuex: {
    actions: {
      increment: incrementCounter
    }
  },
  methods : {
  	increment : function () {
  		store.commit('increment',1)
  	}
  }
}
</script>

<style>
#indexComtent{width: 100%; height: 300px; border: 1px solid #000;}
h1{font-size: 0.2rem;}
a{font-size: 0.18rem}
button{width: 1rem;height: 1rem; font-size: 0.2rem}
</style>