import indexApi from '../api/index'
import userApi from '../api/user'
import * as types from './mutation-types'

export const increment = ({ commit }, product) => {
    commit(types.ADD_NUMBER, 1)
}

export const getIndexData = ({ commit }, product) => {
  indexApi.getProducts().then((res) => {
    var arr = res.body.module[0].list
    commit(types.Set_indexData, arr)
  });

  userApi.userMas().then((res) => {
      commit(types.Set_user_info, res.body);
  });
  
}


export const loginfn = ({ commit }, products) => {
    userApi.login(products).then((res) => {
            console.log(res)
        });
}

export const getUserInfo = ({ commit }, products) => {
  userApi.userMas().then((res) => {
      commit(types.Set_user_info, res.body);
  });
}