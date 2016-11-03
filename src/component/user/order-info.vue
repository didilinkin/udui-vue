<template>
<div class="order-info-box">
  <loading :show="loading"></loading>
  <headnav v-bind:title="pagetitle"></headnav>
  <div class="order-state"><p>{{orderInfoData.state|orderState}}</p></div>
  <div class="add-info">
    <p class="add-name">{{orderInfoData.receiverName}}<span>{{orderInfoData.userName}}</span></p>
    <p class="adds"><i></i>{{orderInfoData.receiverArea+orderInfoData.receiverAddress}}</p>
  </div>
  <div class="order-detail">
    <p class="pro-tit">{{orderInfoData.sellerName}}</p>
    <dl v-for="data in orderInfoData.orderItemList">
      <dd>
        <img :src="data.productImgUrl">
      </dd>
      <dt class="proName"><p>{{data.productName}}</p></dt>
      <dt class="proAttribute">参考身高：130  颜色分类：玫红色（女童）</dt>
      <dt class="proPrice">¥{{data.unitSellerPrice+data.unitVouchers}} (可抵用{{data.unitVouchers}}优券)<span class="proNum">x{{data.count}}</span></dt>
    </dl>
    <router-link class="linkBtn" to="/user">申请退款</router-link>
  </div>
  <div class="pro-info">
    <table>
      <tr>
        <th>商品金额：</th>
        <td>￥{{orderInfoData.totalPay}}.00</td>
      </tr>
      <tr>
        <th>运费：</th>
        <td>￥{{orderInfoData.totalDeliveryFee}}.00</td>
      </tr>
      <tr>
        <th>活动抵扣：</th>
        <td>-￥{{orderInfoData.totalVouchers}}.00</td>
      </tr>
      <tr>
        <th>实付款：</th>
        <td>￥{{orderInfoData.totalPay}}.00+</td>
      </tr>
    </table>
  </div>
  <div class="order-info">
    <p><span>订单编号：</span>{{orderInfoData.no}}</p>
    <p><span>下单时间：</span>{{orderInfoData.createTime|date}}</p>
    <p><span>支付时间：</span>{{orderInfoData.paymentTime|date}}</p>
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
.order-info-box{
  div{background:#fff;padding:0 0.18rem;text-align:left;}
  .order-state{
    height: 1.1rem; margin-bottom:0.18rem;
    p{font-size:0.3rem; color:#ff833e; line-height:1.1rem; text-align:left;}
  }
  .add-info{
    padding:0.32rem 0.18rem 0.3rem;margin-bottom:0.18rem;
    .add-name{
        padding-left:0.46rem; color:#333333; font-size:0.3rem; margin-bottom:0.24rem;
      span{padding-left:0.54rem;}
    }
    .adds{
      font-size: 0.26rem; color:#666666;
      i{padding:0 0.23rem;background:url('../../../src/assets/images/ico.png') no-repeat; background-position:0 -6.33rem;}
    }
  }
  .order-detail{
    background:#f7f7f7; overflow:hidden;
    .pro-tit{color:#333333; font-size:0.28rem; line-height:0.74rem;background:#fff; margin:0 -0.18rem;padding-left:0.18rem;}
    dl{
      padding:0.18rem 0; overflow:hidden;border-bottom:0.01rem solid #e5e5e5;background:#f7f7f7;
      dd{
        float:left;width:1.63rem; height:1.63rem;margin-right:0.16rem;
        img{display:block;width:100%; height:100%;}
      }
      dt{text-align:left; font-size:0.23rem; color: #000; overflow:hidden;}
      .proName{
        padding-top:0.08rem;
        p{line-height:0.3rem;height:0.6rem;}
      }
      .proAttribute{
        color:#999999;height:0.65rem;
      }
      .proPrice{
        line-height:0.3rem;
        .proNum{float:right;}
      }
    }
    a.linkBtn{color:#fff; margin:0.08rem 0; padding:0 0.18rem; border-radius:0.06rem; float:right;line-height:0.38rem; font-size:0.26rem; background:#ff833e;}
  }
  .pro-info{margin-bottom:0.18rem;}
  table{
    width: 100%; font-size: 0.28rem; line-height:0.42rem;padding:0.2rem 0;
    tr{
      th{}
      td{text-align:right; color:#ff2772;}
    }
  }
  .order-info{
    padding:0.2rem 0.18rem;
    p{
      font-size: 0.24rem; line-height:0.36rem;
    }
  }
}
</style>