import indexApi from '../api/index'
import userApi from '../api/user'
import * as types from './mutation-types'

export const increment = ({ commit }, product) => {
    commit(types.ADD_NUMBER, 1)
}

export const getIndexData = ({ commit }, product) => {
  indexApi.getBannerList({appLinkId:'scrollPicture'}).then((res) => {
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

export const getUserOrders = ({ commit }, products) => {
  indexApi.getBannerList({appLinkId:'myOrderBanner'}).then((res) => {
    let arr = res.body.module[0].list
    commit(types.Set_orders_banner, arr)
  });
  let data = {pageNo: 1,pageSize: 10,orderNo: '',orderState: ''};
  userApi.userOrders(data).then((res) => {
      commit(types.Set_user_orders, res.body.module);
  });
}

export const getOrderInfo = ({ commit }, products) => {
  userApi.orderInfo(products).then((res) => {
    commit(types.Set_order_info,res.body.module)
  });
}

export const getGoodsInfo = ({ commit }, products) => {
  userApi.goodsInfo(products).then((res) => {
    console.log(res)
    commit(types.Set_goods_info,res.body.module)
  });
}

export const getWallerData = ({ commit }, products) => {
  userApi.myWaller().then((res) => {
    console.log(res)
    commit(types.Set_waller_data,res.body.module)
  });
}

export const getEnvData = ({ commit }, products) => {
  userApi.myEnvData(products).then((res) => {
    console.log(res)
    commit(types.Set_evnlop_data,res.body.module)
  });
}




