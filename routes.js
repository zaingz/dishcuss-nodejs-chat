// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar');
var array = [];
var dat ;



// Render the chant.html view
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/dishcuss';

/*var pg = require('pg');

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
var conString = "postgres://tayyab@localhost:5432/dishcuss_api_development";
var client = new pg.Client(conString);

// connect to our database
client.connect(function (err) {
  if (err) throw err;

  // execute a query on our database
  client.query('SELECT * from users', function (err, result) {
    if (err) throw err;

    // just print the result to the console
    console.log(result.rows[0]); // outputs: { name: 'brianc' }

    // disconnect the client
    client.end(function (err) {
      if (err) throw err;
    });
  });
});
*/




/*var pg = require("pg");

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'tayyab', //env var: PGUSER
  database: 'dishcuss_api_development', //env var: PGDATABASE
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * from users', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
});

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})*/


/*var pg = require('pg');
var connectionString = "postgres://tayyab@localhost:5432/dishcuss_api_development";
var config_dd = {
  user: 'tayyab', //env var: PGUSER
  username: 'tayyab',
  database: 'dishcuss_api_development', //env var: PGDATABASE
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          //done();
          console.log(err);
          //return res.status(500).json({ success: false, data: err});
        }else{
        	// SQL Query > Select Data
	        var query = client.query("SELECT * FROM users");

	        // Stream results back one row at a time
	        query.on('row', function(row) {
	            results.push(row);
	        });

	        // After all data is returned, close connection and return results
	        query.on('end', function() {
	            done();
	            console.log(results);
	            return res.json(results);
	        });
	    }

    });*/


// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app,io){

	app.get('/', function(req, res){

		// Render views/home.html
		res.render('home');
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){

		// Render the chant.html view
		res.render('chat');	
	});

	app.get('/pundits', function(req,res){
		// Render the chant.html view
		res.render('pundit');	
	});

	app.get('/getpundits', function(req,res){
		

		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
		  if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
		    //HURRAY!! We are connected. :)
		    console.log('Connection established to', url);

		    // Get the documents collection
		    var collection = db.collection('pundits');

		    collection.find().toArray(function(err, items) {
	          dat = items;
	          console.log(items);
	          console.log('Records Fetched');
	          res.send(items);
	          db.close();
	        });
		  }
		});
	});

	app.post('/pundit/save', function(req,res){
		console.log('Name '+req.body.name);
		console.log('Room '+req.body.room);
		console.log('Email '+req.body.email);
		console.log('Password '+req.body.password);
		console.log('Message '+req.body.message);
		/*console.log('Pundit Name '+req.body.pun_name);
		console.log('Pundit Room '+req.body.room);
		console.log('Email '+req.body.email);
		console.log('Password '+req.body.pwd);
		console.log('Confirm Password '+req.body.c_pwd);
		console.log('Welcome Message '+req.body.w_msg);*/
		save_pundit(req.body.name, req.body.room, req.body.email, req.body.password, req.body.message);
		res.redirect('/pundits');
	});

	app.get('/mond/:name', function(req,res){

		var param = req.url.split('/');
		var par = param[param.length-1];
		var nam_d = par.split('&')[0];
		var id_d = par.split('&')[1];	
		mond(nam_d,id_d);
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {
		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room
		socket.on('p1_join', function(data){
			console.log(data);

			var msgtocli = 'Welcome';
			var asf = JSON.parse(data);
			console.log(asf.username);

			var room = findClientsSocket(io,asf.room);
			ar_chk = false;
			console.log(room.length + " " + asf.email);
			if(room.length  < 15){
				socket.username = asf.username;
				socket.user_id = asf.id;
				socket.room = asf.room;
				socket.avatar = gravatar.url(asf.username, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);

				// Add the client to the room
				socket.join(asf.room);
				ur = asf.username[0].toLowerCase() +"" + asf.username[1];
				ar_count = 0;
				nic = "";
				array.forEach(function(value){
				  if(value.email == asf.email && value.room == asf.room){
				  	ar_chk = true;
				  	ds = value.nick;
				  	array[ar_count] = {email: asf.email , room: asf.room , socket_id: socket.id , nick: ds};
				  }
				  ar_count = ar_count + 1;
				});
				if(ar_chk == false && array.length > 1){
					ad = false;
					while(ad == false){
						bool = false;
						artr = false;
						nic = ur + Math.round((Math.random() * 100));
						console.log(nic + " " + array.length);
						array.forEach(function(trav){
							artr = true;
							if(trav.nick == nic){
								console.log("Nikki " + trav.nick);
								bool = true;
							}
						});
						if(artr == true){
							ad =  true;
						}else if(bool == false){
							ad = false;
						}
						else{
							ad = true;
						}
					}
				}
				nic = ur + Math.round((Math.random() * 100));
				console.log("Nick Name: " + nic);
				array.push({email: asf.email , room: asf.room , socket_id: socket.id , nick: nic});
				socket.emit('idsave' , {email: asf.email , nick: nic});
				console.log('chowing dat ' + dat);
				if(asf.email == "italian_pandit@dishcuss.com" || asf.email == "desi_pandit@dishcuss.com" || asf.email == "continental_pandit@dishcuss.com" || asf.email == "fast_food_pandit@dishcuss.com" || asf.email == "sasta_pandit@dishcuss.com" || asf.email == "foreign_pandit@dishcuss.com"){
					socket.emit('chatipandit' , {id: [asf.id] , users: [asf.user] , avatars: [socket.avatar]} );
				}else{

					socket.emit('chati' , {id: [asf.id] , users: [asf.user] , avatars: [socket.avatar]} );
					io.to(socket.id).emit('welcome_msg', {msg: msgtocli , id: nic});
				}
			}else{
				socket.emit('tooMany' , {});
			}
			
		});


		socket.on('load',function(data){

			var room = findClientsSocket(io,data);
			if(room.length === 0 ) {

				socket.emit('peopleinchat', {number: 0});
			}
			else if(room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: 'Pandit',
					avatar: 'muhammad.tayyabmukhtar@gmail.com',
					id: data
				});
			}
			else if(room.length >= 2) {

				chat.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {
			var room = findClientsSocket(io, data.id);
			// Only two people per room are allowed
			if (room.length < 2) {

				// Use the socket object to store data. Each client gets
				// their own unique socket object
				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if (room.length == 1) {

					var usernames = [],
						avatars = [];

					usernames.push(room[0].username);
					usernames.push(socket.username);

					avatars.push(room[0].avatar);
					avatars.push(socket.avatar);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}
			}
			else {
				socket.emit('tooMany', {boolean: true});
			}
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){
			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});

		//Food pundit app
		socket.on('p1_msg_app', function(data){
			var asfs = JSON.parse(data);

			var msg = asfs.msg;
			var sender_id = asfs.id;
			console.log(asfs);
			var pundit_reply ;
			var pandit ;
			if(asfs.room == 'desi'){
				p_id = "desi_pandit@dishcuss.com";
				pundit_reply = "Desi Pandit is sending messages " + socket.id;
				pandit = "Desi Pandit";
			}else if(asfs.room == 'pandit2'){
				p_id = "italian_pandit@dishcuss.com";
				pundit_reply = "Italian Pandit is sending messages" + socket.id;
				pandit = "Italian Pandit";
			}else if(asfs.room == 'sasta'){
				p_id = "sasta_pandit@dishcuss.com";
				pundit_reply = "Sasta Pandit is sending messages" + socket.id;
				pandit = "Sasta Pandit";
			}else if(asfs.room == 'fast_food'){
				p_id = "fast_food_pandit@dishcuss.com";
				pundit_reply = "Fast Food Pandit is sending messages" + socket.id;
				pandit = "Fast Food Pandit";
			}else if(asfs.room == 'continental'){
				p_id = "continental_pandit@dishcuss.com";
				pundit_reply = "Continental Pandit is sending messages" + socket.id;
				pandit = "Continental Pandit";
			}else if(asfs.room == 'foreign'){
				p_id = "foreign_pandit@dishcuss.com";
				pundit_reply = "Foreign Pandit is sending messages" + socket.id;
				pandit = "Foreign Pandit";
			}else{
				p_id = "wella_pandit@dishcuss.com";
				pundit_reply = "Wella Pandit is sending messages" + socket.id;
				pandit = "Wella Pandit";
			}
			basd = 0 ;
			array.forEach(function(value){

			  if(value.email == p_id && value.room == asfs.room && basd == 0){
			  	console.log(value.socket_id + " " + value.email + " " + basd);
			  	basd=1;
			  	io.to(value.socket_id).emit('pandit_msg', {rply: asfs.msg , pandit: asfs.user , sender: asfs.id});
			  }
			  //console.log(value.socket_id);
			});
			
			// When the server receives a message, it sends it to the other person in the room.
			//socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
			//socket.in(data.r_id).emit('receive', {msg: data.msg, user: data.user, img: data.img});
			//send message on pandit socket
		});

		//Food pundit
		socket.on('p1_msg', function(data){
			var msg = data.msg;
			var sender_id = data.id;
			console.log(data);
			var pundit_reply ;
			var pandit ;
			if(data.room == 'desi'){
				p_id = "desi_pandit@dishcuss.com";
				pundit_reply = "Desi Pandit is sending messages " + socket.id;
				pandit = "Desi Pandit";
			}else if(data.room == 'pandit2'){
				p_id = "italian_pandit@dishcuss.com";
				pundit_reply = "Italian Pandit is sending messages" + socket.id;
				pandit = "Italian Pandit";
			}else if(data.room == 'continental'){
				p_id = "continental_pandit@dishcuss.com";
				pundit_reply = "Continental Pandit is sending messages" + socket.id;
				pandit = "Continental Pandit";
			}else if(data.room == 'fast_food'){
				p_id = "fast_food_pandit@dishcuss.com";
				pundit_reply = "Fast Food Pandit is sending messages" + socket.id;
				pandit = "Fast Food Pandit";
			}else if(data.room == 'sasta'){
				p_id = "sasta_pandit@dishcuss.com";
				pundit_reply = "Sasta Pandit is sending messages" + socket.id;
				pandit = "Sasta Pandit";
			}else if(data.room == 'foreign'){
				p_id = "foreign_pandit@dishcuss.com";
				pundit_reply = "Foreign Pandit is sending messages" + socket.id;
				pandit = "Foreign Pandit";
			}
			basd = 0 ;
			array.forEach(function(value){

			  if(value.email == p_id && value.room == data.room && basd == 0){
			  	console.log(value.socket_id + " " + value.email + " " + basd);
			  	basd=1;
			  	io.to(value.socket_id).emit('pandit_msg', {rply: data.msg , pandit: data.user , sender: data.id});
			  }
			  //console.log(value.socket_id);
			});
			
			// When the server receives a message, it sends it to the other person in the room.
			//socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
			//socket.in(data.r_id).emit('receive', {msg: data.msg, user: data.user, img: data.img});
			//send message on pandit socket
		});

		socket.on('pandit_rply' , function(data){
			em = data.msg.split(' ');
			console.log(em[0].slice(1));
			//console.log(data);
			soch_ch = false;
			array.forEach(function(value){
				if(value.nick == em[0].slice(1) && value.room == data.room){
				  	soch = value.socket_id;
				  	soch_ch = true;
				}
			});
			if(soch_ch == true){
				d_ms = "";
				for(i = 1 ; i < em.length ; i++){
					d_ms = d_ms + " " + em[i];
				}
				console.log(d_ms);
				io.to(soch).emit('pandit_msg', {rply: d_ms , pandit: data.pandit , sender: em[0].slice(1)});
			}
			
		});
	});
};

function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}


function mond(u_name , u_id){
	/*//lets require/import the mongodb native drivers.
	var mongodb = require('mongodb');

	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;

	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/dishcuss';*/

	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    // Get the documents collection
	    var collection = db.collection('users');

	    //Create some users
	    var user1 = {name: u_name, user_id: u_id};

	    // Insert some users
	    collection.insert(user1, function (err, result) {
	      if (err) {
	        console.log(err);
	      } else {
	        console.log('Inserted documents into the "users" collection.');
	      }
	      //Close connection
	      db.close();
	    });
	  }
	});
}
/*console.log('Pundit Name '+req.body.pun_name);
		console.log('Pundit Room '+req.body.room);
		console.log('Email '+req.body.email);
		console.log('Password '+req.body.pwd);
		console.log('Confirm Password '+req.body.c_pwd);
		console.log('Welcome Message '+req.body.w_msg);*/

function save_pundit(u_name, u_room, u_email, u_pass, u_msg){
	/*//lets require/import the mongodb native drivers.
	var mongodb = require('mongodb');

	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;

	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/dishcuss';*/

	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    // Get the documents collection
	    var collection = db.collection('pundits');

	    //Create some users
	    var user1 = {name: u_name , room: u_room , email: u_email , password: u_pass , message: u_msg};

	    // Insert some users
	    collection.insert(user1, function (err, result) {
	      if (err) {
	        console.log(err);
	      } else {
	        console.log('Inserted documents into the "pundits" collection.');
	      }
	      //Close connection
	      db.close();
	    });
	  }
	});
}

function get_pundit(){
	
	/*//lets require/import the mongodb native drivers.
	var mongodb = require('mongodb');

	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;

	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/dishcuss';*/

	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    // Get the documents collection
	    var collection = db.collection('pundits');

	    collection.find().toArray(function(err, items) {
          dat = items;
          console.log(items);
          console.log('Records Fetched');
          db.close();
        });
	  }
	});
	return dat;
}