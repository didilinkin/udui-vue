import httpVue from './httpVue'

export default {
  getBannerList (obj) {
    var str = '/v1/navmenu/getBannerList';
    var data = {regionId:-1,type:2,appLinkId:obj.appLinkId}
    var url = httpVue.makeURL(str,data);
    var backData = null;
    return httpVue.getDataVue(url)
   
  }
}
