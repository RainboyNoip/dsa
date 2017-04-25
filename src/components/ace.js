var ace = require('brace');

module.exports = {
  template: '<div :style="{height: height, width: width}"></div>',

  props: {
    content: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: 'javascript'
    },
    theme: {
      type: String,
      default: 'chrome'
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    },
    sync: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: function () { return {}; }
    }
  },

  data: function () {
    return {
      editor: null,
      Range:null
    };
  },

  mounted: function () {
    var vm = this;
    var lang = vm.lang;
    var theme = vm.theme;
    var editor = vm.editor = ace.edit(vm.$el);
    //vm.Range = ace.require('ace/range').Range;
    var options = vm.options;
    editor.renderer.$cursorLayer.element.style.display = "none"
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode('ace/mode/' + lang);
    editor.setTheme('ace/theme/' + theme);
    editor.setValue(vm.content, 1);
    editor.setOptions(options);
    editor.on('change', function () {
      vm.$parent.$emit('editor-update', editor.getValue());
    });
    vm.$eventHub.$on('hl-lines',this.heightLines)
  },
  methods:{
    heightLines:function(s,t){
      s--;t--;
      console.log("he line")
      var aceLines = document.getElementsByClassName("ace_line");
      var gutters = document.getElementsByClassName("ace_gutter-cell");
      var gutLineNo = parseInt(gutters[0].innerHTML)-1;
      //remove all class
      for(let i =0;i<aceLines.length;i++){
        this.removeClass(aceLines[i],'hl-line');
        this.removeClass(gutters[i],'hl-line');
      }
      for(let i =s;i<=t;i++){
        aceLines[i].className += " "+'hl-line';
        gutters[i].className += " "+'hl-line';
      }
    },
    hasClass:function (obj, cls) {  
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
    },
    removeClass:function (obj, cls) {  
        if (this.hasClass(obj, cls)) {  
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
                  obj.className = obj.className.replace(reg, ' ');  
              }  
    }
  },

  watch: {
    content: function (newContent) {
      var vm = this;
      if (vm.sync) {
        vm.editor.setValue(newContent, 1);
      }
    },

    theme: function (newTheme) {
      var vm = this;
      vm.editor.setTheme('ace/theme/' + newTheme);
    }
  }
};
