<template>
    <div class="wrapper">
      <myheader></myheader>
      <painter :src="src"></painter>
      <myfooter></myfooter>
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
      frames:[]
    }
  },
  mounted(){
    console.log("开始加载DAS数据:--");
    console.log("要加载的DAS数据地址是:/dsa/function_pass_parameter/");
    let base_url = 'dsa/function_pass_parameter/'
    let app = this.app;
    let self = this;
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
        console.log('生成frames数据');
        self.frames = lineExports.init();
    })
    //生成frames数据
    //设定frame宽度
  },
    methods:{
        hl:function(s,t){ //高亮行
            this.$eventHub.$emit('hl-lines',s,t)
        }
    },
  components:{
    myheader,
    painter,
    myfooter
  }
}
</script>

<style>
</style>
