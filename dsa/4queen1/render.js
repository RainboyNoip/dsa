var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//******************* 全局设定,参数

var rect_h,rect_w ;//定义高度
rect_h = rect_w = 50;
var img_src = "/dsa/4queen1/queen.jpg"

var start_point = {
  x :80,
  y :80
}


var _4queenArray = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]


var _8queenArray = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
]

var queenArray = _4queenArray
rect_h = rect_w = 100;

//*******************



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
  title:'4皇后-游戏[点击]', //标题
  _explain:[]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:50,
  width:200
}
//增加--说明边框
function explain(){
  let expSvg = d3.select("div.scene").append("svg").attr("class","explain")
  .style("height",explain_postion.height+"px")
  .style("width",explain_postion.width+"px")
  .style("cursor","pointer")
  .on("click",function(){
    if(expSvg.select("text").text()[0] == '4'){
      expSvg.select("text").text('8皇后-游戏[点击]')
      rect_h = rect_w = 50;
      queenArray = _8queenArray
    }
    else {
      expSvg.select("text").text('4皇后-游戏[点击]')
      rect_h = rect_w = 100;
      queenArray = _4queenArray
    }

    //重新渲染
    gsvg.select('g#queen_back').remove()
    render_4queue_back()
    
  })

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


function render_4queue_back(){
  let queen_back = gsvg.append('g').attr("id","queen_back")
  let line = queen_back.selectAll('g').data(queenArray).enter()
    .append("g")
    .attr("id","queen_back_line")
    .attr('transform',d3Transform().translate(function (d,idx) {
      return [start_point.x,start_point.y+rect_h*idx];
    }));


  line.selectAll("image").data(function(d){return d})
  .enter()
    .append("image")
    .attr('height',rect_h)
    .attr('width',rect_w)
    .attr("x",function(d,idx){
      return idx*rect_w
    })
    .attr("preserveAspectRatio","none meet")
    .attr("xlink:href",img_src)

  line.selectAll("rect")
    .data(function(d){return d})
    .enter()
    .append('rect')
    .attr("id",function(d,idx){
      return "rect-"+idx;
    })
    .attr("x",function(d,idx){
      return rect_w*idx;
    })
    .attr("height",rect_h)
    .attr("width",rect_w)
    .attr("fill","rgba(255,255,255,1)")
    .attr("stroke","#000")
    .attr("stroke-width","2px")
    .on("click",function(){
      if(d3.select(this).attr("fill") == "rgba(255,255,255,0)")
      d3.select(this).attr("fill","rgba(255,255,255,1)")
  else
      d3.select(this).attr("fill","rgba(255,255,255,0)")
    })

}

/* ------------------------ */

//初始化
function render_init(){
  var self = this;
  //var zoom = d3.behavior.zoom()
    //.scaleExtent([0.1,10])
    //.on('zoom', function () {
      //self.svg.attr("transform", d3Transform()
        //.translate(d3.event.translate)
        //.scale(d3.event.scale))
    //});

  //颜色比例尺
  scaleColor = d3.scale.category10();
  this.svg = d3.select("svg")//.call(zoom);
  gsvg = this.svg;
  explain();
  render_4queue_back();
}


//绘制每一帧的函数
function render(_status,_delay){
  //function 1
  //function 2
  //function 3
}
