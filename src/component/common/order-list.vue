<template>
<div>
    <div class="orderListBox">
      <div class="orderTitle">
        <span class="orderNum">订单编号：001091037931033</span>
        <span class="orderState">等待卖家确认</span>
      </div>
      <router-link to="/user">
        <dl>
          <dd>
            <img src="http://udui.img-cn-shanghai.aliyuncs.com/5591010cN5baf37ba.jpg">
          </dd>
          <dt class="proName"><p>小王子 聪明棒 45g</p></dt>
          <dt class="proAttribute">参考身高：130  颜色分类：玫红色（女童）</dt>
          <dt class="proPrice">¥5.90  (可抵用1优券)<span class="proNum">x1</span></dt>
        </dl>
        <div class="orderStat">
          <p>共1件商品 合计￥9.9+1优券（含运费5）</p>
        </div>
      </router-link>
      <div class="btns">
        <router-link class="orderInfoBtn" to="/user">订单详情</router-link>
      </div>
    </div>
    {{orderList}}
</div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
export default {
  methods : {
  	showNum : function() {
  		alert(1)
  	}
  },
  props : ['orderList']
}
</script>

<style lang="scss">
.orderListBox{
  .content{background: #fff;padding: 0 0.18rem; line-height: 0.7rem; font-size: 0.24rem; overflow: hidden;}
  margin-bottom: 0.17rem;
  .orderTitle{
     @extend .content;
    .orderNum{float: left;}
    .orderState{float:right;}
  }
  dl{
    padding:0.18rem; overflow:hidden;
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
  .orderStat{
    @extend .content; margin-bottom:0.02rem;
    p{color:#000;text-align:right;}
  }
  .btns{
    padding:0.18rem; background:#fff; overflow:hidden;
    a{width:1.25rem; text-align:center; display: inline-block; float:right; font-size:0.25rem; line-height:0.52rem; border-radius:0.04rem;}
    .orderInfoBtn{border:0.01rem solid #666666;  color:#666666;}
  }
}
</style>