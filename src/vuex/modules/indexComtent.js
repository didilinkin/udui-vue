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
  },
  [types.ADD_TO_CART] (state, { id }) {
    state.all.find(p => p.id === id).inventory--
  }
}

export default {
  state,
  mutations
}