<template>
  <div class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h2 class="h3">Data Structure Alghoritm Animation</h2>
      </div>
      <div class="tree-list">
        <ul class="nav nav-list">
          <template v-for="category in categories">
            <li>
              <a class="folder">
              <span>{{category.name}}</span>
              </a>
              <ul class="nav nav-list">
                <li v-for="list in category.list">
                  <a :href = "'#/'+list.href" target="_blank">
                    <i :class="'iconfont '+(list.icon|| 'icon-default')"></i>
                    {{list.name}}
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        categories:[]
      }
    },
    mounted(){
      //加载json
      let self = this;
      let json_url = process.env.api+'dsa/categories.json';
      console.log("加载目录数据!");
      $.getJSON(json_url,function(data){
        self.categories = data.data
      })
    }
  }
</script>
