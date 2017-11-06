var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//全局变量
var height;
var width;
var _w = 20; //每个格子点像素宽
var _h = 20;//每个格子点像素高
var _wc; //格子的数量
var _hc;
var _data = []; //数据
var fill_color = "rgba(0,0,0,0.6)"
var time = 200
var isRendering = false
var Interval=null


//开始的位置
var padding = {
  left:150,
  top:200
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";


//左上角说明的数据
var explain_data = {
  title:'冒泡排序', //标题
  _explain:[ // 说明数据
    {
      title:'无序元素',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill",sorting)
            .attr("width",30)
            .attr("height",10)
            .attr("stroke","black")
            .attr("stroke-width","1px")
          }
        }
      ]
    },
    {
      title:'有序元素',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill",sorted)
            .attr("width",30)
            .attr("height",10)
            .attr("stroke","black")
            .attr("stroke-width","1px")
          }
        }
      ]
    }
  ]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:100,
  width:210
}
//增加--说明边框
function explain(){
  let expSvg = d3.select("div.scene").append("svg").attr("class","explain")
  .style("height",explain_postion.height+"px")
  .style("width",explain_postion.width+"px");

  let expSvgRect = expSvg.append("rect")
  .attr("class","outline")
  .attr("stroke","black")
  .attr("x",0)
  .attr("y",0)
  .attr("width",(explain_postion.width-10)+"px")
  .attr("height",(explain_postion.height-10)+"px");

  //创建标题
  expSvg.append("text")
  .attr("dx",30)
  .attr("dy",25)
  .text(explain_data.title);


  for(let i = 0;i < explain_data._explain.length;i++){
    let expg = expSvg.append("g")
    .attr('transform',d3Transform().translate(function () {
        return [20,(i+1)*20+explain_postion["padding-top"]];
    }));

    let t_exp = explain_data._explain[i].icon;
    expg.append("text")
    .attr("dx",40)
    .attr("dy",10)
    .attr("font-size","14px")
    .attr("text-anchor","start")
    .text(function(){
      return explain_data._explain[i].title
    });
    for(let j = 0;j<t_exp.length;j++){
      expg.append(t_exp[j].name)
        .call(t_exp[j].icon);
    }
  }
}


/* ----------数据代码------------ */

/* ------------------------ */

//初始化
function render_init(){
  var self = this;
  //颜色比例尺
  scaleColor = d3.scale.category10();
  //explain();
  //界面隐藏
  console.log('界面隐藏')
  __hideElem("[class='wrapper-code main']")
  __hideElem("div#logger")
  __hideElem("header")
  __hideElem("footer")
  ext_html()
  add_music()

  this.svg = d3.select("svg");
  gsvg = this.svg;
  console.log("生命游戏的规则:")
  console.log("一个活细胞周围有0,1个活细胞,它会因为寂寞而死")
  console.log("一个活细胞周围有2,3个活细胞,它保持不变")
  console.log("一个活细胞周围有超过3个活细胞,它会因为拥挤而死")
  console.log("一个死细胞周围有3个活细胞,它复活")


  __getInitVal()
  render_back()   //生成背景
  generate_data()

  random_life()
  render_life()
  auto_live()
}


//绘制每一帧的函数
function render(_status,_delay){
  //function 1
  //function 2
  //function 3
}


//关闭相关的界面显示
function __hideElem(Ele){
  let a = d3.select(Ele).style("display","none");
}

function __getInitVal(){

  let ___gsvg =$("svg")
  height = parseInt(___gsvg.height());
  width = parseInt(___gsvg.width());
  console.log("svg height:",height)
  console.log("svg width:",width)
  _wc = parseInt(width / _w)
  _hc = parseInt(height/ _h)
}


function render_back(){
  let i;
  for(i=0;i*_h<=height;i++){
    if(i % 5 == 0)
      draw_line(0,i*_h,width,i*_h,"rgba(0,0,0,0.5)");
    else
      draw_line(0,i*_h,width,i*_h,"rgba(0,0,0,0.2)");
  }

  for(i=0;i*_w<=width;i++){
    if(i % 5 == 0)
      draw_line(i*_w,0,i*_w,height,"rgba(0,0,0,0.5)");
    else
      draw_line(i*_w,0,i*_w,height,"rgba(0,0,0,0.2)");
  }
}

function draw_line(x1,y1,x2,y2,color){
  gsvg.append("line")
  .attr("x1",x1)
  .attr("x2",x2)
  .attr("y1",y1)
  .attr("y2",y2)
  .attr("stroke",color)
  .attr("stroke-width","1px")
}

function generate_data(){
  let i,j;
  for(i=0;i<=_hc;i++){
      _data.push([]);
    for(j=0;j<=_wc;j++){
      _data[i].push(0)
      gsvg.append("rect")
      .attr("height",_h-1)
      .attr("width",_w-1)
      .attr("x",j*_w+1)
      .attr("y",i*_h+1)
      .attr("stroke-width","0px")
      .attr("id","r"+i+"-"+j)
      .attr("fill","none")
    }
  }
}




function render_life(){
  let i,j;
  for(i=0;i<=_hc;i++){
    for(j=0;j<=_wc;j++){
      if(_data[i][j])
        gsvg.select("rect#r"+i+"-"+j).attr("fill",fill_color)
      else
        gsvg.select("rect#r"+i+"-"+j).attr("fill","none")
    }
  }
}

function random_life(){
  for(i=0;i<=_hc;i++){
    for(j=0;j<=_wc;j++){
      _data[i][j] = parseInt(Math.random()*2)
    }
  }
}


//生命活动
function life_live(){
  let data_t = []
  let i,j;
  for(i=0;i<=_hc;i++){
      data_t.push([])
      for(j=0;j<=_wc;j++){
          //计算8个方向的细胞数量
        let s = __neighborhood(i,j);
        if( s < 2){
          data_t[i].push(0)
        }
        else if( s == 2)
          data_t[i].push( _data[i][j])
        else if( s  == 3)
          data_t[i].push(1)
        else if( s >=4)
          data_t[i].push(0)
      }
  }

  for(i=0;i<=_hc;i++)
    for(j=0;j<=_wc;j++)
      _data[i][j] = data_t[i][j];

}

function __neighborhood(x,y){
  let cnt = 0;
  let i;
  //八个方向
  let direct = [ [-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1] ]

  for(i=0;i<8;i++){
    let tx = x +direct[i][0];
    let ty = y +direct[i][1];
    if( tx >=0 && ty >=0 && tx <=_hc && ty <=_wc){
          if( _data[tx][ty]) cnt++
    }
  }
  return cnt;
}


//自动运行
function auto_live(){
  Interval = setInterval(function(){
    if( isRendering == true)
      return;
    isRendering= true;
    life_live()
    render_life()
    isRendering = false;
  },time)
}


//播放音乐

var audio = `
<audio id="audio" src="dsa/lifeGame/Game_of_Thrones_8-bit.mp3" autoplay="autoplay" loop="loop">
`

function add_music(){
  $('body').append(audio)
}

function toggle_music_play(){
  let t = $(this).text()
  let player = $("#audio")[0];
  if( t == '■'){
    $(this).text("▶")
     player.pause()
  }
  else{
    $(this).text("■")
     player.play()
  }
}

//增强的html
var _ext_html = '\
<div class="tools">\
  <ul>\
    <li><button id="random">随机生成</button></li>\
    <li><button id="toggle_auto_life">切换自动</button></li>\
    <li><button id="still_lifes">Still lifes</button></li>\
    <li><button id="oscillators">Oscillators</button></li>\
    <li><button id="spaceships">Spaceships</button></li>\
    <li><button id="gliderGun">Glider gun</button></li>\
    <li><button id="play">■</button></li>\
  </ul>\
</div>\
'

var _ext_style=`
.tools {
  position:absolute;
  height:8px;
  background:#000;
  width:50px;
  padding:0px;
  text-align:center;
  overflow:hidden;
  left:50%;
}

.tools:hover {
  background:#eee;
  height:40px;
  width:100%;
  left:0;
}
.tools ul {
  padding:0px;
  margin:0;
  list-style:none;
}

.tools ul li{
  display:inline-block;
}
`

function ext_html(){
  $("div.wrapper-row").prepend(_ext_html)
  $("<style><style>").text(_ext_style).appendTo($("head"));
  $("button#toggle_auto_life").click(toggle_auto_life)
  $("button#random").click(button_random_life)
  $("button#play").click(toggle_music_play)

}


function toggle_auto_life(){
  if( Interval == null){
    isRendering = false;
    auto_live()
  }
  else{
    clearInterval(Interval)
    Interval = null;
  }
}

function button_random_life(){
  let pre_isRendering= false;
  if(Interval != null){
    toggle_auto_life()
    pre_isRendering = true;
  }
  random_life()
  render_life()
  if( pre_isRendering)
    toggle_auto_life()

}

var still_life = [
  "000000000000000000000000000",
  "011000011000011000000000000",
  "011000100100100100000000000",
  "000000011000010100000000000",
  "000000000000001000000000000",
]
