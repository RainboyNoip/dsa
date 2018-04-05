var gstatus; var delay;
var gbase;
var back;
var shade;
var gsvg;
var scaleColor;

//开始的位置
var padding = {
  left:150,
  top:200
}

//迷宫开始的位置
start_point = {
  x:220,
  y:50
}



//方格的高宽
rect_h = rect_w = 50;

//设定的数据
var sorting = "steelblue";
var sorted = "red";


//左上角说明的数据
var explain_data = {
  title:'输出迷宫多少解(去除四个方向的尝试动画)', //标题
  _explain:[]
}

//说明框的大小
var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:60,
  width:510
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

function render_maze_data(_status,_delay){

    let d = back.selectAll("g#heng").data(_status.maze_data)
    let dEnter = d.enter().append("g")
    .attr("id","heng")
    .attr('transform',d3Transform().translate(function (d,i) {
      return [0,start_point.y+i*rect_h];
    }));

    let gezi = d.selectAll("rect#gezi").data(function(d){return d;});
    let geziEnter = dEnter.selectAll("rect#gezi").data(function(d){return d;}).enter()

    gezi.attr("fill",function(d){
      let color = ["#fff","#000",sorting,"#f00"]
      let i = d.val % 10;
      return color[i];
    })

    geziEnter.append("rect")
    .attr("id","gezi")
    .attr("x",function(d){
      return (d.y-1)*rect_w
    })
    .attr("fill",function(d){
      let color = ["#fff","#000",sorting,"#f00"]
      let i = d.val % 10;
      return color[i];
    })
    .attr("stroke",function(d){
      return "#00f"
    })
    .attr("stroke-width",function(d){
      return "1px"
    })
    .attr("height",rect_h)
    .attr("width",rect_w)

}

function render_maze_shade(_status,_delay){

    let d = shade.selectAll("g#heng").data(_status.maze_data)
    let dEnter = d.enter().append("g")
    .attr("id","heng")
    .attr('transform',d3Transform().translate(function (d,i) {
      return [0,start_point.y+i*rect_h];
    }));

    let gezi = d.selectAll("rect#gezi").data(function(d){return d;});
    let geziEnter = dEnter.selectAll("rect#gezi").data(function(d){return d;}).enter()

    gezi.attr("fill",function(d){
      if(parseInt(d.val /10) == 4){
        return "rgba(255,255,0,0.8)"
      }

      if(parseInt(d.val /10) == 5)
        return "rgba(0,0,205,0.8)"
      return "rgba(255,255,0,0)"
    })

    geziEnter.append("rect")
    .attr("id","gezi")
    .attr("x",function(d){
      return (d.y-1)*rect_w
    })
    .attr("fill","rgba(255,255,0,0)")
    .attr("stroke","rgba(255,255,0,0)")
    .attr("stroke-width","1px")
    .attr("height",rect_h)
    .attr("width",rect_w)

}


function render_cnt(_status,_delay){
  let cntUpdate = back.selectAll("text#cnt").data(_status.cnt)
  let cntEnter = cntUpdate.enter()

  cntUpdate
    .attr("fill",function(d){
      if(d.change)
        return "#fff"
      return "#000"
    })
    .text(function(d){
      return "解法总数: "+d.val;
    })
    .transition()
    .duration(_delay)
    .attr("fill","#000")
  
  cntEnter.append("text")
  .attr("id","cnt")
  .attr("x",function(d){
    return -rect_w;
  })
  .attr("y",function(d){
    return 2*rect_h;
  })
  .attr("text-anchor","end")
  .attr("font-size","30px")
  .attr("font-weight","bold")
  .attr("fill",function(d){
    return "#000";
  })
  .text(function(d){
    return "解法总数: "+d.val;
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
  this.svg = d3.select("svg")
  gsvg = this.svg;
  back = gsvg.append("g").attr("id","maze_data_back")
    .attr('transform',d3Transform().translate(function () {
        return [start_point.x,start_point.y];
    }));

  shade= gsvg.append("g").attr("id","shade")
    .attr('transform',d3Transform().translate(function () {
        return [start_point.x,start_point.y];
    }));
  explain();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_maze_data(_status,_delay)
  render_maze_shade(_status,_delay)
  render_cnt(_status,_delay);
  //function 1
  //function 2
  //function 3
}
