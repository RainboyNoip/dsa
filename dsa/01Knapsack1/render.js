var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

//开始的位置
var padding = {
  left:50,
  top:400
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";


//左上角说明的数据
var explain_data = {
  title:'01背包', //标题
  _explain:[ // 说明数据
    {
      title:'正在得到值的状态',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill","lightcoral")
            .attr("width",30)
            .attr("height",10)
            .attr("stroke","black")
            .attr("stroke-width","1px")
          }
        }
      ]
    },
    {
      title:'需要知道的前面的状态信息',
      icon:[
        {
          name:"rect",
          icon:function(selection){
            selection.attr("fill","steelblue")
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
  width:250
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

//物品信息
function render_wp_info(){
  let _explain_postion = {
    height:explain_postion.height,
    width:400
  }
  let expSvg= gsvg.append("g").attr("class","info")
  .style("height",_explain_postion.height+"px")
  .style("width",_explain_postion.width+"px")
  .attr('transform',d3Transform().translate(function () {
    return [300,20];
  }));

  let expSvgRect = expSvg.append("rect")
  .attr("fill","none")
  .attr("class","outline")
  .attr("stroke","black")
  .attr("x",0)
  .attr("y",0)
  .attr("width",(_explain_postion.width-10)+"px")
  .attr("height",(_explain_postion.height-10)+"px");


  let _num = ["编号:",1,2,3,4,5];
  let __w = ["重量:",2,2,6,5,4];
  let __v = ["价值:",6,3,5,4,6];

  let _pdx=50;
  let _pdy=50;
  let _font=20;
  for(let i = 0;i<__w.length;i++){
    expSvg.append("text")
    .attr("id","info")
    .attr("dx",(i+1)*_pdx)
    .attr("dy",_pdy-30)
    .attr("font-size",_font+"px")
    .text(_num[i]);

    expSvg.append("text")
    .attr("id","info")
    .attr("dx",(i+1)*_pdx)
    .attr("dy",_pdy)
    .attr("font-size",_font+"px")
    .text(__w[i]);

    expSvg.append("text")
    .attr("id","info")
    .attr("font-size",_font+"px")
    .attr("dx",(i+1)*_pdx)
    .attr("dy",_pdy+30)
    .text(__v[i]);
  }

  for(let i =0 ;i<11;i++){
    gsvg.append("text")
    .attr("id","info")
    .attr("fill","#cc99ff")
    .attr("text-anchor","middle")
    .attr("x",i*rect_w+padding.left+rect_w/2)
    .attr("y",padding.top+rect_h+ rect_h/2)
    .text(i)
  }

}

var rect_w=60
var rect_h=50

//二维背景
function render_back_one(_status,_delay){
  let btUpdate = gsvg.selectAll("rect#one").data(_status.one);
  let btEnter = btUpdate.enter();
  let btExit  = btUpdate.exit();

  btUpdate
  //.transition()
  //.duration(_delay)
  .attr("fill",function(d){
    if(d == 0)
      return "none"
    else if( d==1)
      return "lightcoral"
    else
      return "steelblue"
  })

  btEnter.append("rect")
  .attr("id","one")
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("x",function(d,i){
    return (i)*rect_w+padding.left;
  })
  .attr("y",padding.top)
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("stroke-width","1px")
}

function render_value(_status,_delay){
  let valueUpdate = gsvg.selectAll("text#value").data(_status.value);
  let valueEnter = valueUpdate.enter();
  let valueExit = valueUpdate.exit();

  valueUpdate
  .text(function(d){
    return d;
  })

  valueEnter.append("text")
    .attr("id","value")
    .attr("text-anchor","middle")
    .attr("fill","#000")
    .attr("x",function(d,i){
      return i*rect_w+padding.left+rect_w/2;
    })
    .attr("y",function(d,i){
      return padding.top+rect_h/2+9;
    })
    .text(function(d,i){
      return d
    })
}

function render_bc(_status,_delay){
  let bcUpdate = gsvg.selectAll("path#bc").data(_status.bc);
  let bcEnter = bcUpdate.enter();
  let bcExit = bcUpdate.exit();

  bcUpdate
  .attr("d",function(d){
    return "M "+
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      padding.top+" C "+
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      (padding.top-rect_h)+" "+
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+
      (padding.top-rect_h)+" "+
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+
      padding.top;
  })



  bcEnter.append("path")
  .attr("id","bc")
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("stroke-width","2px")
  .attr("marker-end","url(#arrow)")
  .attr("d",function(d){
    return "M "+
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      padding.top+" C "+
      (padding.left+(d[0])*rect_w+rect_w/2) + " "+
      (padding.top-rect_h)+" "+
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+
      (padding.top-rect_h)+" "+
      (padding.left+(d[1])*rect_w+rect_w/2) + " "+
      padding.top;
  })

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
  explain();
  render_wp_info();
  render_arrow();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_back_one(_status,_delay)
  render_value(_status,_delay)
  render_bc(_status,_delay)
  //function 2
  //function 3
}

function render_arrow(){
  //绘制箭头
  var defs = this.svg.append("defs");

  var arrowMarker = defs.append("marker")
    .attr("id","arrow")
    .attr("markerUnits","strokeWidth")
    .attr("markerWidth","12")
    .attr("markerHeight","12")
    .attr("viewBox","0 0 12 12")
    .attr("refX","6")
    .attr("refY","6")
    .attr("orient","auto");

  var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
  arrowMarker.append("path")
  .attr("d",arrow_path)
  .attr("fill","#000");

  arrowMarker.append("path")
    .attr("d",arrow_path)
    .attr("fill","#000");
}


