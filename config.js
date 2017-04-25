//全局配置
// speed ---> 500 :2000

// 速度的比例尺
var speedScale = d3.scale.linear()
  .domain([1,100])
  .rangeRound([500,2500]);

globalConfig= {
  //速度
  speed:50,
  //地址
  api:'/'
}

function play(idx){
  this.render(frames[idx])
}

function _loadScript(url) {
  return new Promise(function(resolve,reject){
    var script = document.createElement("script");
    script.type = "text/javascript";
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            resolve()
          }
        };
      } else {
        script.onload = function () {
            resolve()
        };
      }
    script.src = url;
    document.body.appendChild(script);
  })
}

// 动态加载css文件
function loadStyles(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}

module.exports = {
  loadScript:_loadScript,
  loadStyles:loadStyles,
  //globalConfig
  speed:50,
  isplaying:false
}
