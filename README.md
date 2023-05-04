# 3D-multi-player
Udemy course: https://www.udemy.com/course/create-a-3d-multi-player-game-using-threejs-and-socketio Learn to use the WebGL library THREE js, NODE.Js and Socket IO to create a 3D multi-player game.





## 文件结构介绍
### nodeapps
server端的代码，不能从http服务器访问

__!!! 首先要在对应的文件夹`npm install -a`__

之后再运行 : `node app.js`
#### node 
介绍node的有关案例，解释了node创建服务器的原理
#### room
简易聊天室的服务器端

#### socket-test
用socket.io 制作的简易聊天室，我增加了两个功能
- 显示自己发送的信息
- 自己发送的信息背景显示为蓝色

### public_html
client端的代码
#### room
简易聊天室的客户端