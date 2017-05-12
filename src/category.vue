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
              <i :class="'iconfont '+pick_fruit(category.name)"></i>
              <span>{{category.name}}</span>
              </a>
              <ul class="nav nav-list">
                <li v-for="list in category.list">
                  <a :href = "'#/'+list.href" target="_blank">
                    <i :class="'iconfont '+pick_fruit(list.name)"></i>
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
      let json_url = process.env.api+'dsa/categories.txt';
      console.log("加载目录数据!");
      console.log(json_url);
      $.get(json_url)
        .then(function(data){
          //console.log(data)
          let ans = self.parseCategory(data);
          self.categories = ans;
        })
        .fail(function(){
          console.log('加载'+json_url+'失败!');
        })
    },
    methods:{
      pick_fruit:function(str){
        let self = this;
        let _fonts = ['icon-boluo', 'icon-baixiangguo', 'icon-chengzi', 'icon-boluomei', 'icon-caomei', 'icon-dayouzi', 'icon-chelizi', 'icon-fanqie', 'icon-hamigua', 'icon-ganlan', 'icon-juzi', 'icon-heimei', 'icon-huolongguo', 'icon-hongmei', 'icon-lizi', 'icon-lanmei', 'icon-mangguo', 'icon-mihoutao', 'icon-longyan', 'icon-mugua', 'icon-lizi1', 'icon-ningmeng', 'icon-niuyouguo', 'icon-manyuemei', 'icon-pingguo', 'icon-qingning', 'icon-pipa', 'icon-shanzhu', 'icon-putao', 'icon-shiliu', 'icon-sangshen', 'icon-shizi', 'icon-shuimitao', 'icon-yezi', 'icon-xigua', 'icon-yangtao', 'icon-yingtao', 'icon-xiangjiao', 'icon-zao', 'icon-yangmei'];
        return _fonts[ self.hashCode(str) %(_fonts.length)]
      },
      hashCode: function hash(input){
          var hash = 5381;
          var i = input.length - 1;

          if(typeof input == 'string'){
            for (; i > -1; i--)
              hash += (hash << 5) + input.charCodeAt(i);
          }
          else{
            for (; i > -1; i--)
              hash += (hash << 5) + input[i];
          }
          var value = hash & 0x7FFFFFFF;
          return value;
      },
      parseCategory:function(_str){
        let reg1 = /^([\s\S]+):$/
        let reg2 = /^\ {4}-([\s\S]+)\|([\s\S]+)$/
        let _str_array = _str.split('\n')
        let category = []
        for(let i =0;i<_str_array.length;i++){
          if(reg1.test(_str_array[i]))
            category.push({
              name: _str_array[i].match(reg1)[1],
              list:[]
            })
            else if(reg2.test(_str_array[i])){
              let ans = _str_array[i].match(reg2)
              category[category.length-1].list.push({
                name:ans[1],
                href:ans[2]
              })
            }
        }
        return category;
      }
    }
  }
</script>
