<template>
<header>
    <div class ="header-left play-button-c">
      <div class="play-button" title="减速">
        <button v-on:click="setSpeed(speed-10)">
          <i class="iconfont icon-kuai"></i>
        </button>
      </div>
      <div class="play-button" title="加速">
        <button v-on:click="setSpeed(speed+10)">
          <i class="iconfont icon-icon"></i>
        </button>
      </div>
    </div>
  <div class ="range-bar header-middle" ref="rangebar">
      <div class ="progress" style="width:100%" :style="{cursor:isPlaying?'not-allowed':'pointer'}">
          <template v-for="idx in speed">
              <div class="process-cell process-cell-active" v-on:click="setSpeed(idx)">
              </div>
          </template>
          <template v-for="idx in 100-speed" >
              <div class="process-cell" v-on:click="setSpeed(speed+idx)">
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
  props: {
    speed:{
      type:Number,
      required:true
    },
    isPlaying:{
      type:Boolean,
      required:true
    }
  },
    mounted(){
        $('.popdown').popdown();
    },
    methods:{
        progress:function(a){
          globalConfig.speed = speedScale(val);
          console.log(globalConfig.speed)
        },
        setSpeed:function(val){
          this.$eventHub.$emit("setSpeed",val)
        }
    }
}
</script>

