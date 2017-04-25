//加载js 和 css

function loadScript(src_url){
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src_url;
  document.body.appendChild(script);
}

// 动态加载css文件
function loadStyles(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}

module.exports = function(_url){
  let extname =    _url.substring(_url.lastIndexOf('.') + 1);
  if( extname === 'js')
    loadScript(_url);
  else if( extname === 'css')
    loadStyles(_url);
  else
    throw new TypeError("只能使用css或者js后缀名.\n"+
      "当前文件:"+_url+"\n"+
      "后缀名:"+extname)
}

//新的loader 基于Promise
function _loadScript(url) {
  return new Promise(function(reslove,reject){
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
