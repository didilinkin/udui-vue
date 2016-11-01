import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  "count":0
}

// mutations
const mutations = {
  [types.ADD_NUMBER] (state,amount) {
    state.count = state.count + amount;
    console.log(state.count)
  }
}

export default {
  state,
  mutations
}