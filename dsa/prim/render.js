var gstatus;
var delay;
var gbase;
var gsvg;
var gsvgg;
var fasvg;
var scaleColor;

//开始的位置
var padding = {
  left:150,
  top:200
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";

var fa_x=50;
var fa_y=150;
//树的每个点的位置信息
var tree_x=200;
var tree_y=120;
var tree_r=20;
var tree_pos = [
  [286,38],
  [184,134],
  [119,216],
  [220,217],
  [65,302],
  [162,299],
  [24,389],
  [297,134],
  [401,138],
  [343,218],
  [445,218],
  [312,302],
  [108,387]
]

var tree_relation = [
[1,2],
[1,8],
[1,9],
[2,3],
[2,4],
[9,10],
[9,11],
[3,5],
[3,6],
[10,12],
[5,7],
[5,13]
]

//左上角说明的数据
var explain_data = {
  title:'最小生成树-prim算法', //标题
  _explain:[ // 说明数据
    {
      title:'已经访问过的元素',
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

function render_tree_node_line(){
  let tnlUpdate = gsvgg.selectAll("text.tree")
  .data(tree_relation)

  tnlUpdate.enter().append("line")
  .attr('class',"tree")
  .attr("stroke","black")
  .attr("stroke-width",2)
  .attr("x1",function(d){
    return tree_pos[ d[0]-1 ][0];
  })
  .attr("y1",function(d){
    return tree_pos[ d[0]-1 ][1];
  })
  .attr("x2",function(d){
    return tree_pos[ d[1]-1 ][0];
  })
  .attr("y2",function(d){
    return tree_pos[ d[1]-1 ][1];
  })
}

//渲染 并查集

var rect_h = 25
var rect_w = 50

//渲染 并查集背景
function render_fa_rect(x,y,cla){
  let faUpdate = fasvg.selectAll("rect."+cla).data(tree_pos);
  faUpdate.enter().append("rect")
  .attr("class",cla)
  .attr("x",function(d,i){
    return x;
  })
  .attr("y",function(d,i){
    return i*rect_h;
  })
  .attr("width",rect_w)
  .attr("height",rect_h)
  .attr("stroke","black")
  .attr("stroke-width","1px")
  .attr("fill","none")

}
function render_fa1(){
  let faUpdateT = fasvg.selectAll("text.fa1").data(tree_pos);
  let faEnter = faUpdateT.enter();

  faEnter.append("text")
  .attr("class","fa1")
  .attr("x",function(d,i){
    return 0;
  })
  .attr("y",function(d,i){
    return i*rect_h+8;
  })
    .attr("dx",5)
    .attr("dy",10)
    .attr("font-size","14px")
    .attr("text-anchor","start")
    .text(function(d,i){
      return "fa["+(i+1)+"]"
    });
}

//渲染 并查集 文字
function render_fa(_status,_delay){
  let faUpdateT = fasvg.selectAll("text.fa").data(_status.fa);
  let faEnter = faUpdateT.enter();

  faEnter.append("text")
  .attr("class","fa")
  .attr("x",function(d,i){
    return rect_w+10;
  })
  .attr("y",function(d,i){
    return i*rect_h+8;
  })
    .attr("dx",10)
    .attr("dy",10)
    .attr("font-size","14px")
    .attr("text-anchor","start")
    .text(function(d,i){
      return d
    });

  faUpdate
  .transition()
  .duration(_delay)
  .text(function(d){
    return d;
  })
}

//渲染树
function render_tree(_status,_delay){
  let treeUpdate = gsvgg.selectAll("circle.tree")
  .data(_status.tree_data)

  let treeEnter = treeUpdate.enter();
  let treeExit= treeUpdate.exit();

  treeEnter.append("circle")
  .attr("class","tree")
  .attr("cx",function(d,i){
    return tree_pos[i][0];
  })
  .attr("cy",function(d,i){
    return tree_pos[i][1];
  })
  .attr("stroke","black")
  .attr("stroke-width",1.5)
  .attr("r",tree_r)
  .attr("fill",function(d){
    if(d == 0)
      return "white"
    else
      return sorting;
  });

  treeUpdate
  .transition()
  .duration(_delay)
  .attr("fill",function(d){
    if(d == 0)
      return "white"
    else
      return sorting;
  });

  treeExit.remove();
}

function render_node_index(_status,_delay){
  let tniUpdate = gsvgg.selectAll("text.tree")
  .data(tree_pos)

  tniUpdate.enter().append("text")
  .attr("class",'tree')
  .attr("x",function(d){
    return d[0];
  })
  .attr("y",function(d){
    return d[1]+5;
  })
  .attr("text-anchor","middle")
  .attr("font-size","16px")
  .attr("fill",function(d){
    return "#000";
  })
  .text(function(d,i){
    return i+1;
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
  gsvgg = this.svg.append("g")
    .attr('transform',d3Transform().translate(function () {
        return [tree_x,tree_y];
    }));
  fasvg = this.svg.append("g")
    .attr('transform',d3Transform().translate(function () {
        return [fa_x,fa_y];
    }));
  explain();
  render_tree_node_line();
  render_fa_rect(0,0,"rect1");
  render_fa_rect(rect_w,0,"rect2");
  render_fa1();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_tree(_status,_delay);
  render_node_index();
  render_fa(_status,_delay);
  //function 1
  //function 2
  //function 3
}
