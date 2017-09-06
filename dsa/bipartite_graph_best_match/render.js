var gstatus;
var delay;
var gbase;
var gsvg;
var bsvg;
var scaleColor;

var scale = 1.2
var gx  = 100
var gy = 120
//开始的位置

var padding = {
  left:150,
  top:200
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";

var x_range = 250; // 左右点空间
var y_range = 80; //  上下点空间
var r = 20; // 半径

var a_start = [0,0]
var b_start = [0,x_range]

var path1 = [
[1,1,3],
[1,2,5],
[1,3,5],
[1,4,4],
[1,5,1],
[2,1,2],
[2,2,2,],
[2,4,2],
[2,5,2],
[3,1,2],
[3,2,4],
[3,3,4],
[3,4,1],
[4,2,1],
[4,3,1],
[5,1,1],
[5,2,2],
[5,3,1],
[5,4,3],
[5,5,3]
]

var line_text_pos = 1/6

//左上角说明的数据
var explain_data = {
  title:'二分图-最佳匹配', //标题
  _explain:[ // 说明数据
  ]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:50,
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

function render_visx_point(_status,_delay){
  let xp = gsvg.selectAll("circle#xp").data(_status.visx)

  xp
  .transition()
  .duration(_delay)
    .attr("fill",function(d,i){
    if( d == 0)
      return "none"
    else 
      return "rgba(0,255,0,0.2)"
  })

  xp.enter().append("circle")
      .attr("id","xp")
    .attr("fill","none")
    .attr("r",r)
    .attr("cx",0)
    .attr("cy",function(d,i){
      return i*y_range;
    })

}

function render_visy_point(_status,_delay){
  let yp = gsvg.selectAll("circle#yp").data(_status.visy)

  yp
  .transition()
  .duration(_delay)
    .attr("fill",function(d,i){
    if( d == 0)
      return "none"
    else 
      return "rgba(0,255,0,0.2)"
  })

  yp.enter().append("circle")
      .attr("id","yp")
    .attr("fill","none")
    .attr("r",r)
    .attr("cx",x_range)
    .attr("cy",function(d,i){
      return i*y_range;
    })

}
function render_start_point(_status,_delay){
  let sp = gsvg.selectAll("circle#sp").data(_status.sp)

  sp.attr("fill",function(d,i){
    if( d == 0)
      return "none"
    else 
      return "rgba(0,0,255,0.2)"
  })

  sp.enter().append("circle")
      .attr("id","sp")
    .attr("fill","none")
    .attr("r",r)
    .attr("cx",0)
    .attr("cy",function(d,i){
      return i*y_range;
    })
}

function render_path_color(_status,_delay){
  let pc = bsvg.selectAll("line#color").data(_status.path_c)

  pc.attr("stroke",function(d){
    if( d[2] == 2)
      return "rgba(0,255,0,2)"
    return "rgba(0,0,0,"+d[2]+")"
  })

  pc.enter().append("line")
    .attr("id","color")
    .attr("stroke","rgba(0,0,0,0.2)")
    .attr("stroke-width",1.5)
    .attr("x1",0)
    .attr("y1",function(d){
      return (d[0]-1)*y_range;
    })
    .attr("x2",x_range)
    .attr("y2",function(d){
      return (d[1]-1)*y_range;
    })

  pc.exit().remove()
}

function render_path_grow(_status,_delay){
  let pg = bsvg.selectAll("line#grow").data(_status.path_c)

  pg
  .transition()
  .duration(_delay)
  .attr("x2",function(d){
    if( d[3] == 1)
      return x_range;
    else
      return 0;
  })
  .attr("y2",function(d){
    if( d[3] == 1)
      return (d[1]-1)*y_range;
    else
      return (d[0]-1)*y_range;
  })

  pg.enter().append("line")
    .attr("id","grow")
    .attr("stroke","blue")
    .attr("stroke-width",1.5)
    .attr("x1",0)
    .attr("y1",function(d){
      return (d[0]-1)*y_range;
    })
    .attr("x2",0)
    .attr("y2",function(d){
      return (d[0]-1)*y_range;
    })
}

function render_match(_status,_delay){
  let bm = gsvg.selectAll("text#match").data(_status.match)

  bm.text(function(d,i){
      if(d == -1)
        return "match["+(i+1)+"]: -1";
      return "match["+(i+1)+"]: x"+(d+1);
    })

  bm.enter().append("text")
    .attr("id","match")
    .attr("font-size","14px")
    .attr("x",x_range+r+r/2+60)
    .attr("y",function(d,i){
      return i*y_range+5;
    })
    .attr("text-anchor","start")
    .text(function(d,i){
      return "match["+(i+1)+"]: "+d;
    })
}

function render_Ai(_status,_delay){
  let ag = gsvg.selectAll("text#A").data(_status.A)

  ag.text(function(d,i){
      return "A["+(i+1)+"]: "+d;
    })

  ag.enter().append("text")
    .attr("id","A")
    .attr("font-size","14px")
    .attr("x",-r-r/2)
    .attr("y",function(d,i){
      return i*y_range+5;
    })
    .attr("text-anchor","end")
    .text(function(d,i){
      return "A["+(i+1)+"]: "+d;
    })
}

function render_Bi(_status,_delay){
  let bg = gsvg.selectAll("text#B").data(_status.B)

  bg.text(function(d,i){
      return "B["+(i+1)+"]: "+d;
    })

  bg.enter().append("text")
    .attr("id","B")
    .attr("font-size","14px")
    .attr("x",x_range+r+r/2)
    .attr("y",function(d,i){
      return i*y_range+5;
    })
    .attr("text-anchor","start")
    .text(function(d,i){
      return "B["+(i+1)+"]: "+d;
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

  //画 图
  draw_bg_line();
  draw_bg();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_path_color(_status,_delay)
  render_path_grow(_status,_delay)
  render_Ai(_status,_delay)
  render_Bi(_status,_delay)
  render_match(_status,_delay)
  render_start_point(_status,_delay)
  render_visx_point(_status,_delay);
  render_visy_point(_status,_delay);
  //function 2
  //function 3
}

function draw_bg(){
  gsvg  = d3.select("svg").append("g")
    .attr("id","bg")
    .attr('transform',d3Transform().translate(function () {
      return [gx,gy];
    }).scale(function () {
      return [scale];
    })
    )

  for(let i =0 ;i <5;i++){
    gsvg.append("circle")
    .attr("stroke","#000")
    .attr("stroke-width",1.5)
    .attr("fill","#fff")
    .attr("r",r)
    .attr("cx",0)
    .attr("cy",i*y_range)
    
    gsvg.append("text")
    .attr("font-size","14px")
    .attr("x",0)
    .attr("y",i*y_range+5)
    .attr("text-anchor","middle")
    .text("x"+(i+1))
  }

  for(let i =0 ;i <5;i++){
    gsvg.append("circle")
    .attr("stroke","#000")
    .attr("stroke-width",1.5)
    .attr("fill","#fff")
    .attr("r",r)
    .attr("cx",x_range)
    .attr("cy",i*y_range)

    gsvg.append("text")
    .attr("font-size","14px")
    .attr("x",x_range)
    .attr("y",i*y_range+5)
    .attr("text-anchor","middle")
    .text("y"+(i+1))
  }

  for(let i = 0; i < path1.length ;i ++){
    gsvg.append("text")
    .attr("font-size","10px")
    .attr("x",line_text_pos*(x_range))
    .attr("y",function(){
        if( path1[i][0] < path1[i][0])
          return (path1[i][0]-1)*y_range + line_text_pos*( path1[i][1] - path1[i][0])*y_range +2;
        else
          return (path1[i][0]-1)*y_range - line_text_pos*( path1[i][0] - path1[i][1])*y_range+2;
    })
    .attr("text-anchor","middle")
    .text(path1[i][2])
  }
}


function draw_bg_line(){
  bsvg  = d3.select("svg").append("g")
    .attr("id","bg_line")
    .attr('transform',d3Transform().translate(function () {
      return [gx,gy];
    }).scale(function () {
      return [scale];
    })
    )

  for(let i = 0; i < path1.length ;i ++){
    //bsvg.append("line")

    bsvg.append("text")
    .attr("font-size","10px")
    .attr("x",line_text_pos*(x_range))
    .attr("y",function(){
        if( path1[i][0] < path1[i][0])
          return (path1[i][0]-1)*y_range + line_text_pos*( path1[i][1] - path1[i][0])*y_range +2;
        else
          return (path1[i][0]-1)*y_range - line_text_pos*( path1[i][0] - path1[i][1])*y_range+2;
    })
    .attr("text-anchor","middle")
    .text(path1[i][2])
  }
}


// 线的动画1: 从左边点 到右点的延长
// 线的动画2: 变色
