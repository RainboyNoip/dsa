//数据生成
var frames = []; var stopid = 0; var rc;
var line = 1;

currentStatus = {};
lastStatus = {};



function stop(line,i,animation){
  lastStatus=clone(currentStatus)
  frames.push({
    status:lastStatus,
    line:line,
    animation:animation,
    id:stopid
  });
  stopid++;
}

function run(){
  //生成空的一帧
  _init_();
  stop(line,0);
  tranlate_argu();
  //指向的箭头 : 第二帧
  arg_path();
  stop(line,1);
  // 第三帧:参数的移动
  pass_arg();
}

function tranlate_argu(){
  currentStatus.argu = ['a','b']
}

function _init_(){
  currentStatus.arg_path = []
  currentStatus.pass_arg= []
}

function pass_arg(){
  currentStatus.pass_arg = [{
    arg:'a',
    sx:100,
    sy:325,
    dx:25,
    dy:25,
    tx:100,
    ty:75
  },
    {
      arg:'b',
      sx:250,
      sy:325,
      dx:25,
      dy:25,
      tx:250,
      ty:75
    }
  ]
}
//生成参数
function arg_path(){
  currentStatus.arg_path = [{
    start:[ background_data[4].x+ 25,background_data[4].y],
    end:[ background_data[2].x+ 25,background_data[2].y+50]
  },
  {
    start:[ background_data[5].x+ 25,background_data[5].y],
    end:[ background_data[3].x+ 25,background_data[3].y+50]
  },
];
}


lineExports = {
  init:function(){
    run();          //生成 frames 数据
    return frames;
  },
  clear:_init_
}
