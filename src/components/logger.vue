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
            this.$eventHub.$on('sendMessage',this.sendMessage);
            this.$eventHub.$on('clearMessage',this.clearMessage);
        },
        methods:{
            sendMessage:function(message,_delay){
              console.log('hee')
                let messageBox = $("#logger");
                messageBox.append("<p>"+ message+"</p>");
                //messageBox.scrollTop(messageBox[0].scrollHeight);
              messageBox.animate({
                scrollTop:messageBox[0].scrollHeight
              },_delay)
            },
            clearMessage:function(){
                $("#logger").empty();
            }
        }
    }
</script>
