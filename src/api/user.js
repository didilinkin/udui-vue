import httpVue from './httpVue'

export default {
  login (products) {
    let url = httpVue.makeURL('/v1/auth/login');
    let data = products;
    return httpVue.postDataVue(url,data,{credentials:true})
  },
  userMas (products) {
    let url = httpVue.makeURL('/v1/user/details');
    return httpVue.getDataVue(url,{credentials:true});
  },
  userOrders(products) {
  	let data = {pageNo: products.pageNo,pageSize: products.pageSize,orderNo: products.orderNo,orderState: products.orderState};
    let url = httpVue.makeURL('/v1/order',data);
    return httpVue.getDataVue(url,{credentials:true});
  }
}
