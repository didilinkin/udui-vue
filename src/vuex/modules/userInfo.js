import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  	isLogin : false,
  	userName : null
}

// mutations
const mutations = {
  [types.Set_user_info] (state,amount) {
  	state.isLogin = amount.success;
  	if (amount.success) {
  		state.userName = amount.module.userName;
  	}
  }
}

export default {
  state,
  mutations
}