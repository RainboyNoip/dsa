<template>
<div class="wrapper-row">
  <div class="wrapper-code">
    <scene></scene>
  </div>
  <editor :src="src"></editor>
</div>
</template>
<script>
    import editor from './Editor.vue'
    import scene from './scene.vue'
    export default {
        data(){
            return{};
        },
        components:{
            editor,
            scene
        },
      props: {
        src:String
      }
    }
</script>
