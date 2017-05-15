var gstatus;
var delay;
var gbase;
var gsvg;
var scaleColor;

//开始的位置
var padding = {
  left:50,
  top:200
}

//设定的数据
var sorting = "steelblue";
var sorted = "red";


//左上角说明的数据
var explain_data = {
  title:'函数的运行原理', //标题
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

var func_text = ['if(a>b)',"    return a;","return b;"]
function render_func_text(_status,_delay){
  let func_g = gsvg.append("g")
    .attr('transform',d3Transform().translate(function () {
      return [padding.left,padding.top];
    }));



  func_g.append("rect")
  .attr("height",200)
  .attr("width",200)
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px");

  func_g.append("rect")
  .attr("height",50)
  .attr("width",200)
  .attr("fill","#ccc")
  .attr("stroke","#000")
  .attr("stroke-width","1px");

  func_g.append("text")
  .text("函数func_max的函数体")
  .attr("fill","#000")
  .attr("x",10)
  .attr("y",30)

  func_g.selectAll("text#func").data(func_text).enter()
    .append("text")
  .attr("id","func")
  .attr("fill","#000")
  .attr("x",function(d,i){
    let x =15;
    let cnt =1;
    for(let i =0;i<d.length;i++)
      if( d[i] == " ")
        cnt++
      else
        break;
    return cnt*x;
  })
  .attr("y",function(d,i){
    return i*20+80;
  })
  .text(function(d){
    return d;
  })
}

var stack=[1,2]
function render_stack(){
  gsvg.append("text")
  .attr("x",padding.left+390)
  .attr("y",padding.top+100)
  .attr("font-size","30px")
  .attr("fill","#000")
  .attr("text-anchor","end")
  .text("调用堆栈")

  gsvg.selectAll("path#stack").data(stack).enter()
  .append("path")
  .attr("id","stack")
  .attr("fill","none")
  .attr("stroke","#000")
  .attr("d",function(d,i){
    return "M "+
    (padding.left+400+i*150) +" "+
    (padding.top)+" "+
      "V 400";
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
  explain();
  render_func_text();
  render_stack();
}

function render_stack_item(_status,_delay){

  let r_height = 50;
  let itemUpdate_r = gsvg.selectAll("rect#item").data(_status.item);
  let item_r_enter = itemUpdate_r.enter();
  let item_r_exit= itemUpdate_r.exit();
  let itemUpdate_t = gsvg.selectAll("text#item").data(_status.item);
  let item_t_enter = itemUpdate_t.enter();
  let item_t_exit= itemUpdate_t.exit();

  item_r_enter.append("rect")
  .attr("id","item")
  .attr("fill","#fff")
  .attr("stroke","#000")
  .attr("stroke-width","1px")
  .attr("width",150)
  .attr("fill","LightSkyBlue")
  .attr("height",r_height)
  .attr("x",padding.left+400)
  .attr("y",padding.top-r_height-50)
    //.transition()
    //.duration(_delay)
  //.attr("y",function(d,i){
    ////return padding.top+400-(i+1)*r_height;
    //return 400-(i+1)*r_height;
  //})

  item_t_enter.append("text")
  .attr("id","item")
  .attr("x",padding.left+400)
  .attr("y",padding.top-r_height-50)
  .attr("fill","#fff")
  .text(function(d,i){
    ret
  })

}


//绘制每一帧的函数
function render(_status,_delay){
  render_stack_item(_status,_delay);
  //function 2
  //function 3
}
