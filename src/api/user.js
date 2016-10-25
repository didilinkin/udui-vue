import httpVue from './httpVue'

export default {
  login (products) {
    var url = httpVue.makeURL('/v1/auth/login');
    var data = products;
    return httpVue.postDataVue(url,data,{credentials:true})
  },
  userMas (products) {
    var url = httpVue.makeURL('/v1/user/details');
    return httpVue.getDataVue(url,{credentials:true});
  }

}
