
## 实现原理

使用开源项目:
 
  - vue2.0
  - d3.js
  - alifont fruit图标


前面使用html flex 写好界面,使用vue2.x 分好各个组件,完成组件之间的通信.

进入一个算法route的时候,自动加载dsa文件下对应的这些文件:

 - algorithm.c 算法的代码,用于显示
 - line.js  根据算法来实现数据
 - sytle.css 加载的样式文件
 - render.js  用d3来渲染数据


