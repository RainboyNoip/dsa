var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

//背景数据
var background_data = [
  {
    class:"func",
    x:50,
    y:50,
    height:100,
    width:300,
    fill:1
  },
  {
    class:"callfunc",
    x:50,
    y:300,
    height:100,
    width:300,
    fill:1
  },
  {
    class:"func-a",
    x:100,
    y:75,
    height:50,
    width:50,
    fill:2,
  },
  {
    class:"func-b",
    x:250,
    y:75,
    height:50,
    width:50,
    fill:2,
    text:"b"
  },
  {
    class:"callfunc-a",
    x:100,
    y:325,
    height:50,
    width:50,
    fill:2,
    text:"a"
  },
  {
    class:"callfunc-b",
    x:250,
    y:325,
    height:50,
    width:50,
    fill:2,
    text:"b"
  },
];


//文字数据
var _arg_text = [
{
    arg:'1',
    sx:100,
    sy:325,
    dx:25,
    dy:30,
  },
    {
      arg:'2',
      sx:250,
      sy:325,
      dx:25,
      dy:30,
    }
]

var _arg_name_text = [
  {
    name:"a",
    x:90,
    y:110
  },
  {
    name:"b",
    x:240,
    y:110
  },
  {
    name:"a",
    x:90,
    y:355
  },
  {
    name:"b",
    x:240,
    y:355
  }
]

//箭头数据
var arg_path = [
  {
    start:[ background_data[4].x+ 25,background_data[4].y],
    end:[ background_data[2].x+ 25,background_data[2].y+50]
  },
  {
    start:[ background_data[5].x+ 25,background_data[5].y],
    end:[ background_data[3].x+ 25,background_data[3].y+50]
  },
];
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

  //绘制箭头
  var defs = this.svg.append("defs");

  var arrowMarker = defs.append("marker")
    .attr("id","arrow")
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth","12")
    .attr("markerHeight","12")
    .attr("viewBox","0 0 12 12")
    .attr("refX","6")
    .attr("refY","6")
    .attr("orient","auto");

  var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
  arrowMarker.append("path")
  .attr("d",arrow_path)
  .attr("fill","#000");

  arrowMarker.append("path")
    .attr("d",arrow_path)
    .attr("fill","#000");

  //添加背景
  this.svg.selectAll("rect")
    .data(background_data)
    .enter()
    .append("rect")
    .attr("class",function(d){
      return d["class"];
    })
    .attr("height",function(d){
      return d["height"];
    })
    .attr("width",function(d){
      return d["width"];
    })
    .attr("fill",function(d){
      return scaleColor(d["fill"]);
    })
    .attr('transform',d3Transform().translate(function (d, i) {
        return [d.x, d.y];
    }));

  //添加文字
  gsvg.selectAll("text")
  .data(_arg_text)
  .enter().append("text")
  .attr("fill","black")
  .attr("font-size","24px")
  .attr("text-anchor","middle")
  .attr("x",function(d){
    return d.sx;
  })
  .attr("y",function(d){
    return d.sy;
  })
  .attr("dx",function(d){
    return d.dx;
  })
  .attr("dy",function(d){
    return d.dy;
  })
  .text(function(d){
    return d.arg
  })

  //name_text
  gsvg.selectAll("text.name")
  .data(_arg_name_text)
  .enter().append("text")
  .attr("class","name")
  .attr("fill",scaleColor(5))
  .attr("font-size","24px")
  .attr("text-anchor","end")
  .attr("x",function(d){
    return d.x;
  })
  .attr("y",function(d){
    return d.y;
  })
  .text(function(d){
    return d.name;
  })
}

//绘制参数的箭头
function _draw_argu_path(dstatus){
  //console.log(dstatus.arg_path)
  var lineUpdate = gsvg.selectAll("line")
  .data(dstatus.arg_path);

  //enter
  lineUpdate.enter()
  .append("line")
  .attr("x1",function(d){
    return d.start[0];
  })
  .attr("y1",function(d){
    return d.start[1];
  })
  .attr("x2",function(d){
    return d.start[0];
  })
  .attr("y2",function(d){
    return d.start[1];
  })
  .transition()
  .duration(1000)
  .attr("x1",function(d){
    return d.start[0];
  })
  .attr("y1",function(d){
    return d.start[1];
  })
  .attr("x2",function(d){
    return d.end[0];
  })
  .attr("y2",function(d){
    return d.end[1];
  })
  .attr("stroke","#000")
  .attr("stroke-width",2)
  .attr("marker-end","url(#arrow)");

  //exit
  lineUpdate.exit().remove();
}

//绘制函数的值的传递
function _draw_func_argu(dstatus,_delay){

  var textUpdate = gsvg.selectAll('text.arg')
  .data(dstatus.pass_arg);

  //enter
  textUpdate.enter().append("text")
  .attr("class","arg")
  .attr("fill","black")
  .attr("font-size","24px")
  .attr("text-anchor","middle")
  .attr("x",function(d){
    return d.sx;
  })
  .attr("y",function(d){
    return d.sy;
  })
  .attr("dx",function(d){
    return d.dx;
  })
  .attr("dy",function(d){
    return d.dy;
  })
  .text(function(d){
    return d.arg
  })
  .transition()
  .duration(1000)
  .attr("x",function(d){
    return d.tx;
  })
  .attr("y",function(d){
    return d.ty;
  })
  
  //exit()
  textUpdate.exit().remove();
}
function render(_status,_delay){
  _draw_argu_path(_status,_delay);
  _draw_func_argu(_status,_delay);
}

