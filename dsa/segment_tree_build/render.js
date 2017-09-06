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

/* 树的数据 */

//原始点id
var tree_id = "svg_"
var tree_plain = [1,9,14,19,23,27,31,39,41]

//每个点的坐标
var tree1 = [0,
[280, 33.930232],
[187, 146.930232],
[349, 147.930232],
[116, 264.930232],
[234, 264.930232],
[297, 264.930232],
[419, 264.930232],
[45, 361.930232],
[163, 361.930232],
]

label_h = 25
label_w = 61
//坐标
label = [0,
  [312.5,14],
  [217.5,138.5],
  [379.5,138.5],
  [27.5,250.5],
  [147.5,250.5],
  [319.5,250.5],
  [448.5,250.5],
  [12.5,392.5],
  [130.5,392.5]
]

//左上角说明的数据
var explain_data = {
  title:'线段树-建树', //标题
  _explain:[ // 说明数据
    {
      title:'无序元素',
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
    },
    {
      title:'有序元素',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill",sorted)
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

function render_tree1_value(_status,_delay){
  let tree1_g = d3.select("g#tree1").select("g#tree").selectAll("text#value").data(_status.tree1_data)
  let enter = tree1_g.enter()

  tree1_g
  .transition()
  .duration(_delay)
  .text(function(d,i){
    if(i==0)
      return ;
    else
      return d;
  })

  enter.append("text")
  .attr("id","value")
    .attr("x",function(d,i){
      if( i == 0)
        return 0;
      else
      return tree1[i][0]-20;
    })
    .attr("y",function(d,i){
      if( i == 0)
        return 0;
      else
      return tree1[i][1]-10;
    })
    .attr("fill","red")
    .attr("font-size","25px")
    .attr("text-anchor","end")
  .text(function(d,i){
    if(i==0)
      return ;
    else
      return d;
  })
  tree1_g.exit().remove();
}

function render_tree2_value(_status,_delay){
  let tree2_g = d3.select("g#tree2").select("g#tree").selectAll("text#value").data(_status.tree2_data)
  let enter = tree2_g.enter()

  tree2_g
  .transition()
  .duration(_delay)
  .text(function(d,i){
    if(i==0)
      return ;
    else
      return d;
  })

  enter.append("text")
  .attr("id","value")
    .attr("x",function(d,i){
      if( i == 0)
        return 0;
      else
      return tree1[i][0]-20;
    })
    .attr("y",function(d,i){
      if( i == 0)
        return 0;
      else
      return tree1[i][1]-10;
    })
    .attr("fill","red")
    .attr("font-size","25px")
    .attr("text-anchor","end")
  .text(function(d,i){
    if(i==0)
      return ;
    else
      return d;
  })
  tree2_g.exit().remove();
}


//绘制箭头动画
function render_tree1_arrow(treeid,_status,_delay){
  let tree1_g = d3.select("g#tree"+treeid).select("g#tree").selectAll("line#arrow").data(_status["tree"+treeid+"_arrow"])

  tree1_g
  .transition()
  .duration(_delay)
    .attr("x1",function(d){
      return tree1[d][0]-100;
    })
    .attr("y1",function(d){
      return tree1[d][1];
    })
    .attr("x2",function(d){
      return tree1[d][0]-30;
    })
    .attr("y2",function(d){
      return tree1[d][1];
    });

  tree1_g.enter()
    .append("line")
    .attr("id","arrow")
    .attr("x1",function(d){
      return tree1[d][0]-100;
    })
    .attr("y1",function(d){
      return tree1[d][1];
    })
    .attr("x2",function(d){
      return tree1[d][0]-30;
    })
    .attr("y2",function(d){
      return tree1[d][1];
    })
    .attr("stroke","red")
    .attr("stroke-width",3)
    .attr("marker-end","url(#arrow)");

  tree1_g.exit().remove()
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

  //加载 svg 数据
  gsvg  = gsvg.append("g")
    .attr('transform',d3Transform().translate(function () {
      return [50,50];
    }).scale(function () {
      return [1.5];
    })
    )

  for(let i =1 ;i < tree1.length;i++){
    gsvg.append("circle")
    .attr("cx",tree1[i][0])
    .attr("cy",tree1[i][1])
    .attr("r",21)
    .attr("stroke","#000")
    .attr("stroke-width",1.5)
    .attr("fill","none")
  }
  array_rect(gsvg,[80,420],[0,0,0,0,0],"id",40,80,"ST[]数组")
  //加入 箭头的defs
  make_arrow();

}


//绘制每一帧的函数
function render(_status,_delay){
  //function 2
  //function 3
}



/* 常用函数 */

//获得location.hash 的值
function gethash(){
  return window.location.hash.substring(2);
}


/*
 * name
 * id
 * x
 * y,
 * scale,
 * */

function d3xml(url){
  return $.ajax({
    url: url,
    type: 'GET',
    dataType: 'xml',
    async:false,
    timeout: 5000,  //设定超时
    cache: false,   //禁用缓存
    error: function(xml) {
      alert("加载XML文档出错!");
    }
  }).responseXML.documentElement;
}


function loadSVG(name,id,x,y,scale,title){
  let hashname = gethash()
  let flag  = 0;

  let data = d3xml("/dsa/"+hashname +"/"+name+".svg", "image/svg+xml")
  let g  = d3.select("svg").append("g")
    .attr("id",id)
    .attr('transform',d3Transform().translate(function () {
      return [x,y];
    }).scale(function () {
      return [scale];
    })
    )


  document.getElementById(id).appendChild(data)

  if( title != undefined && title != '')
    g.append("text")
      .attr("font-size","30px")
      .attr("text-anchor","start")
      .text(title);
}



//绘制箭头
function make_arrow(){
  let svg = d3.select("body").select("svg")

  let defs = svg.append("defs");

  let arrowMarker = defs.append("marker")
    .attr("id","arrow")
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth","12")
    .attr("markerHeight","12")
    .attr("viewBox","0 0 12 12")
    .attr("refX","6")
    .attr("refY","6")
    .attr("orient","auto");

  let arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

  arrowMarker.append("path")
    .attr("d",arrow_path)
    .attr("fill","#000");
}


//建立数组
// g d3.js的dom
// start_point 开始的点
// title
// data
function array_rect(g,start_point,data,id,h,w,title){
  g.append("text")
  .attr("font-size","15px")
  .attr("fill","#000")
  .attr("x",start_point[0]-20)
  .attr("y",start_point[1]+h/2+5)
  .attr("text-anchor","end")
  .text(title)
  
  for( let i = 0 ; i < data.length ;i++){
    g.append("rect")
      .attr("id",id)
      .attr("stroke","#000")
      .attr("stroke-width",1.5)
      .attr("fill","none")
      .attr("x",i*w+start_point[0])
      .attr("y",start_point[1])
      .attr("height",h)
      .attr("width",w)
  //下标
    g.append("text")
      .attr("font-size","15px")
      .attr("fill","#000")
      .attr("x",i*w+start_point[0]+w/2)
      .attr("y",start_point[1]+h+h/2)
      .attr("text-anchor","middle")
      .text(i+1)
  }
}
