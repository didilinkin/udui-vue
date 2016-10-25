import httpVue from './httpVue'

export default {
  getProducts () {
    var str = '/v1/navmenu/getBannerList';
    var data = {regionId:-1,type:2,appLinkId:'scrollPicture'}
    var url = httpVue.makeURL(str,data);
    var backData = null;
    return httpVue.getDataVue(url)
   
  }
}
