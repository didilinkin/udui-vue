import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // 应用启动时，count 置为0
  count: 0
}

const mutations = {
  // mutation 的第一个参数是当前的 state
  // 你可以在函数里修改 state
  increment (state, amount) {
    console.log(state.count)
    state.count = state.count + amount;
  }
}

const getters = {
	getCount :  function(state) {
    	return state.count
	}
}

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  mutations,
  getters
})