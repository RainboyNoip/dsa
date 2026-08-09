var gstatus;
var delay;
var gbase;
var gsvg;
var data_svg;
var f_svg;
var scaleColor;



//******************* 全局设定,参数
//
var rect_h=recth = 50;
var rect_w=rectw = 50;
var padding = {
  left:0,
  right:0,
  top:0
}

//*******************

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
  title:'最长上升子序列', //标题
  _explain:[ // 说明数据
    {
      title:'正在操作',
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
function render_data_text(_status,_delay){
 let datag = data_svg.selectAll("text#data").data(_status.data)
  let dEnter = datag.enter()

  dEnter.append("text")
  .attr("dx",function(d,i){
    return 20+i*rectw
  })
  .attr("dy",35)
  .text(function(d){
    return d.v
  });
}

function render_f_text(_status,_delay){
 let fg = f_svg.selectAll("text#f").data(_status.f)
  let dEnter = fg.enter()
  
  fg.text(function(d){
    return d.v
  })

  dEnter.append("text")
  .attr("id","f")
  .attr("dx",function(d,i){
    return 20+i*rectw
  })
  .attr("dy",35)
  .text(function(d){
    return d.v
  });
}

function render_data(_status,_delay){
 let datag = data_svg.selectAll("rect#data").data(_status.data)
  let dEnter = datag.enter()
  let dexit = datag.exit()
  dexit.remove()

  datag.attr("fill",function(d){
    if(d.e == 0)
      return "#fff"
    else
      return sorting
  })

  dEnter.append("rect")
  .attr("id","data")
  .attr("height",recth)
  .attr("width",rectw)
  .attr("x",function(d,i){
    return i*rectw
  })
  .attr("y",function(d,i){
    return 0;
  })
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px")

}

function render_f_data(_status,_delay){
 let fg = f_svg.selectAll("rect#f").data(_status.f)
  let dEnter = fg.enter()

  fg.attr("fill",function(d){
    if(d.e == 0)
      return "#fff"
    else
      return sorting;
  })

  dEnter.append("rect")
  .attr("id","f")
  .attr("height",recth)
  .attr("width",rectw)
  .attr("x",function(d,i){
    return i*rectw
  })
  .attr("y",function(d,i){
    return 0;
  })
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px")

}

//绘制贝塞尔曲线
function  _draw_bc(_status,_delay){
  let bcUpdate = data_svg.selectAll("path.bc").data(_status.path);
  let bcEnter = bcUpdate.enter();
  let bcExit = bcUpdate.exit();


  bcUpdate
  .attr("d",function(d){

    let m =  format("M{} {} C {} {},{} {},{} {}",rectw/2+d[1]*rectw,0,
    d[1]*rectw+rectw/2,-recth,
    d[0]*rectw+rectw/2,-rectw,
    d[0]*rectw+rectw/2,0)

    return m;
  });

  bcEnter.append("path")
  .attr("fill","none")
  .attr("class","bc")
  .attr("stroke","#000")
  .attr("stroke-width","3px")
  .attr("d",function(d){
    let m =  format("M{} {} C {} {},{} {},{} {}",0,0,0,0,0,0)
    return m;
  });


  bcExit.remove();
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
  data_svg = gsvg.append("g")
  .attr("id","data_svg")
    .attr('transform',d3Transform().translate(function () {
      return [100,200];
    }));

  f_svg = gsvg.append("g")
  .attr("id","f_svg")
    .attr('transform',d3Transform().translate(function () {
      return [100,300];
    }));
  explain();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_data(_status,_delay)
  render_data_text(_status,_delay)
  render_f_data(_status,_delay)
  render_f_text(_status,_delay)
  _draw_bc(_status,_delay)
  
  //function 1
  //function 2
  //function 3
}
