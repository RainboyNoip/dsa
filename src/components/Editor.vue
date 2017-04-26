<template>
<div class="wrapper-code main">
    <editor :content="src" :lang="'c_cpp'" :theme="'solarized_dark'" :sync="true" 
        :height="'100%'"
        :width="'100%'"
        :options="options"></editor>
</div>
</template>
<script>
import editor from './ace.js'
export default {
    data(){
        return{
            options:{
                fontSize: '18pt',
                readOnly:true,
                highlightActiveLine: false,
                highlightGutterLine: false
            }
        };
    },
    components: {
        editor
    },
    props: {
        src:String
    },
}
</script>
