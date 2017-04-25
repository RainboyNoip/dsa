<template>
<header>
    <div class ="header-left play-button-c">
      <div class="play-button" title="减速">
        <button v-on:click="speedDown">
          <i class="iconfont icon-icon"></i>
        </button>
      </div>
      <div class="play-button" title="加速">
        <button v-on:click="speedUp">
          <i class="iconfont icon-kuai"></i>
        </button>
      </div>
    </div>
  <div class ="range-bar header-middle" ref="rangebar">
      <div class ="progress" style="width:100%" >
          <template v-for="idx in processActive">
              <div class="process-cell process-cell-active" v-on:click="speedSet(idx)">
              </div>
          </template>
          <template v-for="idx in 100-processActive" >
              <div class="process-cell" v-on:click="speedSet(processActive+idx)">
              </div>
          </template>
      </div>
  </div>
  <div class ="header-right  play-button-c">
      <div class="play-button" title="关于">
        <a href="/pages/about.html" class="popdown btn" >
          <button >
            <i class="iconfont icon-guanyu1"></i>
          </button>
        </a>
      </div>
      <div class="play-button" title="帮助">
        <a href="/pages/help.html" class="popdown btn" >
          <button >
            <i class="iconfont icon-bangzhu"></i>
          </button>
        </a>
      </div>
  </div>
</header>
</template>

<script>
export default {
  data () {
    return {
        prog:80,
        processActive:39
    }
  },
    mounted(){
        $('.popdown').popdown();
    },
    methods:{
        progress:function(a){
          //console.log(a.offsetX)
          globalConfig.speed = speedScale(val);
          console.log(globalConfig.speed)
        },
        speedSet:function(val){
            if( val>100 || val <1)
                alert('设定速度的范围必须在1--100之间');
            else {
                this.processActive = val;
                console.log('当前速度是:'+val)
                globalConfig.speed = speedScale(this.processActive);
                console.log('当前真时速度是:'+globalConfig.speed+'ms')
            }
        },
        speedUp:function(){
            this.processActive = (this.processActive+10) > 100 ?100:this.processActive+10
            console.log('当前速度是:'+this.processActive);
            globalConfig.speed = speedScale(this.processActive);
            console.log('当前真时速度是:'+globalConfig.speed+'ms')
        },
        speedDown:function(){
            this.processActive = (this.processActive-10) < 1 ?1:this.processActive-10
            console.log('当前速度是:'+this.processActive);
            globalConfig.speed = speedScale(this.processActive);
            console.log('当前真时速度是:'+globalConfig.speed+'ms')
        },
    }
}
</script>

