import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  carousel : [],
  loading : true
}

// mutations
const mutations = {
  [types.Set_indexData] (state, data) {
    state.carousel = data;
    state.loading = false;
  }
}

export default {
  state,
  mutations
}