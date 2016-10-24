<template>
  <div id="indexComtent">
    <h3>{{counterValue}}</h3>
  </div>
</template>
<script type="text/javascript">
//import { getCount } from './../vuex/getters'
export default {
    computed: {
      counterValue () {
        return this.$store.getters.getCount
      }
    },
    data () {
      return {
        
      }
    },
    vuex: {
      getters: {
        // 注意在这里你需要 `getCount` 函数本身而不是它的执行结果 'getCount()'
        //counterValue: getCount
      }
    }
}
</script>

<style>
#indexComtent{width: 100%; height: 300px; border: 1px solid #000;}
h1{font-size: 0.2rem;}
a{font-size: 0.18rem}
</style>