<template>
	<div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="d in imgArr"><img :src="d.linkedImg"></div>
            </div>
            <!--分页器 -->
            <div class="swiper-pagination"></div>
    </div>
</template>

<script type="text/javascript">
import swiper from '../../../static/swiper-3.4.0.min'
export default {
    props  : ['imgArr'],
    mounted: function () {
        this.$nextTick(function () {
      	    let mySwiper = new Swiper (
      	    	'.swiper-container', {
                        direction: 'horizontal',
                        autoplay : 2000,
                        spend : 2000,
                        loop: true,
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true,
                        //修改swiper的父元素时，自动初始化swiper
                            // 如果需要分页器
                        pagination: '.swiper-pagination'
                    }
                )
            }
        )
    }
}
</script>

<style>
@import '../../../static/swiper.min.css';
.swiper-container {
        width: 100%;
        height: 2.44rem;
    }  
.swiper-slide img {width: 100%; height: 100%;}
</style>