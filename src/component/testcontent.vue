<template>
  <div id="indexComtent">
    <h3>{{counterValue}}</h3>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
    computed: mapGetters({
      counterValue: 'getCount'
    })
}
</script>

<style>
#indexComtent{width: 100%; height: 300px; border: 1px solid #000;}
h1{font-size: 0.2rem;}
a{font-size: 0.18rem}
</style>