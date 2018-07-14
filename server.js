var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('dist'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', function(socket){
    console.log('user connected')
    io.emit('PLAYER_CONNECTED');

    socket.on('REQUEST_BLOCKS', function(msg){
        console.log('REQUEST_BLOCKS',msg)
        io.emit('REQUEST_BLOCKS', msg);
    });

    socket.on('BLOCKS_BROADCAST', function(msg){
        console.log('BLOCKS_BROADCAST',msg)
        io.emit('BLOCKS_BROADCAST', msg);
    });

    socket.on('ACTION_BROADCAST', function(msg){
        console.log('ACTION_BROADCAST',msg)
        io.emit('ACTION_BROADCAST', msg);
    });

    socket.on('SEND_CHAT_MESSAGE', function(msg){
        console.log('SEND_CHAT_MESSAGE',msg)
        io.emit('SEND_CHAT_MESSAGE', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('PLAYER_DISCONNECTED');
    });
});

http.listen(4000, function(){
    console.log('listening on *:4000');
});