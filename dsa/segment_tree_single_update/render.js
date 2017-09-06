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
var tree1 = [0]
var tree2 = [0]

//左上角说明的数据
var explain_data = {
  title:'线段树-区间更新', //标题
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
  loadSVG("tree","tree1",30,220,0.8,"原始树")
  loadSVG("tree","tree2",480,220,0.8,"标记树")

  //计算能否得到点的位置
  for(let i =0 ;i <tree_plain.length;i++){
    let id = tree_id+tree_plain[i];

    let x = d3.select("g#tree1").select("ellipse#"+id).attr("cx")
    let y = d3.select("g#tree1").select("ellipse#"+id).attr("cy")
    tree1.push([x,y])
  }

  //加入 箭头的defs
  make_arrow();

}


//绘制每一帧的函数
function render(_status,_delay){
  //function 1
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

  //var line = d3.select("svg").select("g#tree1").select("g#tree")
    //.append("line")
    //.attr("x1",x-100)
    //.attr("y1",y)
    //.attr("x2",x-30)
    //.attr("y2",y)
    //.attr("stroke","red")
    //.attr("stroke-width",7)
    //.attr("marker-end","url(#arrow)");

// 动画设定
// arrow 的移动 :-> [1,1]
// tree 上的值:
// tree1 = [0,1,2,3,4,5,6,7,8,9] ,blue
// tree2 = [0,1,2,3,4,5,6,7,8,9], red
