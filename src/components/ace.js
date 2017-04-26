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
      Range:null,
      marker:null
    };
  },

  mounted: function () {
    var vm = this;
    var lang = vm.lang;
    var theme = vm.theme;
    var editor = vm.editor = ace.edit(vm.$el);
    vm.Range = ace.require('ace/range').Range;
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
      console.log(s,t);
      var self = this;
      self.editor.resize(true);
      self.editor.gotoLine(s, t-s, true);
      if(self.marker !== null){
        self.editor.session.removeMarker(self.marker);
      }
      self.marker = self.editor.session.addMarker(new self.Range(s-1, 0, t, 0), "active_line", "line");
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
