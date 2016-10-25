import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import indexComtent from './modules/indexComtent.js'
import indexData from './modules/indexData.js'

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
Vue.use(Vuex)
export default new Vuex.Store({
  actions,
  getters,
  modules : {
    indexComtent,
    indexData
  },
  strict: true
})