var express = require('express');
var app = express();
const port = process.env.PORT || 3000;
const http = require('http');
var serv = http.Server(app);
var io = require('socket.io')(serv);
const { v4: uuidV4 } = require('uuid');

app.set('view engine','ejs');
app.use(express.static('client'));

app.get('/',function(req, res) {
	res.redirect(`/${uuidV4()}`);
});

app.get('/:room',function(req, res) {
	res.render('room',{roomId: req.params.room});
});

serv.listen(port);

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(id){
	var self = {
		id:id,
		logedIn:"NO",
		team:"",
		email:"",
		uid:"",
		streamPlayer:""
	}
	return self;
}

io.sockets.on('connection', function(socket){
	// socket.id = Math.random();
	// SOCKET_LIST[socket.id] = socket;

	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.broadcast.to(roomId).emit('user-connected', userId)
	
		socket.on('disconnect', () => {
			// delete SOCKET_LIST[socket.id];
			// delete PLAYER_LIST[socket.id];
			socket.broadcast.to(roomId).emit('user-disconnected', userId)
		})
	  })
	// socket.on('loginButton',function(data){
	// 	PLAYER_LIST[socket.id] = Player(socket.id);
	// 	PLAYER_LIST[socket.id].logedIn = 'YES';
	// 	PLAYER_LIST[socket.id].email = data.email;
	// 	PLAYER_LIST[socket.id].team = data.team;
	// 	PLAYER_LIST[socket.id].uid = btoa(data.email);
	// 	PLAYER_LIST[socket.id].streamPlayer = data.streamPlayer;
	// 	socket.emit('loginButton',PLAYER_LIST[socket.id]);
	// });

});

// setInterval(function(){
// 	var pack = [];
// 	for(var i in PLAYER_LIST){
// 		var player = PLAYER_LIST[i];
// 		if (player.logedIn === 'YES'){
// 			pack.push({
// 				uid:player.uid,
// 				team:player.team,
// 				email:player.email
// 			});	
// 		}	
// 	}
// 	for(var i in SOCKET_LIST){
// 		var socket = SOCKET_LIST[i];
// 		socket.emit('myloop',pack);
// 	}
	
// },1000/25);