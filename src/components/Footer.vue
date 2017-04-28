<template>
  <footer>
    <div class="header-left play-button-c">
      <div class="play-button" v-bind:title="play?'播放':'暂停'">
        <button v-on:click="playFunc">
          <i v-bind:class="['iconfont',isPlaying?'icon-zanting':'icon-bofang']"></i>
        </button>
      </div>
      <div class="play-button" title="重置">
        <button v-on:click="setPlayFrameIdx(1)">
          <i class="iconfont icon-zhongzhi"></i>
        </button>
      </div>
    </div>
    <div class="range-bar header-middle" >
      <div class="progress"  style="width: 100%;" :style="{cursor:isPlaying?'not-allowed':'pointer'}">
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
        <button v-on:click="setPlayFrameIdx(play_frame_idx-1)" :style="{cursor:isPlaying?'not-allowed':'pointer'}">
          <i class="iconfont icon-shangyishou"></i>
        </button>
      </div>
      <div class="play-button" type="button" disabled="disabled" title="下一帧">
        <button v-on:click="setPlayFrameIdx(play_frame_idx+1)" :style="{cursor:isPlaying?'not-allowed':'pointer'}">
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
            }
        },
        props: {
            frame_total: {
                type: Number,
                required: true
            },
            play_frame_idx:{
                type: Number,
                required: true
            },
          isPlaying:{
            type:Boolean,
            required: true
          }
        },
        mounted(){
            //var vm = this;
            //vm.$eventHub.$on('setFrameTotal',this.setFrameTotal);
            //vm.$eventHub.$on('setPlayFrameIdx',this.setPlayFrameIdx);
        },
        methods:{
            playFunc:function(){
              this.$eventHub.$emit('toggle_play')
            },
            setPlayFrameIdx:function(val){
              console.log('设置帧:'+val);
              if( this.isPlaying){
                console.log('正在播放,不能设置');
                return ;
              }
              this.$eventHub.$emit('setPlayFrameIdx',val);
            }
        }

    }
    </script>
