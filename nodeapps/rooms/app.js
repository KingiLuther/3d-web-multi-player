const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');

app.use(express.static('../../public_html/rooms'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/../../public_html/rooms/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected ');
    io.emit('rooms', getRooms('connected'));

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('new room', function (room) {
        console.log(`A new room is created [${room}]`);
        socket.room = room;
        socket.join(room);
        io.emit('rooms', getRooms('new room'));
    });

    socket.on('join room', function (room) {
        console.log(`A new user joined room [${room}]`);
        socket.room = room;
        socket.join(room);
        io.emit('rooms', getRooms('joined room'));
    });

    // 此处的data包含{name, room, msg: $('#msgs-msg').val()}
    socket.on('chat message', function (data) {
        io.in(data.room).emit('chat message', {username: data.name, msg: `${data.name}: ${data.msg}`});
    });

    socket.on('set username', function (name) {
        console.log(`username set to ${name}(${socket.id})`);
        socket.username = name;
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function getRooms(msg) {
    // 在Socket.IO中，Namespace（命名空间）是一种将客户端连接分组的方式，它允许我们在同一个服务器实例中创建多个Socket.IO实例。默认情况下，每个Socket.IO实例都会创建一个称为“/”（根）的Namespace。

    // 使用io.of('/')来获取根Namespace，即默认Namespace。
    const nsp = io.of('/');

    /* 获取所有房间的对象，它是一个键值对集合，
    每个键代表一个房间的ID，对应的值则是一个包含该房间中连接的socket ID的对象，like:
    {
      'roomid1': { 'socketid1', socketid2', ...},
      ...
    }*/
    const rooms = nsp.adapter.rooms;
    console.log('getRooms rooms>>' + util.inspect(rooms));

    const list = {};

    for (let roomId in rooms) {
        const room = rooms[roomId];
        if (room === undefined) continue;
        const sockets = [];
        let roomName = "";
        //console.log('getRooms room>>' + util.inspect(room));
        for (let socketId in room.sockets) {
            const socket = nsp.connected[socketId];
            if (socket === undefined || socket.username === undefined || socket.room === undefined) continue;
            //console.log(`getRooms socket(${socketId})>>${socket.username}:${socket.room}`);
            sockets.push(socket.username);
            if (roomName == "") roomName = socket.room;
        }
        if (roomName != "") list[roomName] = sockets;
    }

    console.log(`getRooms: ${msg} >>` + util.inspect(list));

    return list;
}