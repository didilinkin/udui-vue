<template>
<div>
  <headnav v-bind:title="pagetitle"></headnav>
  <transition name="slide-fade">
    <div id="mall"  v-show="true">
    </div>
  </transition>
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