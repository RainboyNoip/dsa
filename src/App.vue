<template>
    <div class="wrapper">
      <myheader></myheader>
      <painter></painter>
      <myfooter></myfooter>
    </div>
</template>

<script>
import myheader from './components/Header.vue'
import painter from './components/painter.vue'
import myfooter from './components/Footer.vue'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    myheader,
    painter,
    myfooter
  }
}
</script>

<style>
</style>
