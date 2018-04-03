var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//******************* 全局设定,参数

//*******************

//开始的位置
var padding = {
  left:150,
  top:200
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";

function _init_queen_back(__size){
  let t = queen_size + __size
  if( t <2 && t >8){
    alert("皇后最少2个,最多8个")
    return
  }
  d3.select("svg.explain>text").text(t+"皇后算法演示")
  gsvg.select("g#queen_back").remove()
  queen_array_init(t)
  //render_init()
  VM.re_init()
}

//左上角说明的数据
var explain_data = {
  title:'8皇后算法-找出一中方案-演示', //标题
  _explain:[]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:50,
  width:380
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

var rect_h,rect_w ;//定义高度
rect_h = rect_w = 50;
var img_src = "/dsa/4queen1/queen.jpg"

var start_point = {
  x :100,
  y :120
}

function render_queue_array(_status,_delay){
  let queen_back = gsvg.append('g').attr("id","queen_back")
  let line = queen_back.selectAll('g').data(_status.qa).enter()
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
    .attr("fill", function(d){
      //if( d.val == 0 && d.right == false)
        //return "rgba(255,255,255,0)"

      if( d.val == 1 )
        return "rgba(255,255,255,0)"

      if(d.val == 0 && d.now == 1){
          return "rgba(34,139,34,1)"
      }
      if(d.val == 0 )
          return "rgba(255,255,255,1)"
      }
    )
    .attr("stroke",function(d){
      if( d.right )
        return "#000"
      else
        return "#f00" //red
    })
    .attr("stroke-width",function(d){
      if(d.val == 0 && d.now) //是正在操作 不能放的格子
        return "4px"
      if(d.now == 0)
        return "2px" //red
    })

}

/* ------------------------ */

//初始化
function render_init(){
  var self = this;
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.1,10])
    .on('zoom', function () {
      self.svg.attr("transform", d3Transform()
        .translate(d3.event.translate)
        .scale(d3.event.scale))
    });

  //颜色比例尺
  scaleColor = d3.scale.category10();
  this.svg = d3.select("svg").call(zoom);
  gsvg = this.svg;
  explain();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_queue_array(_status,_delay)
  //function 1
  //function 2
  //function 3
}
