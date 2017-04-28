var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//宽度高度
var rect_h=50;
var rect_w=50;

var padding = {
  left:100,
  top:100
}

//
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
}

//数据绘制数据
function _draw_sort_data(_status,_delay){
  let sortUpdate = gsvg.selectAll("rect.sort")
  .data(_status.sort_data)

  let sortEnter = sortUpdate.enter();
  let sortExit = sortUpdate.exit();

  //update
  sortUpdate
  .transition()
  .duration(_delay)
  .attr("x",function(d){
    return (d.p-1)*rect_w + padding.left;
  })
  .attr("y",function(d){
    return padding.top;
  })

  //enter
  sortEnter.append("rect")
  .attr("class","sort")
  .attr("x",function(d){
    return (d.p-1)*rect_w + padding.left;
  })
  .attr("y",function(d){
    return padding.top;
  })
  .attr("height",function(d){
    return rect_h;
  })
  .attr("width",function(d){
    return rect_w;
  })
  .attr("fill",function(d){
    return "#fff";
  })
  .attr("stroke","#000")
  .attr("stroke-width","1px")

  sortExit.remove();

}

//绘制文字
function _draw_sort_data_text(_status,_delay){
  let textUpdate = gsvg.selectAll("text.sort")
  .data(_status.sort_data)

  let textEnter = textUpdate.enter();
  let textExit = textUpdate.exit();

  textUpdate
  .transition()
  .duration(_delay)
  .attr("x",function(d){
    return (d.p-1)*rect_w + padding.left;
  })
  .attr("y",function(d){
    return padding.top;
  })

  //enter
  textEnter.append("text")
  .attr("class","sort")
  .attr("x",function(d){
    return (d.p-1)*rect_w + padding.left;
  })
  .attr("y",function(d){
    return padding.top;
  })
  .attr("dx",function(d){
    return rect_w/2;
  })
  .attr("dy",function(d){
    return rect_h/2;
  })
  .attr("text-anchor","middle")
  .attr("font-size","16px")
  .attr("fill",function(d){
    return "#000";
  })
  .text(function(d){
    return d.v;
  })

  textExit.remove();

}

function render(_status,_delay){
  _draw_sort_data(_status,_delay);
  _draw_sort_data_text(_status,_delay);
}
