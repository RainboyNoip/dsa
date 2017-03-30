<template>
<div class="wrapper-row">
  <div class="wrapper-code">
    <div class="list">
      <div class="input-group">
        <input class="input-button active" readonly="" value="出栈" title="出栈">
      </div>
    </div>
    <scene></scene>
  </div>
  <editor></editor>
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
        }
    }
</script>
