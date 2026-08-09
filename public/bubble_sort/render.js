var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;


//宽度高度
var rect_h=50;
var rect_w=50;

var padding = {
  left:150,
  top:200
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
  explain();
}


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

var explain_padding = {
  top:20,
  left:50
}

var explain_postion = {
 "padding-top":20,
 "padding-left":50,
  height:100,
  width:210
}
//增加--说明边框
function explain(){
  let expSvg = d3.select("div.scene").append("svg").attr("class","explain")
  .style("width","210px")
  .style("height","100px");

  let expSvgRect = expSvg.append("rect")
  .attr("class","outline")
  .attr("stroke","black")
  .attr("x",0)
  .attr("y",0)
  .attr("width","200px")
  .attr("height","90px");

  //创建标题
  expSvg.append("text")
  .attr("dx",30)
  .attr("dy",25)
  .text(explain_data.title);


  for(let i = 0;i < explain_data._explain.length;i++){
    let expg = expSvg.append("g")
    .attr('transform',d3Transform().translate(function () {
        return [20,(i+1)*20+explain_padding.top];
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


//绘制贝塞尔曲线
function  _draw_bc(_status,_delay){
  console.log(_status.bc_data)
  let bcUpdate = gsvg.selectAll("path.bc").data(_status.bc_data);
  let bcEnter = bcUpdate.enter();
  let bcExit = bcUpdate.exit();


  bcUpdate
  .attr("d",function(d){
    let m =  "M "+
      (padding.left+(d.p1-1)*rect_w+rect_w/2) + " "+
      padding.top+" C "+
      (padding.left+(d.p1-1)*rect_w+rect_w/2) + " "+
      (padding.top-50)+" "+
      (padding.left+(d.p2-1)*rect_w+rect_w/2) + " "+
      (padding.top-50)+" "+
      (padding.left+(d.p2-1)*rect_w+rect_w/2) + " "+
      padding.top;
    return m;
  });

  bcEnter.append("path")
  .attr("class","bc")
  .attr("d",function(d){
    let m =  "M "+
      (padding.left+(d.p1-1)*rect_w+rect_w/2) + " "+
      padding.top+" C "+
      (padding.left+(d.p1-1)*rect_w+rect_w/2) + " "+
      (padding.top-50)+" "+
      (padding.left+(d.p2-1)*rect_w+rect_w/2) + " "+
      (padding.top-50)+" "+
      (padding.left+(d.p2-1)*rect_w+rect_w/2) + " "+
      padding.top;
    return m;
  });


  bcExit.remove();
}
//数据绘制数据
var sorted = 'red';
var sorting = 'yellow';
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
  .attr("fill",function(d){
    return (d.sorted)?sorted:sorting;
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
  .attr("fill",function(d){
    return (d.sorted)?sorted:sorting;
  })

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
  _draw_bc(_status,_delay);
}
