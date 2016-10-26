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
      pagetitle: "购物车"
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  padding-right: 500px;
  opacity: 0;
}
</style>