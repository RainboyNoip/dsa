<template>
  <footer>
    <div class="header-left play-button-c">
      <div class="play-button" v-bind:title="play?'播放':'暂停'">
        <button v-on:click="playFunc">
          <i v-bind:class="['iconfont',play?'icon-bofang':'icon-zanting']"></i>
        </button>
      </div>
      <div class="play-button" title="重置">
        <button v-on:click="setPlayFrameIdx(1)">
          <i class="iconfont icon-zhongzhi"></i>
        </button>
      </div>
    </div>
    <div class="range-bar header-middle" >
      <div class="progress"  style="width: 100%;">
          <template v-for="idx in play_frame_idx">
            <div class="process-cell process-cell-active" v-on:click="setPlayFrameIdx(idx)">
              {{idx}}
            </div>
          </template>
          <template v-for="idx in frame_total - play_frame_idx" >
            <div class="process-cell" v-on:click="setPlayFrameIdx(play_frame_idx+idx)">
              {{play_frame_idx+idx}}
            </div>
          </template>
      </div>
    </div>
    <div class="header-right play-button-c" >
      <div class="play-button" title="上一帧">
        <button v-on:click="setPlayFrameIdx(play_frame_idx-1)">
          <i class="iconfont icon-shangyishou"></i>
        </button>
      </div>
      <div class="play-button" type="button" disabled="disabled" title="下一帧">
        <button v-on:click="setPlayFrameIdx(play_frame_idx+1)">
          <i class="iconfont icon-xiayizhen"></i>
        </button>
      </div>
    </div>
    </div>
  </footer>
</template>

<script>
export default {
    data(){
        return {
          play:true, //显示播放图标 还是暂停图标
          play_frame_idx:1,//正在播放的第几帧
          frame_total:10 //一共有多少帧
        }
    },
  mounted(){
    var vm = this;
    vm.$eventHub.$on('setFrameTotal',this.setFrameTotal);
    vm.$eventHub.$on('setPlayFrameIdx',this.setPlayFrameIdx);
  },
    methods:{
        playFunc:function(){
            if(this.play){
                this.play = false;
            }
            else{
                this.play = true;
            }
        },
      setFrameTotal:function(val){
        this.frame_total = val;
      },
      setPlayFrameIdx:function(val){
        console.log(val)
        // 如果是在播放的时候,是不能点击手动更改帧的,也一能重置
        if(val > this.frame_total)
          this.play_frame_idx = this.frame_total
        else if( val < 1)
          this.play_frame_idx = 1;
        else
          this.play_frame_idx = val;
      }
    }

}
</script>
