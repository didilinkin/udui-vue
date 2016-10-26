<template>
  <div id="mall">
  	<headnav v-bind:title="pagetitle"></headnav>
  </div>
</template>

<script type="text/javascript">

import headnav from './common/header.vue'
const components = { headnav }
export default {
  data () {
    return {
      pagetitle: "商城"
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