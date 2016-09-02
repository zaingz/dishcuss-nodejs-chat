// This file is executed in the browser, when people visit /chat/<random id>
 
$(function(){

	//window.location.pathname.split('/chat/')[1]
	var coun = 0 ;

	var pchat1 ;
	var pchat2 ;
	var pchat3 ;
	var pchat4 ;
	var pcount = 0 ;

	var db_pundits ;
	var f = [] ;

	// getting the id of the room from the url
	/*var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/dishcuss');*/
	
	// connect to the socket
	var socket = io();
	
	// variables which hold the data for each person
	var name = "",
		email = "",
		img = "",
		friend = "";

	// cache some jQuery objects
	var section = $(".section"),
		footer = $("footer"),
		onConnect = $(".connected"),
		inviteSomebody = $(".invite-textfield"),
		personInside = $(".personinside"),
		chatScreen = $(".chatscreen"),
		chatscreenpundit = $(".chatscreenpundit"),
		left = $(".left"),
		noMessages = $(".nomessages"),
		tooManyPeople = $(".toomanypeople");

	// some more jquery objects
	var chatNickname = $(".nickname-chat"),
		leftNickname = $(".nickname-left"),
		loginForm = $(".loginForm"),
		yourName = $("#yourName"),
		yourEmail = $("#yourEmail"),
		hisName = $("#hisName"),
		hisEmail = $("#hisEmail"),
		chatForm = $("#chatform"),
		textarea = $("#message"),
		messageTimeSent = $(".timesent"),
		chats = $(".chats");
		chats1 = $(".chats1");
		chats2 = $(".chats2");
		chats3 = $(".chats3");
		chats4 = $(".chats4");

	// these variables hold images
	var ownerImage = $("#ownerImage"),
		leftImage = $("#leftImage"),
		noMessagesImage = $("#noMessagesImage");

	//request to server to get pundits
	/*$.ajax({url: "/getpundits", method: "GET" , success: function(result){
	  console.log("Success");
	  for(i=0 ; i<result.length ; i++){
	  	console.log('Printing');
	  	console.log(result[i].email + " " + result[i].message + " " + result[i].name + " " + result[i].password);
	  	itemo[i] = result[i].email + '&' + result[i].message + '&' + result[i].room ;
	  }
	  console.log(itemo);
	  localStorage.setItem("dichcuss_pundits", itemo);


	  rom_chk = false;
		email =  window.location.search.split('&email=')[1];
		var na = window.location.search.split('&email=')[0].split('?name=')[1];
		name = na.charAt(0).toUpperCase() + na.slice(1);
		roomi = window.location.pathname.split('chat/')[1];
		rooms = ['pandit1','pandit2'];
		for (i = 0; i < rooms.length; i++) { 
		    if(rooms[i] == roomi){
		    	rom_chk = true;
		    	break;
		    }
		}

		var chk_pun_email = false;
		for(i=0 ; i<itemo.length ; i++){
			c = itemo[i];
			ema_chk = c.split('&')[0];
			ema_msg = c.split('&')[1];
			if(email == ema_chk){
				chk_pun_email = true ;
			}
		}

		if(chk_pun_email == true){
			$("#chatscreenid").addClass('hidden');
		}else{
			$("#chatscreenpunditid").addClass('hidden');
		}
		
		if(email != undefined && name != undefined && rom_chk == true){
			if(!isValid(email)){
					console.log("Invalid e-mail format!");
			}
			else {
				localStorage.setItem("dichcuss_chat_user", email);
				socket.emit('p1_join' , '{"id": "' + email + '" , "username": "' + name + '", "email": "' + email + '", "room": "' + roomi+ '"}');
				var sd = name + "&" + email;
				//loadDoc(sd);
			}
		}else{
			console.log("Either name or email missing");
		}



	}});*/


	// on connection to server get the id of person's room
	socket.on('connect', function(){
		//socket.emit('load', id);
		rom_chk = false;
		email =  window.location.search.split('&email=')[1];
		var na = window.location.search.split('&email=')[0].split('?name=')[1];
		name = na.charAt(0).toUpperCase() + na.slice(1);
		roomi = window.location.pathname.split('chat/')[1];
		rooms = ['pandit1','pandit2'];
		for (i = 0; i < rooms.length; i++) { 
		    if(rooms[i] == roomi){
		    	rom_chk = true;
		    	break;
		    }
		}

		var chk_pun_email = false;
		/*for(i=0 ; i<itemo.length ; i++){
			c = itemo[i];
			ema_chk = c.split('&')[0];
			ema_msg = c.split('&')[1];
			if(email == ema_chk){
				chk_pun_email = true ;
			}
		}*/

		if(email == "italian_pandit@dishcuss.com" || email == "desi_pandit@dishcuss.com"){
			chk_pun_email = true ;
		}

		if(chk_pun_email == true){
			$("#chatscreenid").addClass('hidden');
		}else{
			$("#chatscreenpunditid").addClass('hidden');
		}
		
		if(email != undefined && name != undefined && rom_chk == true){
			if(!isValid(email)){
					console.log("Invalid e-mail format!");
			}
			else {
				localStorage.setItem("dichcuss_chat_user", email);
				socket.emit('p1_join' , '{"id": "' + email + '" , "username": "' + name + '", "email": "' + email + '", "room": "' + roomi+ '"}');
				var sd = name + "&" + email;
				//loadDoc(sd);
			}
		}else{
			console.log("Either name or email missing");
		}

		/*var bol = window.location.href.split('/chat/')[1].indexOf("?");
		var bolv = window.location.href.split('/chat/')[1].indexOf("&");
		console.log(window.location.search);
		if(bol != -1 && bolv != -1){
			name = "Ali";
			localStorage.setItem("dichcuss_chat_user", "ali@gmail.com");
			email = "ali@gmail.com";
			socket.emit('p1_join' , {id: id , username: name , email: email});
		}
		else if (bol != -1){
			name = "Pandit";
			email = "dishcuss.pandit@gmail.com";
			localStorage.setItem("dichcuss_chat_user", "dishcuss.pandit@gmail.com" );
			coun = coun + 1 ;
			socket.emit('p1_join' , {id: id , username: name , email: email});
		}else{
			name = "Tayyab";
			email = "muhammad.tayyabmukhtar@yahoo.com";
			localStorage.setItem("dichcuss_chat_user", "muhammad.tayyabmukhtar@yahoo.com");
			socket.emit('p1_join' , {id: id , username: name , email: email});
		}*/
	});

	// start chat in room
	socket.on('chati', function(data){
		showMessage("chatStarted");
		showMessage("heStartedChatWithNoMessages",data);
		//chatNickname.text(friend);
		//localStorage.setItem(data.email, email);
		console.log(data);
	});

	socket.on('chatipandit', function(data){
		showMessage("chatStartedPandit");
		showMessage("heStartedChatWithNoMessages",data);
		//chatNickname.text(friend);
		//localStorage.setItem(data.email, email);
		console.log(data);
	});

	var id = localStorage.getItem("dichcuss_chat_user");
	socket.on(id, function(data){
		/*console.log(id);
		console.log(data);
		showMessage("chatStarted");
		createChatMessage(data.rply, data.pandit , data.id, "http://www.gravatar.com/avatar/6b7d19f9df91b20be0a9a4de39dd3913?s=140&r=x&d=mm", moment());
		scrollToBottom();*/
	});

	socket.on('idsave', function(data){
		localStorage.setItem(data.email, data.nick);
	});

	socket.on('pandit_msg', function(data){
		console.log(id);
		console.log(data);
		if(pcount == 0){
			pchat1 = data.sender;
			pcount = pcount + 1;
		}else
		if(pcount == 1){
			pchat2 = data.sender;
			pcount = pcount + 1;
		}else
		if(pcount == 2){
			pchat3 = data.sender;
			pcount = pcount + 1;
		}else
		if(pcount == 3){
			pchat4 = data.sender;
			pcount = pcount + 1;
		}
		showMessage("chatStarted");
		createChatMessage(data.rply, data.pandit, data.sender, "http://www.gravatar.com/avatar/6b7d19f9df91b20be0a9a4de39dd3913?s=140&r=x&d=mm", moment());
		scrollToBottom();
	});

	socket.on('welcome_msg', function(data){
		var ms = 'Welcome';
		//var puns = localStorage.getItem('dichcuss_pundits');
		
		/*var ara = [];
		ara = puns.split(',');
		for(i=0 ; i<ara.length ; i++) {
		  if(ara[i].split('&')[2] == 'Pundit1'){
		  	ms = ara[i].split('&')[1];
		  }
		}*/

		showMessage("chatStarted");
		createChatMessage(ms, 'Pandit', 'Pandit', "http://www.gravatar.com/avatar/6b7d19f9df91b20be0a9a4de39dd3913?s=140&r=x&d=mm", moment());
		scrollToBottom();
	});
	//socket.emit('p1_msg' , )
	// save the gravatar url
	socket.on('img', function(data){
		img = data;
	});

	// receive the names and avatars of all people in the chat room
	socket.on('peopleinchat', function(data){
		console.log(data);
		if(data.number === 0){
			showMessage("connected");
			console.log("User");
			var param = window.location.search.split('?name=')[1].charAt(0).toUpperCase() + window.location.search.split('?name=')[1].slice(1);
			var name_d = param.split('&id=')[0];
			var id_d = param.split('&id=')[1];
			if (typeof name != 'undefined'){
				name = name_d;
				email = name_d + "@yahoo.com";
				//mond(name , id_d);
				var sd = name_d + "&" + id_d;
				console.log("mongo = " + sd);
				loadDoc(sd);
			}else{
				console.log("Mazzay a jann ge");
				name = "User";
				email = "muhammad.tayyab@yahoo.com";
			}
			

			/*loginForm.on('submit', function(e){

				e.preventDefault();
				console.log("First User");
				name = "User";
				
				if(name.length < 1){
					alert("Please enter a nick name longer than 1 character!");
					return;
				}

				email = "muhammad.tayyabmukhtar@yahoo.com";

				if(!isValid(email)) {
					alert("Please enter a valid email!");
				}
				else {

					showMessage("inviteSomebody");

					// call the server-side function 'login' and send user's parameters
					socket.emit('login', {user: name, avatar: email, id: id});
				}
			
			});*/
			/*socket.emit('login', {user: "User", avatar: "muhammad.tayyabmukhtar@yahoo.com", id: id});*/

			console.log("First User");
			
			showMessage("inviteSomebody");
			socket.emit('login', {user: name, avatar: email, id: id});
		}

		else if(data.number === 1) {

			showMessage("personinchat",data);
			console.log("Pandit");

			/*loginForm.on('submit', function(e){

				e.preventDefault();
				console.log("Pandit");
				name = "Food Pandit";

				if(name.length < 1){
					alert("Please enter a nick name longer than 1 character!");
					return;
				}

				if(name == data.user){
					alert("There already is a \"" + name + "\" in this room!");
					return;
				}
				email = "muhammad.tayyabmukhtar@gmail.com";

				if(!isValid(email)){
					alert("Wrong e-mail format!");
				}
				else {
					socket.emit('login', {user: name, avatar: email, id: id});
				}

			});*/
			/*socket.emit('login', {user: "Pandit", avatar: "muhammad.tayyabmukhtar@gmail.com", id: id});*/

			console.log("Pandit");
			name = "Food Pandit";
			email = "muhammad.tayyabmukhtar@gmail.com";
			socket.emit('login', {user: name, avatar: email, id: id});
		}

		else {
			showMessage("tooManyPeople");
		}

	});

	// Other useful 

	socket.on('startChat', function(data){
		console.log(data);
		if(data.boolean && data.id == id) {

			chats.empty();

			if(name === data.users[0]) {

				showMessage("youStartedChatWithNoMessages",data);
			}
			else {

				showMessage("heStartedChatWithNoMessages",data);
			}

			chatNickname.text(friend);
		}
	});

	socket.on('leave',function(data){

		if(data.boolean && id==data.room){

			showMessage("somebodyLeft", data);
			chats.empty();
		}

	});

	socket.on('tooMany', function(data){

		/*if(data.boolean && name.length === 0) {
			showMessage('tooManyPeople');
		}*/
		showMessage('tooManyPeople');
	});

	socket.on('receive', function(data){
		console.log(data);
		showMessage('chatStarted');

		if(data.msg.trim().length) {
			createChatMessage(data.msg, data.user, data.id , data.img, moment());
			scrollToBottom();
		}
	});

	textarea.keypress(function(e){

		// Submit the form on enter

		if(e.which == 13) {
			e.preventDefault();
			chatForm.trigger('submit');
		}

	});

	chatForm.on('submit', function(e){

		e.preventDefault();

		// Create a new chat message and display it directly

		showMessage("chatStarted");

		if(textarea.val().trim().length) {
			createChatMessage(textarea.val(), name, email ,  img, moment());
			scrollToBottom();
			// Send the message to the other person in the chat
			emai = window.location.search.split('&email=')[1];
			if(emai == "italian_pandit@dishcuss.com" || emai == "desi_pandit@dishcuss.com"){
				//socket.emit('p1_msg', {id: id ,msg: textarea.val(), user: name, img: img , room: rooma});
				//console.log(textarea.val() + " " + roomi);
				socket.emit('pandit_rply' , {msg: textarea.val() , room: roomi , pandit: 'Pandit'} );
			}
			else{
				//emas = window.location.search.split('&email=')[1];
				emas = localStorage.getItem(email);
				console.log(emas);
				socket.emit('p1_msg', {id: emas ,msg: textarea.val(), user: name, img: img , room: roomi});
			}

		}
		// Empty the textarea
		textarea.val("");
	});

	// Update the relative time stamps on the chat messages every minute

	setInterval(function(){

		messageTimeSent.each(function(){
			var each = moment($(this).data('time'));
			$(this).text(each.fromNow());
		});

	},60000);

	// Function that creates a new chat message

	function createChatMessage(msg,user,emai,imgg,now){
		console.log(emai + " " + user + " mazaaaaaaaaaaaaa ");
		var who = '';

		if(user===name) {
			who = 'me';
		}
		else {
			who = 'you';
		}

		

		var li = $(
			'<li class=' + who + '>'+
				'<div class="image">' +
					'<img src=' + imgg + ' />' +
					'<b></b>' +
					'<i class="timesent" data-time=' + now + '></i> ' +
				'</div>' +
				'<p></p>' +
			'</li>');

		// use the 'text' method to escape malicious user input
		email =  window.location.search.split('&email=')[1];
		if((email == "italian_pandit@dishcuss.com" && user != 'Pandit') ||  ( email == "desi_pandit@dishcuss.com" && user != 'Pandit' )){
			msg = emai + ": " + msg ;
		}

		li.find('p').text(msg);
		li.find('b').text(user);

		//console.log(li);
		if((email == "italian_pandit@dishcuss.com" && user == 'Pandit') ||  ( email == "desi_pandit@dishcuss.com" && user == 'Pandit' )){
			console.log("Pandit Aya");
			console.log(id);
			console.log(pchat1 +" " + pchat2 + " " + pchat3 + " " + pchat4 + " Love");
			emasi = msg.split(' ')[0].slice( 1 );
			console.log(emasi);
			if(pchat1 == emasi){
				$('#chat1').append(li);
			}else
			if(pchat2 == emasi){
				$('#chat2').append(li);
			}else
			if(pchat3 == emasi){
				$('#chat3').append(li);
			}else
			if(pchat4 == emasi){
				$('#chat4').append(li);
			}

			
		}else if(email == "italian_pandit@dishcuss.com" || email == "desi_pandit@dishcuss.com" ){
			console.log('pandit');
			console.log(id);
			console.log(pchat1 +" " + pchat2 + " " + pchat3 + " " + pchat4 + " Msg");
			if(pchat1 == emai){
				$('#chat1').append(li);
			}else
			if(pchat2 == emai){
				$('#chat2').append(li);
			}else
			if(pchat3 == emai){
				$('#chat3').append(li);
			}else
			if(pchat4 == emai){
				$('#chat4').append(li);
			}
		}else{
			chats.append(li);
		}

		messageTimeSent = $(".timesent");
		messageTimeSent.last().text(now.fromNow());
	}

	function scrollToBottom(){
		$("html, body").animate({ scrollTop: $(document).height()-$(window).height() },1000);
	}

	function isValid(thatemail) {

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(thatemail);
	}

	function showMessage(status,data){

		if(status === "connected"){

			section.children().css('display', 'none');
			onConnect.fadeIn(1200);
		}

		else if(status === "inviteSomebody"){

			// Set the invite link content
			$("#link").text(window.location.href);

			onConnect.fadeOut(1200, function(){
				inviteSomebody.fadeIn(1200);
			});
		}

		else if(status === "personinchat"){

			onConnect.css("display", "none");
			personInside.fadeIn(1200);

			chatNickname.text(data.user);
			ownerImage.attr("src",data.avatar);
		}

		else if(status === "youStartedChatWithNoMessages") {

			left.fadeOut(1200, function() {
				inviteSomebody.fadeOut(1200,function(){
					noMessages.fadeIn(1200);
					footer.fadeIn(1200);
				});
			});

			friend = data.users[1];
			noMessagesImage.attr("src",data.avatars[1]);
		}

		else if(status === "heStartedChatWithNoMessages") {

			personInside.fadeOut(1200,function(){
				noMessages.fadeIn(1200);
				footer.fadeIn(1200);
			});

			friend = data.users[0];
			noMessagesImage.attr("src",data.avatars[0]);
		}

		else if(status === "chatStartedPandit"){

			//section.children().css('display','none');
			chatscreenpundit.css('display','block');
			footer.fadeIn(1200);
		}

		else if(status === "chatStarted"){

			section.children().css('display','none');
			chatScreen.css('display','block');
		}

		else if(status === "somebodyLeft"){

			leftImage.attr("src",data.avatar);
			leftNickname.text(data.user);

			section.children().css('display','none');
			footer.css('display', 'none');
			left.fadeIn(1200);
		}

		else if(status === "tooManyPeople") {

			section.children().css('display', 'none');
			tooManyPeople.fadeIn(1200);
		}
	}

});

function loadDoc(nam) {
	var url = "/mond/" + nam ;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.log("Record Inserted");
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}
