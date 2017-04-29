<template>
<div class="wrapper-row">
  <div class="wrapper-code">
    <scene></scene>
    <logger></logger>
  </div>
  <editor :src="src"></editor>
</div>
</template>
<script>
    import editor from './Editor.vue'
    import scene from './scene.vue'
    import logger from './logger.vue'
    export default {
        data(){
            return{};
        },
        components:{
            editor,
            scene,
            logger
        },
      props: {
        src:String
      }
    }
</script>
