import indexApi from '../api/index'
import * as types from './mutation-types'

export const increment = ({ commit }, product) => {
    commit(types.ADD_NUMBER, 1)
}

export const getIndexData = ({ commit }, product) => {
  var arr = ['http://i1.hdslb.com/bfs/archive/2867b2f14829d818709179b133efd42fb5c661d3.jpg','http://i0.hdslb.com/bfs/archive/b3850f427be8c1367d9221644cbc48ec896666f2.jpg','http://i1.hdslb.com/bfs/archive/3b08c71eb01236fa0f8f28b62078643ffe5a19b8.jpg'];
  //indexApi
  indexApi.getProducts().then((res) => {
            console.log(res.body.module[0].list)
            var arr = res.body.module[0].list
            commit(types.Set_indexData, arr)
        });
  
}



export const getBanner = ({ commit, state }, products) => {
  	
}