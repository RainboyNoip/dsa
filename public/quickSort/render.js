var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;



//开始的位置
var padding = {
  left:150,
  top:300
}

//
var sorting = "steelblue";
var sorted = "red";
var key = "#fff"
var rect_w = 50;
var rect_h= 50;
var key_padding=150;
var arrow_color1 = "#1f77b4";
var arrow_color2 = "#ff7f0e";

//左上角说明的数据
var explain_data = {
  title:'快速排序', //标题
  _explain:[ // 说明数据
    {
      title:'key值',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill",key)
            .attr("width",30)
            .attr("height",10)
            .attr("stroke","black")
            .attr("stroke-width","1px")
          }
        }
      ]
    },
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
  height:120,
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


function _draw_rect(_status,_delay){
  let rectUpdate = gsvg.selectAll('rect#quickSort').data(_status.sort_data);
  let rectEnter = rectUpdate.enter();
  let rectExit = rectUpdate.exit();


  rectEnter.append("rect")
    .attr("id","quickSort")
    .attr("x",function(d,i){
      if(d.p==0)
      return padding.left+(d.p-1)*rect_w;
      else
      return padding.left+(d.p-1)*rect_w+key_padding;
    })
    .attr("y",function(d,i){
      return padding.top;
    })
    .attr("fill",function(d,i){
      if(d.p==0)
        return key;
      else
        return sorting;
    })
    .attr("width",rect_w)
    .attr("height",rect_h)
    .attr("stroke","black")
    .attr("stroke-width","1px");
}

function _draw_sorted(_status,_delay){
  let rectUpdate = gsvg.selectAll('rect#sorted').data(_status.sorted);
  let rectEnter = rectUpdate.enter();
  let rectExit = rectUpdate.exit();

  rectUpdate
    .transition()
    .duration(_delay)
    .attr("fill",function(d){
      if(d)
        return sorted;
      else 
        return "none";
    })

  rectEnter.append("rect")
    .attr("id","sorted")
    .attr("x",function(d,i){
      return padding.left+(i)*rect_w+key_padding;
    })
    .attr("y",function(d,i){
      return padding.top;
    })
    .attr("fill","none")
    .attr("width",rect_w)
    .attr("height",rect_h)
    .attr("stroke","black")
    .attr("stroke-width","1px");
}

function _draw_value(_status,_delay){
  let valueUpdate = gsvg.selectAll('text#value').data(_status.sort_data);
  let valueEnter = valueUpdate.enter();
  let valueExit =  valueUpdate.exit();

  valueUpdate
    .transition()
    .duration(_delay)
    .attr("x",function(d,i){
      if(d.p==0)
        return padding.left+(d.p-1)*rect_w+rect_w/2;
      else
        return padding.left+(d.p-1)*rect_w+rect_w/2+key_padding;
    })
    .attr("y",function(d,i){
      return padding.top+rect_h/2+7;
    });

  valueEnter.append("text")
    .attr("id","value")
    .attr("x",function(d,i){
      if(d.p==0)
        return padding.left+(d.p-1)*rect_w+rect_w/2;
      else
        return padding.left+(d.p-1)*rect_w+rect_w/2+key_padding;
    })
    .attr("y",function(d,i){
      return padding.top+rect_h/2+7;
    })
    .attr("text-anchor","middle")
    .attr("font-size","24px")
    .text(function(d){
      return d.v;
    });

  valueExit.remove();
}

function _draw_arrow(_status,_delay){
  let arrowUpdate = gsvg.selectAll("path#arrow").data(_status.arrow);
  let arrowEnter = arrowUpdate.enter();
  let arrowExit  = arrowUpdate.exit();

  arrowUpdate
    .transition()
    .duration(_delay)
  .attr("d",function(d){
    return "M "+
      (padding.left+(d-1)*rect_w+key_padding+rect_w/2) +" "+
      (padding.top-(1.1)*rect_h) + " "+
      "V "+
      (padding.top-rect_h/2);
  });



  arrowEnter.append("path")
  .attr("id","arrow")
  .attr("d",function(d){
    return "M "+
      (padding.left+(d-1)*rect_w+key_padding+rect_w/2) +" "+
      (padding.top-(1.1)*rect_h) + " "+
      "V "+
      (padding.top-rect_h/2);
  })
  .attr("stroke",function(d,i){
    if( i== 0)
      return arrow_color1;
    return arrow_color2;
  })
  .attr("stroke-width","5px")
  .attr("marker-end",function(d,i){
    if(i==0)
      return "url(#arrow1)";
    return "url(#arrow2)";
  });

  arrowExit.remove();

}

//绘制曲线
function _draw_bcpath(_status,_delay){

}
function _draw_range(_status,_delay){
  let rangeUpdate = gsvg.selectAll("path#range").data(_status.range);
  let rangeEnter = rangeUpdate.enter();
  let rangeExit = rangeUpdate.exit();

  rangeUpdate
  .attr("d",function(d){
    return "M "+
      (padding.left+(d.s-1)*rect_w+key_padding) +" "+
      (padding.top+rect_h+rect_h/2) + " "+
      "l 5 5"+
      "H "+
      (padding.left+(d.t)*rect_w+key_padding-5)+" "+
      "L "+
      (padding.left+(d.t)*rect_w+key_padding)+" "+
      (padding.top+rect_h+rect_h/2);
  });

  rangeEnter.append("path")
  .attr("id","range")
  .attr("d",function(d){
    return "M "+
      (padding.left+(d.s-1)*rect_w+key_padding) +" "+
      (padding.top+rect_h+rect_h/2) + " "+
      "l 5 5"+
      "H "+
      (padding.left+(d.t)*rect_w+key_padding-5)+" "+
      "L "+
      (padding.left+(d.t)*rect_w+key_padding)+" "+
      (padding.top+rect_h+rect_h/2);
  })
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("stroke-width","3px");


  rangeExit.remove();
}



function _add_arrow(id,color){
  var defs = gsvg.append("defs");

  var arrowMarker = defs.append("marker")
    .attr("id",id)
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth","3")
    .attr("markerHeight","3")
    .attr("viewBox","-5 -5 10 10")
    .attr("refX","-5")
    .attr("orient","auto");

  var arrow_path = "M-5,-5L5,0L-5,5";

  arrowMarker.append("path")
    .attr("d",arrow_path)
    .attr("fill",color);
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
  _add_arrow("arrow1",arrow_color1);
  _add_arrow("arrow2",arrow_color2);
  explain();
}


//绘制每一帧的函数
function render(_status,_delay){
  _draw_rect(_status,_delay);
  _draw_sorted(_status,_delay);
  _draw_arrow(_status,_delay);
  _draw_value(_status,_delay);
  _draw_bcpath(_status,_delay);
  _draw_range(_status,_delay);
}
