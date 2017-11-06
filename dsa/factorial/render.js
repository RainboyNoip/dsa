var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

var rect_h = 50;
var rect_w = 300;
var   stx  = 280
var   sty  = 150

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
  title:'递归的原理:factorial', //标题
  _explain:[]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:50,
  width:280
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
function render_stack_item(_status,_delay){
  let stack = gsvg.selectAll("g#item").data(_status.val);
  let l = _status.val.length

  stack.enter().append("g")
  .attr("id","item")
  .attr('transform',d3Transform().translate(function () {
    return [stx+4,sty];
  }))
  .attr("fill",function(d){
    let ggg = gsvg.select("g#item:last-of-type")
    item_rect(ggg,d,4,rect_h/2)
  })
  .transition()
  .duration(_delay)
  .attr('transform',d3Transform().translate(function () {
    return [stx+4,sty+(10-l)*rect_h];
  }))

  stack.exit()
  .transition()
  .duration(_delay)
  .attr('transform',d3Transform().translate(function () {
    return [stx+4,sty];
  }))
  .remove()

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
  render_background(stx,sty,10*rect_h)
  render_background(stx+rect_w+2,sty,10*rect_h)

}


//绘制每一帧的函数
function render(_status,_delay){
  render_stack_item(_status,_delay)
  //function 1
  //function 2
  //function 3
}

function render_background(x,y,length){
  gsvg.append("line")
  .attr("id","bg")
  .attr("x1",x)
  .attr("y1",y)
  .attr("x2",x)
  .attr("y2",y+length)
  .attr("stroke","#000")
  .attr("stroke-width","3px")
}

function item_rect(gg,val,x,y){
  gg.append("rect")
  .attr("id","item")
  .attr("height",rect_h-5)
  .attr("width",rect_w-5)
  .attr("stroke","#000")
  .attr("storke-width","1px")
  .attr("fill","none")

  gg.append("text")
  .attr("x",x)
  .attr("y",y)
  .attr("font-size","18px")
  .text(function(){
    return "返回行:"+val.ret
  })

  gg.append("text")
  .attr("x",x+80)
  .attr("y",y)
  .attr("font-size","18px")
  .text(function(){
    if(val.val !== null)
      return "等待执行:"+val.val
    return ''
  })
}
