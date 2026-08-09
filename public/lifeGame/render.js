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
  window.demoAdapter = {
    continuous: true,
    play: start_life,
    pause: stop_life,
    reset: reset_life,
    setSpeed: set_life_speed
  }
}


//绘制每一帧的函数
function render(_status,_delay){
  //function 1
  //function 2
  //function 3
}


function __getInitVal(){
  let bounds = document.querySelector(".scene > svg").getBoundingClientRect();
  height = Math.floor(bounds.height);
  width = Math.floor(bounds.width);
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
  for(let i=0;i<=_hc;i++){
    for(let j=0;j<=_wc;j++){
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
  stop_life()
  Interval = setInterval(function(){
    if( isRendering == true)
      return;
    isRendering= true;
    life_live()
    render_life()
    isRendering = false;
  },time)
}

function start_life(){
  if(Interval == null) auto_live()
  update_life_controls()
}

function stop_life(){
  if(Interval != null) clearInterval(Interval)
  Interval = null
  update_life_controls()
}

function reset_life(){
  random_life()
  render_life()
}

function set_life_speed(speed){
  time = Math.round(1100 - ((speed - 1) / 99) * 1020)
  _set_time_display()
  if(Interval != null) auto_live()
}


//播放音乐

function add_music(){
  let audio = document.createElement("audio")
  audio.id = "audio"
  audio.src = "./Game_of_Thrones_8-bit.mp3"
  audio.loop = true
  document.body.appendChild(audio)
}

function toggle_music_play(){
  let player = document.querySelector("#audio")
  if(!player.paused){
    player.pause()
  }
  else{
    player.play().catch(function(){})
  }
  window.setTimeout(update_life_controls, 0)
}

//增强的html
var _ext_html = '\
<div class="tools">\
  <ul>\
    <li><span id="show_time">每代 '+time+' ms</span></li>\
    <li><button id="random">随机生成</button></li>\
    <li><button id="still_lifes">静物</button></li>\
    <li><button id="oscillators">振荡器</button></li>\
    <li><button id="spaceships">飞船</button></li>\
    <li><button id="gliderGun">滑翔机枪</button></li>\
    <li><button id="toggle_auto_life">开始演化</button></li>\
    <li><button id="music">播放音乐</button></li>\
  </ul>\
</div>\
'

function ext_html(){
  document.querySelector(".scene").insertAdjacentHTML("beforeend", _ext_html)
  document.querySelector("#toggle_auto_life").addEventListener("click", toggle_auto_life)
  document.querySelector("#still_lifes").addEventListener("click", still_life_set)
  document.querySelector("#oscillators").addEventListener("click", Oscillators_life_set)
  document.querySelector("#gliderGun").addEventListener("click", gliderGun_set)
  document.querySelector("#random").addEventListener("click", button_random_life)
  document.querySelector("#spaceships").addEventListener("click", Spaceships_life_set)
  document.querySelector("#music").addEventListener("click", toggle_music_play)
}

function _set_time_display(){
  let output = document.querySelector("#show_time")
  if(output) output.textContent = "每代 "+time+" ms"
}

function update_life_controls(){
  let toggle = document.querySelector("#toggle_auto_life")
  let music = document.querySelector("#music")
  let player = document.querySelector("#audio")
  if(toggle) toggle.textContent = Interval == null ? "开始演化" : "暂停演化"
  if(music && player) music.textContent = player.paused ? "播放音乐" : "暂停音乐"
}


function toggle_auto_life(){
  if( Interval == null){
    window.demoPlayer.play()
  }
  else{
    window.demoPlayer.pause()
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
  "00000000000000000000000000000",
  "01100001100001100001100001000",
  "01100010010010010001010010100",
  "00000001100001010000100001000",
  "00000000000000100000000000000",
]

var Oscillators = [
  "000000000000000000000000000000000000",
  "000000000000000000000000000000000000",
  "000000011100011000000000000000000000",
  "011100111000011000000000000001110000",
  "000000000000000110000000000010001000",
  "000000000000000110000000000010001000",
  "000000000000000000000000000001110000",
  "000000000000000000000000000000000000",
  "000000000000000000000000000000000000",
  "000000011100011100000000000000000000",
  "000000000000000000000000000000000000",
  "000001000010100001000000000001110000",
  "000001000010100001000000000010001000",
  "000001000010100001000000000010001000",
  "000000011100011100000000000001110000",
  "000000000000000000000000000000000000",
  "000000011100011100000000000000000000",
  "000001000010100001000000000000000000",
  "000001000010100001000000000000000000",
  "000001000010100001000000000000000000",
  "000000000000000000000000000000000000",
  "000000011100011100000000000000000000",
  "000000000000000000000000000000000000",
  "000000000000000000000000000000000000",
]



var Spaceships = [
  "0000000000000000000000000000000",
  "0001000000000000000000000000000",
  "0000110000000001111000000000000",
  "0001100000000010001000000000000",
  "0000000000000000001000000000000",
  "0000000000000010010000000000000",
  "0000000000000000000000000000000",
  "0000000000000000000000000000000",
]



var gliderGun = [
  "00000000000000000000000000000000000000",
  "00000000000000000000000001000000000000",
  "0000000000000000000000010100000000000",
  "00000000000001100000011000000000000110",
  "00000000000010001000011000000000000110",
  "01100000000100000100011000000000000000",
  "01100000000100010110000101000000000000",
  "00000000000100000100000001000000000000",
  "00000000000010001000000000000000000000",
  "00000000000001100000000000000000000000",
  "00000000000000000000000000000000000000",
]


function clear_life(){
  let i,j;
  for(i=0;i<=_hc;i++){
    for(j=0;j<=_wc;j++)
      _data[i][j] = 0;
  }
}

function get_array_size(arr){
  let h = arr.length
  let w = arr[0].length
  return {
    h:h,
    w:w
  }
}

function gliderGun_set(){
  let _size = get_array_size(gliderGun)

  if( _size.h+1>_hc || _size.w+1 > _wc){
    alert("棋盘太小,显示不了!");
    return 0;
  }


  let pre_isRendering= false;
  if(Interval != null){
    toggle_auto_life()  //停
    pre_isRendering = true;
  }
  clear_life()

  let i,j;
  for(i=0;i<gliderGun.length;i++)
    for(j=0;j<gliderGun[i].length;j++)
      _data[i][j] = gliderGun[i][j]=='1'?1:0;

  render_life()
  if( pre_isRendering)
    toggle_auto_life() //启动

}

function still_life_set(){
  let _size = get_array_size(still_life)

  if( _size.h+1>_hc || _size.w+1 > _wc){
    alert("棋盘太小,显示不了!");
    return 0;
  }


  let pre_isRendering= false;
  if(Interval != null){
    toggle_auto_life()  //停
    pre_isRendering = true;
  }
  clear_life()

  let i,j;
  for(i=0;i<still_life.length;i++)
    for(j=0;j<still_life[i].length;j++)
      _data[i][j] = still_life[i][j]=='1'?1:0;

  render_life()
  if( pre_isRendering)
    toggle_auto_life() //启动

}


function Oscillators_life_set(){
  let _size = get_array_size(Oscillators)

  if( _size.h+1>_hc || _size.w+1 > _wc){
    alert("棋盘太小,显示不了!");
    return 0;
  }


  let pre_isRendering= false;
  if(Interval != null){
    toggle_auto_life()  //停
    pre_isRendering = true;
  }
  clear_life()

  let i,j;
  for(i=0;i<Oscillators.length;i++)
    for(j=0;j<Oscillators[i].length;j++)
      _data[i][j] =Oscillators[i][j]=='1'?1:0;

  render_life()
  if( pre_isRendering)
    toggle_auto_life() //启动

}

function Spaceships_life_set(){
  let _size = get_array_size(Spaceships)

  if( _size.h+1>_hc || _size.w+1 > _wc){
    alert("棋盘太小,显示不了!");
    return 0;
  }


  let pre_isRendering= false;
  if(Interval != null){
    toggle_auto_life()  //停
    pre_isRendering = true;
  }
  clear_life()

  let i,j;
  for(i=0;i<Spaceships.length;i++)
    for(j=0;j<Spaceships[i].length;j++)
      _data[i][j] =Spaceships[i][j]=='1'?1:0;

  render_life()
  if( pre_isRendering)
    toggle_auto_life() //启动

}
