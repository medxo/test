var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(id){
	var self = {
		id:id,
		logedIn:"NO",
		team:"",
		email:"",
		uid:""
	}
	return self;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();

	SOCKET_LIST[socket.id] = socket;
	
	socket.on('disconnect',function(){
		
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		
	});

	socket.on('loginButton',function(data){
		PLAYER_LIST[socket.id] = Player(socket.id);
		PLAYER_LIST[socket.id].logedIn = 'YES';
		PLAYER_LIST[socket.id].email = data.email;
		PLAYER_LIST[socket.id].team = data.team;
		PLAYER_LIST[socket.id].uid = btoa(data.email);
		socket.emit('loginButton',PLAYER_LIST[socket.id]);
	});

});

setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		if (player.logedIn === 'YES'){
			pack.push({
				uid:player.uid,
				team:player.team,
				email:player.email
			});	
		}	
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('myloop',pack);
	}
	
},1000/25);