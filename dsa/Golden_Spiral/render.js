var gstatus;
var delay;
var gbase;
var gsvg;
var bsvg;
var scaleColor;

var zx = 1

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
  title:'冒泡排序', //标题
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

function render_path_data(_status,_delay){
  let pd = bsvg.selectAll('path').data(_status.path_data)

  pd.enter().append("path")
  .attr("stroke","#000")
  .attr("stroke-width","1px")
  .attr("fill","none")
  .attr("d",function(d){
    return "M"+d[0][0]+" "+d[0][1]+" "+
      "L"+d[1][0] + " " + d[1][1] +" "+
      "L"+d[2][0] + " " + d[2][1] +" "+
      "L"+d[3][0] + " " + d[3][1]
  })

  pd.exit().remove()


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
  this.svg = d3.select("svg");
  gsvg = this.svg;
  //explain();

  bsvg = gsvg.append("g").attr("id","back")
    .attr('transform',d3Transform().translate(function () {
      return [100,100];
    }));

  bsvg.append("rect").attr("stroke","#000")
  .attr("fill","none")
  .attr("x",sx-len_scale)
  .attr("y",sy)
  .attr("height",len_scale)
  .attr("width",len_scale)
}


//绘制每一帧的函数
function render(_status,_delay){
  render_path_data(_status,_delay)
  //function 2
  //function 3
}


//创建一个g
//
function sss(val){
  bsvg
    .transition()
    .duration(1000)

    .attr("transform",d3Transform()
      .translate(function(d) {  return [100,100] })
      .scale(function(d) {return [val]  })
    )
}
