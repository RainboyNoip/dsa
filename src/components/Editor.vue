<template>
<div class="wrapper-code main">
    <editor :content="src" :lang="'c_cpp'" :theme="'tomorrow_night_blue'" :sync="true" 
        :height="'100%'"
        :width="'100%'"
        :options="options"></editor>
</div>
</template>
<script>
import editor from './ace.js'
import 'brace/mode/c_cpp'
import 'brace/theme/tomorrow_night_blue'
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
