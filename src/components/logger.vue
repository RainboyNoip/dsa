<template>
    <div id="logger">
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        mounted(){
            this.$eventHub.$on('sendMessage',sendMessage);
            this.$eventHub.$on('clearMessage',clearMessage);
        },
        methods:{
            sendMessage:function(message){
                let messageBox = $("#logger");
                messageBox.append("<span>"+ message+"</span>");
                messageBox.scrollTop(messageBox[0].scrollHeight);
            },
            clearMessage:function(){
                $("#logger").empty();
            }
            
        }
    }
</script>
