<template>
<div class="user-orders-box">
  <loading :show="loading"></loading>
  <headnav v-bind:title="pagetitle"></headnav>
  <div><p>等待卖家确认</p></div>
  <div class="add-info">
    <p class="add-name">ww<span>13120860906</span></p>
    <p class="adds"><i class="iconfont icon-location"></i>上海上海市长宁区城区lingkongsoho</p>
  </div>
  {{orderInfoData}}
  <!-- <order-list :orderList="orderList"></order-list> -->
</div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import loading from './../common/loading.vue'
import headnav from './../common/header.vue'
import banner from './../common/banner.vue'
import orderList from './order-list.vue'

const components = { loading,headnav,banner,orderList }
export default {
  data () {
    return {
      pagetitle: "订单详情",
      loading : false
    }
  },
  computed: mapGetters({
    orderInfoData : 'orderInfoData'
  }),
  components : components,
  methods : {
  	showNum : function() {
  		console.log(this.isLogin)
  	}
  },
  created () {
    let orderNo = this.$route.params.orderNo
    this.$store.dispatch('getOrderInfo',{orderNo:orderNo});
  }
}
</script>

<style lang="scss">
.user-orders-box{

}
</style>