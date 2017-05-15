var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

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
  title:'科赫曲线/雪花曲线', //标题
  _explain:[]
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

function render_koch(_status,_delay){
  gsvg.selectAll("line#koch").remove();
  koch(_status.data,50,300,0,400);
}

function koch(n,x,y,d,l){
  if(n==0){
    __koch(x,y,d,l)
    return ;
  }

  koch(n-1,x,y,d,l/3);

  let tx = x+Math.cos(2*Math.PI/360*d)/3*l;
  let ty = y-Math.sin(2*Math.PI/360*d)/3*l;

  koch(n-1,tx,ty,d+60,l/3);

  tx = Math.cos(2*Math.PI/360*(d+60))/3*l+tx;
  ty = ty-Math.sin(2*Math.PI/360*(d+60))/3*l;
  koch(n-1,tx,ty,300+d,l/3);

  tx = Math.cos(2*Math.PI/360*(d+300))/3*l+tx;
  ty = ty-Math.sin(2*Math.PI/360*(d+300))/3*l;
  koch(n-1,tx,ty,d,l/3);
}

function __koch(x,y,deg,len){
  gsvg.append("line")
  .attr("id","koch")
  .attr("x1",x)
  .attr("y1",y)
  .attr("x2",function(){
    return x+len*Math.cos(2*Math.PI/360*deg);
  })
  .attr("y2",function(){
    return y-len*Math.sin(2*Math.PI/360*deg);
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
  render_koch(_status,_delay);
  //function 2
  //function 3
}
