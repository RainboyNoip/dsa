var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

//开始的位置
var padding = {
  left:150,
  top:360
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";

var rect_w =50;
var rect_h = 50;


//左上角说明的数据
var explain_data = {
  title:'归并排序', //标题
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
function render_range(_status,_delay){
  let rangeUpdate = gsvg.selectAll("path#range").data(_status.range);
  let rangeEnter = rangeUpdate.enter();
  let rangeExit = rangeUpdate.exit();

  rangeEnter.append("path")
  .attr("id","range")
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("stroke-width","2px")
  .attr("d",function(d){
    return "M "+
      (padding.left + (d[0]+1)*rect_w) + " "+
      (padding.top -d[2]*15-5)+ " "+
      "l 5 -5 "+
      "H "+
      (padding.left+(d[1]+2)*rect_w-5)+" "+
      "L "+
      (padding.left+(d[1]+2)*rect_w)+" "+
      (padding.top-d[2]*15-5);
  });

  rangeExit.remove();
}

function render_text(_status,_delay){
  let textUpdate = gsvg.selectAll("text#v").data(_status.data);
  let textEnter = textUpdate.enter();
  let textExit = textUpdate.exit();

  textUpdate
    .transition()
    .duration(_delay)
    .attr("x",function(d){
      return padding.left+d.p[1]*rect_w+rect_w/2;
    })
    .attr("y",function(d){
      return padding.top+d.p[0]*120+ rect_h/2+5;
    });

  textEnter.append("text")
    .attr("id","v")
    .attr("text-anchor","middle")
  .attr("x",function(d){
    return padding.left+d.p[1]*rect_w+rect_w/2;
  })
  .attr("y",function(d){
    return padding.top+d.p[0]*120+ rect_h/2+5;
  })
  .attr("font-size","20px")
  .text(function(d){
    return d.v;
  })

  textExit.remove();
}

function render_back(_status,_delay){
  let backUpdate = gsvg.selectAll("rect#back1").data(_status.data);
  let backEnter = backUpdate.enter();
  let backExit = backUpdate.exit();

  backUpdate
    .transition()
    .duration(_delay)
    .attr("fill",function(d){
      return d.sorted ? sorted:sorting;
    })


  backEnter.append("rect")
  .attr("id","back1")
  .attr("fill",function(d){
    return d.sorted ? sorted:sorting;
  })
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("stroke","#000")
  .attr("stroke-width","1px")
  .attr("x",function(d,i){
    return padding.left + (i+1)*rect_w;
  })
  .attr("y",function(d,i){
    return padding.top;
  })

  backExit.remove();
}

var fake_array = [1,2,3,4,5,6]

function render_tmp(){
  let backUpdate2 = gsvg.selectAll("rect#back2").data(fake_array);
  //tmp数组初始化
  backUpdate2.enter().append("rect")
  .attr("id","back2")
  .attr("fill","#fff")
  .attr("height",rect_h)
  .attr("width",rect_w)
  .attr("stroke","#000")
  .attr("stroke-width","1px")
  .attr("x",function(d,i){
    return padding.left + (i+1)*rect_w;
  })
  .attr("y",function(d,i){
    return padding.top+120;
  })

  //加入文字
  gsvg.append("text")
  .attr("x",function(){
    return padding.left+rect_w/2;
  })
  .attr("text-anchor","end")
  .attr("y",function(){
    return padding.top +rect_h/2+3;
  })
  .text("待排序的数组")

  gsvg.append("text")
  .attr("x",function(){
    return padding.left+rect_w/2;
  })
  .attr("text-anchor","end")
  .attr("y",function(){
    return padding.top +120 +rect_h/2+3;
  })
  .text("tmp数组")
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
  render_tmp();
}


//绘制每一帧的函数
function render(_status,_delay){
  render_back(_status,_delay);
  render_text(_status,_delay);
  render_range(_status,_delay);
  //function 2
  //function 3
}
