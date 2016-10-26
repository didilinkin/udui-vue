<template>
<transition name="slide-fade">
  <div id="mall"  v-show="true">
    <headnav v-bind:title="pagetitle"></headnav>
  </div>
</transition>
</template>

<script type="text/javascript">

import headnav from './common/header.vue'
const components = { headnav }
export default {
  data () {
    return {
      pagetitle: "同城"
    }
  },
  components : components,
  methods : {
  	showNum : function() {
  		alert(1)
  	}
  }
}
</script>

<style>

</style>