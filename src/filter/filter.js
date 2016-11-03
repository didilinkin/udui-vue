import Vue from  'vue'

Vue.filter('orderState', function(str) {
	switch(str){
		case 'WAIT_BUYER_PAY':
        	return '等待买家付款' 
        	break;
		case 'WAIT_SELLER_CONFIRM':
        	return '等待卖家确认' 
        	break;
		case 'SELLER_CONSIGNED_PART':
        	return '卖家部分发货' 
        	break;
		case 'WAIT_SELLER_SEND_GOODS':
        	return '等待卖家发货' 
        	break;
		case ' WAIT_BUYER_CONFIRM_GOODS':
        	return '等待买家确认收货' 
        	break;
		case 'TRADE_BUYER_SIGNED':
        	return '买家已签收' 
        	break;
		case 'TRADE_FINISHED':
        	return '交易成功' 
        	break;
		case 'TRADE_CLOSED':
        	return '付款以后用户退款成功，交易自动关闭' 
        	break;
		case 'TRADE_CLOSED_BY_UDUI':
        	return '付款以前，卖家或买家主动关闭交易' 
        	break;
        default : 
        	return '未知状态';
	}
});

Vue.filter('date', function(str) {
   let  myTime = {
            /**              
             * 时间戳转换日期              
             * @param <int> unixTime    待时间戳(秒)              
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
             * @param <int>  timeZone   时区              
             */
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number')
                {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime);
                var ymdhis = "";
                ymdhis += time.getFullYear() + "-";
                ymdhis += (time.getMonth()+1) + "-";
                ymdhis += time.getDate() + " ";

                
                ymdhis += " " + time.getHours() + ":";
                ymdhis += time.getMinutes() + ":";
                ymdhis += time.getSeconds();
                
                return ymdhis;
            }
        }
        return myTime.UnixToDate(str)
});