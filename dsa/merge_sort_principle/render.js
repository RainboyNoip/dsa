var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//设定的数据
var sorting = "steelblue";
var sorted = "red";


//开始的位置
var padding = {
  left:150,
  top:200
}
var rect_h=50;
var rect_w=50;

//左上角说明的数据
var explain_data = {
  title:'归并排序原理', //标题
  _explain:[]
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
function render_rect(){
  let rect1=   svg.selectAll("rect#data1").data(array_a);
  let rect2=   svg.selectAll("rect#data1").data(array_b);
  let rect3=   svg.selectAll("rect#data1").data(dataStatus);

  rect1.enter().append("rect")
  .attr("id","data1")
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("x",function(d,i){
    return padding.left + i*rect_w;
  })
  .attr("y",padding.top*1)
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px");

  rect2.enter().append("rect")
  .attr("id","data2")
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("x",function(d,i){
    return padding.left + i*rect_w;
  })
  .attr("y",padding.top+50+rect_w)
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px");

  rect3.enter().append("rect")
  .attr("id","data3")
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("x",function(d,i){
    return padding.left + i*rect_w;
  })
  .attr("y",padding.top+2*50+2*rect_w)
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px");

}


//绘制数字的移动
function render_data(_status,_delay){
  let dataUpdata = gsvg.selectAll("text#data").data(_status.data)
  let dataEnter = dataUpdata.enter();
  let dataExit = dataUpdata.exit();

  dataUpdata
    .transition()
    .duration(_delay)
    .attr("x",function(d,i){
      return padding.left + d.p[1]*rect_w+rect_w/2;
    })
    .attr("y",function(d){
      let i = d.p[0];
      return padding.top +(i-1)*50+(i-1)*rect_w +rect_w/2+5;
    })

  dataEnter.append("text")
    .attr("id","data")
    .attr("x",function(d,i){
      return padding.left + d.p[1]*rect_w+rect_w/2;
    })
    .attr("y",function(d){
      let i = d.p[0];
      return padding.top +(i-1)*50+(i-1)*rect_w +rect_w/2+7;
    })
    .attr("text-anchor","middle")
    .attr("fill","#000")
    .attr("font-size","26px")
    .text(function(d){
      return d.v;
    })

  dataExit.remove();
}

//绘制比较的那条线
function render_line(_status,_data){
  let pathCmpUpdate = gsvg.selectAll("path#cmp").data(_status.cmp);
  let pathCmpEnter = pathCmpUpdate.enter();
  let pathCmpExit = pathCmpUpdate.exit();

  pathCmpUpdate
  .attr("d",function(d){
    return "M " +
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      (padding.top+rect_w +50) + " " +
      "C " +
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w +25) + " " +
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w +25) + " " +
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w);
  });

  pathCmpEnter.append("path")
  .attr("id","cmp")
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("stroke-width","3px")
  .attr("d",function(d){
    return "M " +
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      (padding.top+rect_w +50) + " " +
      "C " +
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w +25) + " " +
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w +25) + " " +
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+ 
      (padding.top+rect_w);
  })

  pathCmpExit.remove();
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
  render_rect();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_data(_status,_delay);
  render_line(_status,_delay);
  //function 2
  //function 3
}
