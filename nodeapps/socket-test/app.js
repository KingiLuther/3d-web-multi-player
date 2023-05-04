const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 返回的是本文件夹下的index.html
app.get('/', function(req, res){
    // res.send("<h1>hello world！</h1>")
    res.sendFile(__dirname + '/index.html');
});

// server 用on处理 client的emit
io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', function(){
       console.log('A user disconnected'); 
    });
    socket.on('chat message', function(msg){
       console.log(msg);
        socket.broadcast.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log("Listening on port 3000");
})