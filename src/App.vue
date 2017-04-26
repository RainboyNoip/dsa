<template>
    <div class="wrapper">
        <myheader
            :speed="speed"
            ></myheader>
        <painter :src="src"></painter>
        <myfooter 
            :frame_total="frame_total"
            :play_frame_idx = "play_frame_idx"
            ></myfooter>
    </div>
</template>

<script>
import myheader from './components/Header.vue'
import painter from './components/painter.vue'
import myfooter from './components/Footer.vue'

import { getSrc } from './services/getSrc.js'
var loader = require('./assets/js/loader.js')
export default {
    name: 'app',
    data () {
        return {
            src:'',
            isPlaying:false,
            frames:[],
            speed:50,
            frame_total:10,
            play_frame_idx:1
        }
    },
    mounted(){
        let self = this;
        //事件监听
        self.$eventHub.$on('setPlayFrameIdx',self.setPlayFrameIdx);
        self.$eventHub.$on('setSpeed',self.setSpeed);
        console.log("开始加载DAS数据:--");
        console.log("要加载的DAS数据地址是:/dsa/function_pass_parameter/");
        let base_url = 'dsa/function_pass_parameter/'
        let app = this.app;
        Promise.all([
            getSrc(base_url+"algorithm.c"),
            app.loadScript(base_url+'render.js'),
            app.loadScript(base_url+'line.js')
        ]).then(function(data){
            console.log('DSA数据加载完毕!')
            self.src = data[0];
        }).then(function(){ // 初始化render.js
            console.log("运行_reader_init");
            render_init();
            console.log('生成frames数据完成!');
            self.frames = lineExports.init();
            //设定frame宽度
            self.frame_total = self.frames.length;
        })
    },
    methods:{
        hl:function(s,t){ //高亮行
            this.$eventHub.$emit('hl-lines',s,t);
        },
        setPlayFrameIdx:function(idx){
            if(idx < 1)
                idx = 1;
            else if(idx > this.frame_total)
                idx = this.frame_total;
            this.play_frame_idx = idx;
        },
        setSpeed:function(idx){
            if(idx <1)
                idx = 1;
            else if( idx > 100)
                idx = 100;
            this.speed= idx;
            console.log('当前速度是:'+idx)
            console.log('当前真实速度是:'+speedScale(idx) +"ms")
        },
    },
    watch:{
        play_frame_idx:function(newValue,oldValue){
            var vm = this;
            console.log(newValue)
            console.log(oldValue)
            render(vm.frames[newValue-1].status)
            vm.hl(vm.frames[newValue-1].hls,vm.frames[newValue-1].hlt);
        }
    },
    components:{
        myheader,
        painter,
        myfooter
    }
}
    </script>
