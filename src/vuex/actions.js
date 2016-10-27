import indexApi from '../api/index'
import userApi from '../api/user'
import * as types from './mutation-types'

export const increment = ({ commit }, product) => {
    commit(types.ADD_NUMBER, 1)
}

export const getIndexData = ({ commit }, product) => {
  indexApi.getProducts().then((res) => {
            console.log(res.body.module[0].list)
            var arr = res.body.module[0].list
            commit(types.Set_indexData, arr)
        });
  
}



export const loginfn = ({ commit }, products) => {
  	console.log(products)
    if (products.yy) {
    userApi.login(products).then((res) => {
            console.log(res)
        });
  }else{
    userApi.userMas().then((res) => {
            console.log(res)
        });
  }
}