import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default {
    data : {
        serviceHost : 'http://api.udui.cn:8090/api'
    },
    getDataVue : function(url) {
        var aaa = null;
        return Vue.http.get(url);
    },
    postDataVue: function (url, data,options) {
        Vue.http.options.emulateJSON = true;
        return Vue.http.post(url,data,options);
    },
    jsonpDataVue : function (url) {
        return Vue.http.sonp(url);
    },
    makeURL : function (url,data){
        var link = this.data.serviceHost + url;
            if (typeof data != "undefined" && data != "") {
                var paramArr = [];
                for (var attr in  data) {
                    paramArr.push(attr + '=' +  data[attr]);
                }
                link += '?' + paramArr.join('&');
            }
            return link;
    }
}

// 请求拦截器 可以在请求发送前和发送请求后做一些处理。暂不适用
// Vue.http.interceptors.push((request, next) => {
//         // ...
//         // 请求发送前的处理逻辑
//         // ...
//     next((response) => {
//         // ...
//         // 请求发送后的处理逻辑
//         // ...
//         // 根据请求的状态，response参数会返回给successCallback或errorCallback
//         return response
//     })
// })
