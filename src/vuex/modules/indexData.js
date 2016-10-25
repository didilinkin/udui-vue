import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  carousel : []
}

// mutations
const mutations = {
  [types.Set_indexData] (state, data) {
    state.carousel = data;
  }
}

export default {
  state,
  mutations
}