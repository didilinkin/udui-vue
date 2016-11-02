import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  	isLogin    : false,
  	userName   : null,
    carousel   : null,
    orderList  : null,
    orderInfo  : null,
    goodsInfo  : null
}

// mutations
const mutations = {
  [types.Set_user_info] (state,amount) {
    state.isLogin = amount.success;
    if (amount.success) {
      state.userName = amount.module.userName;
    }
  },
  [types.Set_user_orders] (state,amount) {
    console.log(amount)
      state.orderList = amount;
  },
  [types.Set_orders_banner](state,amount){
    state.carousel = amount;
  },
  [types.Set_order_info](state,amount){
    state.orderInfo = amount;
  },
  [types.Set_goods_info](state,amount){
    state.goodsInfo = amount;
  }
}

export default {
  state,
  mutations
}