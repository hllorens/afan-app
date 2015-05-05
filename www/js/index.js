
// MEDIA
var images = [
"../../afan-app-media/img/spacer158.png",
"../../afan-app-media/img/wordimg-sprite.png",
"../../afan-app-media/img/correct.png",
"../../afan-app-media/img/wrong.png"
];

var sounds = [
	// it can be dropbox https://dl.dropboxusercontent.com/u/188219/
	//or absolute http://www.centroafan.com/afan-app-media/audio/...m4a"
	// relative is the best to reuse it in the cordova app
	"../../afan-app-media/audio/soundsSpriteVBR30-19kbps-100k.m4a"
];

// Check for debug mode
var QueryString=get_query_string();
var debug=false;
if(QueryString.hasOwnProperty('debug') && QueryString.debug=='true') debug=true;

// LOAD ACTIVITIES
var json_test, json_training;
ajax_request_json("../data/test1.tsv.json",function(json){
    json_test=json; //console.log(json)
});
ajax_request_json("../data/training1.json", function(json) { //training1, training1-short
    json_training=json; //console.log(json)
});
var json_activities=json_training;

// if media not found locally, url
//image_src_start_exists=clicked_answer.indexOf("src=\""+media_url)
//clicked_answer=clicked_answer.substring(image_src_start_exists+media_url.length+15,img_src_end)
//media_url='http://www.centroafan.com/afan-app-media/'
//backend_url='http://www.centroafan.com/afan-app-backend/'
var backend_url='backend/' //../backend


var audio_object_sprite_ref={
	a: {id: "a50", start: 19.158, end: 19.658}, 
	b: {id: "b50", start: 11.610, end: 12.107}, 
	bv: {id: "bv50", start: 1.000, end: 1.496}, 
	ch: {id: "ch50", start: 16.155, end: 16.657}, 
	d: {id: "d50", start: 34.142, end: 34.644}, 
	e: {id: "e50", start: 25.122, end: 25.624}, 
	f: {id: "f50", start: 31.138, end: 31.640}, 
	g: {id: "g50", start: 26.624, end: 27.120}, 
	i: {id: "i50", start: 20.658, end: 21.121}, 
	j: {id: "j50", start: 7.069, end: 7.568}, 
	k: {id: "k50", start: 35.644, end: 36.144}, 
	l: {id: "l50", start: 14.610, end: 15.155}, 
	m: {id: "m50", start: 23.619, end: 24.122}, 
	n: {id: "n50", start: 32.640, end: 33.142}, 
	ny: {id: "ny50", start: 8.568, end: 9.111}, 
	o: {id: "o50", start: 37.144, end: 37.649}, 
	p: {id: "p50", start: 28.120, end: 28.609}, 
	r: {id: "r50", start: 29.609, end: 30.138}, 
	rr: {id: "rr50", start: 22.121, end: 22.619}, 
	s: {id: "s50", start: 10.111, end: 10.610}, 
	t: {id: "t50", start: 2.496, end: 2.996}, 
	u: {id: "u50", start: 3.996, end: 4.496}, 
	y: {id: "y50", start: 5.496, end: 6.069}, 
	z: {id: "z50", start: 17.657, end: 18.158}, 
	zfx_correct: {id: "zfx_correct50", start: 13.107, end: 13.610}, 
	zfx_wrong: {id: "zfx_wrong50", start: 38.649, end: 39.150}, 
	zsilence_start: {id: "zsilence_start", start: 0.100, end: 0.500}	
};


// constants
var USE_ANSWERS = 3;
var MAX_PLAYS=2;
var MAX_TRAINING_ACTIVITIES=10;



// variables
var media_objects;
var audio_sprite;

var header_zone=document.getElementById('header');
var canvas_zone=document.getElementById('zone_canvas');

var remaining_rand_activities=[];
var correct_answer='undefined';
var current_activity_type='undefined'; // to avoid loading all the html

//optional??
var zone_sound=null;
var dom_score_correct;
var dom_score_answered;


var activity_timer=new ActivityTimer();

var current_activity_data={};
var current_activity_index=0;
var current_activity_played_times=0;


var session_data={
	user: "afan",
	subject: "juan",
	subject_age: "5",
	level: "1",
	duration: 0,
	timestamp: "0000-00-00 00:00",
	num_correct: 0,
	num_answered: 0,
	result: 0,
	type: 'ord_fonemas',
	mode: 'training',
    action: 'send_session_data_post',
	details: []
};

var subjects_select_elem="none";
var user_subjects={};

var exit_app=function(){
		if(is_app){
			navigator.app.exitApp();
		}else{
			location.href = "http://www.centroafan.com";
		}
}


// See how to login and control session with js frontend... Use cookies (learn)

// DOM is ready because js is at the bottom of body
//preventHistoryBack(); //you need cordova to prevent this on device button..

var is_app=is_cordova();
if(is_app){
	document.addEventListener('deviceready', onDeviceReady, false);
}else{
	onDeviceReady();
}


function select_fill_with_json(data,select_elem){
	select_elem.innerHTML="";
	for(var key in data){
		if (data.hasOwnProperty(key)) {
			select_elem.innerHTML+='<option value="' + key + '">' + key + '</option>';	
		}
	}
}

function onDeviceReady() {
	device_info="browser"
	if(is_app){
		device_info = 'name='     + device.name     + '-' + 
                        'PhoneGap=' + device.phonegap + '-' + 
                        'Platform=' + device.platform + '-' + 
                        'UUID='     + device.uuid     + '-' + 
                        'Ver='  + device.version
		
	}
	splash_screen();
}

function splash_screen(){
	// the default index.html might contain splash screen directly (more efficient)
	media_objects=ResourceLoader.load_media(images,sounds,menu_screen,false,debug);
}

function menu_screen(){
	allowBackExit();
	var splash=document.getElementById("splash_screen");
	if(splash!=null) splash.parentNode.removeChild(splash);

	header_zone.innerHTML='<h1>Conciencia Fonológica</h1>';
	if(debug){
		console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info);
		console.log('not_loaded sounds: '+ResourceLoader.not_loaded['sounds'].length);
	}
	canvas_zone.innerHTML=' \
	<div id="menu-content" class="text-center">\
	<div id="menu-logo-div"></div> \
	Sujeto:  <select id="subjects-select"></select> \
	<nav id="responsive_menu">\
	<br /><button id="start-button" class="button" disabled="true">Practicar</button> \
	<br /><button id="start-test-button" class="button" disabled="true">Test</button> \
	<br /><button id="add-subject" disabled="true" class="button" onclick="add_subject()">Añadir Participante</button> \
	<br /><button id="results" disabled="true" class="button" onclick="explore_results()">Resultados</button> \
	<br /><button id="exit" class="button exit" onclick="exit_app()">Salir</button> \
	</nav>\
	</div>\
	';

	//document.getElementById("splash-logo-div").appendChild(media_objects.images['key.png'])
	subjects_select_elem=document.getElementById('subjects-select');

	ajax_request_json(
		backend_url+'ajaxdb.php?action=get_subjects&user='+session_data.user, 
		function(data) {
			user_subjects=data;
			select_fill_with_json(data,subjects_select_elem); 
			document.getElementById("start-button").disabled=false; 
			document.getElementById("start-test-button").disabled=false;
			document.getElementById("add-subject").disabled=false;
			document.getElementById("results").disabled=false;
			// MAL pq no se puede modificar el evento... lo que hay q hacer es un objeto game y prototiparlo
			document.getElementById("start-button").onclick=function(){session_data.mode="training";json_activities=json_training;game()};
			document.getElementById("start-test-button").onclick=function(){session_data.mode="test";json_activities=json_test;game()};
		}
	);
}


var add_subject=function(){
	var accept_function=function(){
		var myform=document.getElementById('my-form');
		var myformsubmit=document.getElementById('my-form-submit');
		if (!myform.checkValidity()){
			if(debug) console.log("form error");
			// TODO se puede abstraer merjor...
		    myform.removeEventListener("submit", formValidationSafariSupport);
		    myform.addEventListener("submit", formValidationSafariSupport);

		    myformsubmit.removeEventListener("click", showFormAllErrorMessages);
		    myformsubmit.addEventListener("click", showFormAllErrorMessages);



			myformsubmit.click(); // won't submit (invalid), but show errors
		}else{
			ajax_request_json(
			backend_url+'ajaxdb.php?action=add_subject&user='+document.getElementById('new-user').value+'&alias='+document.getElementById('new-alias').value+'&name='+document.getElementById('new-name').value+'&birthdate='+document.getElementById('new-birthdate').value+'&comments='+document.getElementById('new-comments').value, 
			function(data) {
				var modal_text=document.getElementById("js-modal-window-text");
				if(data['success']!='undefined'){
					//modal_text.innerHTML="Añadido con éxito!!";
					subjects_select_elem.innerHTML+='<option value="' + data['success'] + '">' + data['success'] + '</option>';
					var elem_to_remove=document.getElementById("js-modal-window");
					//setTimeout(function(){
					alert("Sujeto añadido con éxito");
						elem_to_remove.parentNode.removeChild(elem_to_remove);
						//}, 1000)
				}else{
					alert(JSON.stringify(data));
				}
			}
			);
		}
	};
	var cancel_function=function(){
		var elem_to_remove=document.getElementById("js-modal-window");
		elem_to_remove.parentNode.removeChild(elem_to_remove);
	};	
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<label for="new-user">Usuario</label><input id="new-user" type="text" value="afan" /><br /> \
			<label for="new-alias">Alias</label><input id="new-alias" type="text" required="required" /><br /> \
			<label for="new-name">Nombre</label><input id="new-name" type="text" required="required" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label><input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  /><br /> \
			<label>Comentarios</label><textarea id="new-comments"></textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Añadir Participante",form_html,accept_function,cancel_function);
};


var explore_results=function(){
	preventBackExit();
	header_zone.innerHTML='<h1 onclick="menu_screen()"> < Conciencia Fonológica</h1>';
	session_data.subject=subjects_select_elem.options[subjects_select_elem.selectedIndex].value;
	canvas_zone.innerHTML=' \
	<div class="text-center">\
	<br /><h2>Resultados</h2> \
	<div id="results-div">cargando...</div> \
	<br /><br /><button id="go-back" onclick="menu_screen()">Volver</button> \
	</div>\
	';
	ajax_request_json(
		backend_url+'ajaxdb.php?action=get_results&user='+session_data.user+'&subject='+session_data.subject, 
		function(data) { 
			document.getElementById("results-div").innerHTML="user: "+data.general.user+" - subject: <b>"+data.general.subject+"</b><br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"></table>";
			results_table=document.getElementById("results-table");
			DataTableSimple.call(results_table, {
				data: data.elements,
				pagination: 5,
				columns: [
					//{ data: 'id' },
					{ data: 'timestamp', special: 'link_session_details' },
					{ data: 'type' },
					{ data: 'mode' },
					{ data: 'age' },
					{ data: 'duration',  format: 'time_from_seconds'}, 
					{ data: 'result', format: 'percentage_int' } 
				]
			} );
		});	
};

var explore_result_detail=function(session_id){
	preventBackExit();
	header_zone.innerHTML='<h1 onclick="menu_screen()"> < Conciencia Fonológica</h1>';
	canvas_zone.innerHTML=' \
	<div class="text-center">\
	<br /><h2>Resultado: '+session_id+'</h2> \
	<div id="results-div">cargando...</div> \
	<br /><br /><button id="go-back" onclick="explore_results()">Volver</button> \
	</div>\
	';
	ajax_request_json(
		backend_url+'ajaxdb.php?action=get_result_detail&session='+session_id, 
		function(data) { 
			document.getElementById("results-div").innerHTML="session: "+data.general.session+" - subject: "+data.elements[0].subject+"<br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"></table>";
			results_table=document.getElementById("results-table");
			DataTableSimple.call(results_table, {
				data: data.elements,
				pagination: 10,
				columns: [
					//{ data: 'id' },
					{ data: 'activity' },
					{ data: 'choice' },
					{ data: 'result' },
					{ data: 'duration',  format: 'time_from_seconds'}
				]
			} );
		});	
};


function game(){
	preventBackExit();
	header_zone.innerHTML='<h1 onclick="menu_screen()"> < Conciencia Fonológica</h1>';
	if(ResourceLoader.not_loaded['sounds'].length!=0){
		if(debug) console.log("Not loaded sounds: "+ResourceLoader.not_loaded['sounds'].length+"  "+ResourceLoader.not_loaded['sounds']);
		ResourceLoader.load_media_wait_for_lazy_audio(game);
	}else{
		// logic
		//random number within activity numbers of level1 (0 for now)
		//Fisher-Yates random at the beginning and then increment, or
		// do not rand array but just select a random position of the remaining array
		//

		// load audio in the object 
		var audio_sprite_object=media_objects.sounds['soundsSpriteVBR30-19kbps-100k.m4a'];
		audio_sprite_object.removeEventListener('canplaythrough', ResourceLoader.log_and_remove_from_not_loaded);
		audio_sprite=new AudioSprite(audio_sprite_object,audio_object_sprite_ref,debug);
		
		title_modal_window=open_js_modal_content('<h1>Nivel 1: '+session_data.mode+'</h1>');
		audio_sprite.playSpriteRange('zsilence_start',start_activity_set);
	}
}

function start_activity_set(){
	remove_modal();
	session_data.subject=subjects_select_elem.options[subjects_select_elem.selectedIndex].value;
	session_data.age=calculateAge(user_subjects[session_data.subject]); 
	var timestamp=new Date();
	session_data.timestamp=timestamp.getFullYear()+"-"+
		pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
		 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0");
	session_data.num_answered=0;

	canvas_zone.innerHTML=' \
		<div id="zone_score" class="cf">\
		  <div class="col_left">\
		    <div id="activity_timer_div">\
		      Tiempo : <span id="activity_timer_span">00:00:00</span>\
		    </div>\
		    <div id="current_score">\
		      Correct : <span id="current_score_num">0</span>\
		    </div>\
		  </div>\
		  <div class="col_right">\
		    <div id="remaining_activities">\
		      remaining activs : <span id="remaining_activities_num">0</span>\
		    </div>\
		    <div id="current_answered">\
		      Answered : <span id="current_answered_num">0</span>\
		    </div>\
		  </div>\
		  <div class="col_moves">\
		    <span id="moves"></span>\
		  </div>\
		</div> <!-- /#zone_score -->\
	<div id="answers"></div><br class="clear" />\
	<div id="sound">sound icon</div><br /> \
	';
	//get elements
	dom_score_correct=document.getElementById('current_score_num');
	dom_score_answered=document.getElementById('current_answered_num');
	activity_timer.anchor_to_dom(document.getElementById('activity_timer_span'));
	dom_score_answered.innerHTML=session_data.num_answered;
	if(session_data.mode=="training"){ 
		var start=Math.floor(Math.random()*(json_activities.length-(MAX_TRAINING_ACTIVITIES+1)));
		remaining_rand_activities=json_activities.slice(start,start+MAX_TRAINING_ACTIVITIES);
	}else{
		remaining_rand_activities=json_activities.slice();
	}
	document.getElementById('remaining_activities_num').innerHTML=""+(remaining_rand_activities.length-1);
	if(session_data.mode=="training"){
		activity(Math.floor(Math.random()*remaining_rand_activities.length));
	}else{
		activity(0);
	}
}

function activity(i){
	document.getElementById('remaining_activities_num').innerHTML=""+(remaining_rand_activities.length-1);

	activity_timer.reset();
	current_activity_index=i;
	current_activity_played_times=0;
	if(debug) console.log(i+"--"+remaining_rand_activities);
	current_activity_data=remaining_rand_activities[i]; //json_activities[i]
	correct_answer=current_activity_data['answers'][0];
	

	//TODO TODO TODO USAR IMAGENES EN VEZ DE DIVS CON FONDOS? I USAR -100% ETC.. SOLO DE UNA DIMENSION...
	// breakpoint a partir de widh menor q 500 usar img sprite small (e.g., 80x80px)??

	var answers_div=document.getElementById('answers');
	answers_div.innerHTML="";
	used_answers=[];
	for(var i=0; i<USE_ANSWERS ; ++i) {
		use=Math.floor(Math.random() * USE_ANSWERS)
		while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * USE_ANSWERS);
		//answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"></div>'
		var answer_i=current_activity_data['answers'][use];
		answers_div.innerHTML+='<div id="answer'+i+'" onclick="check_correct(this.firstChild,correct_answer)" class="hover_red_border"  ></div>'; //onclick="check_correct(this,correct_answer)"  style="float:left;" stretchy no-limit-250
		//if(media_objects.images[current_activity_data['answers'][use]+'.png']==undefined){
		if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+current_activity_data['answers'][use])){
			alert("ERROR: .wordimage-"+current_activity_data['answers'][use]+" not found in wordimg-sprite.css.");
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png'])
		}else{	
			////document.getElementById("answer"+i).appendChild(media_objects.images[current_activity_data['answers'][use]+'.png']);		
			////document.getElementById("answer"+i).className += " wordimage wordimage-"+current_activity_data['answers'][use];		
			document.getElementById("answer"+i).innerHTML += '<div class="wordimage wordimage-'+current_activity_data['answers'][use]+'"></div>';
			//document.getElementById("answer"+i).innerHTML += '<img class="spacer"  src="spacer158.png"><img class="spritev wordimg-'+current_activity_data['answers'][use]+'" src="../../../afan-app-media/img/wordimg-sprite.png" />';		
		}
		used_answers[used_answers.length]=use
	 }
	
	zone_sound=document.getElementById('sound');
	zone_sound.innerHTML='<button id="playb" class="button" onclick="play_activity_sound()">PLAY</button> <button id="go-back" onclick="menu_screen()">Salir</button>';
	/*setTimeout(function(){play_activity_sound();	}, 2000);*/
}

var play_activity_sound_finished=function(){
	activity_timer.start();
	current_activity_played_times++;
	if(current_activity_played_times < MAX_PLAYS){
		document.getElementById('playb').innerHTML="RE-PLAY"; // use icons (fixed % size) &#11208; &#11118; &#10704;
		document.getElementById('playb').disabled=false;
	}else{
		document.getElementById('playb').innerHTML="---"; // use empty icon (to keep size)
	}
};


var play_activity_sound=function(){
	document.getElementById('playb').disabled=true;
	activity_timer.stop();
	SoundChain.play_sound_arr(current_activity_data['sounds'],audio_sprite,play_activity_sound_finished);
};


function check_correct(clicked_answer,correct_answer){
	// do not allow cliking before or while uttering
	if(current_activity_played_times==0 || SoundChain.audio_chain_waiting) return; 
	var activity_results={};
	var timestamp=new Date();
	var timestamp_str=timestamp.getFullYear()+"-"+
		pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
		 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0") + 
			":"  + pad_string(timestamp.getSeconds(),2,"0");
	activity_timer.stop();
	activity_results.type=session_data.type;
	activity_results.mode=session_data.mode;
	activity_results.level=session_data.level;
	activity_results.activity=correct_answer;
	activity_results.timestamp=timestamp_str;
	activity_results.duration=activity_timer.seconds;
	session_data.duration+=activity_timer.seconds;
	if(typeof clicked_answer == "string"){ // it is not a sprite but an image
		image_src_start_exists=clicked_answer.lastIndexOf("/")
		if(image_src_start_exists==-1) image_src_start_exists=clicked_answer.indexOf("src=\"")
		if (image_src_start_exists > -1){
			img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
			clicked_answer=clicked_answer.substring(image_src_start_exists+1,img_src_end)
		}
	}else{
		clicked_answer=(clicked_answer.className.replace("wordimage wordimage-","")).trim();
	}


	activity_results.choice=clicked_answer;
	if (clicked_answer==correct_answer){
		session_data.num_correct++;
		activity_results.result="correct";
		if(session_data.mode!="test"){
			audio_sprite.playSpriteRange("zfx_correct");
			dom_score_correct.innerHTML=session_data.num_correct;
			open_js_modal_content('<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>');
		}
	}else{
		activity_results.result="incorrect";
		if(session_data.mode!="test"){
			audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
			open_js_modal_content('<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>');
		}
	}
	session_data.details.push(activity_results);
	session_data.num_answered++;
	dom_score_answered.innerHTML=session_data.num_answered;
	var waiting_time=500;
	if(session_data.mode!="test") waiting_time=2000; // fire next activity after 2 seconds (time for displaying img and playing the sound)
	setTimeout(function(){nextActivity()}, waiting_time);
}

function nextActivity(){
	remaining_rand_activities.splice(current_activity_index,1); // remove current activity
	if(session_data.mode!="test") remove_modal();
	if(remaining_rand_activities.length==0){
		canvas_zone.innerHTML='NO HAY MAS ACTIVIDADES. FIN, sending...';
		if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
		send_session_data();
	}else{
		if(remaining_rand_activities.length==1 || session_data.mode=="test"){
			activity(0);
		}else{
			activity(Math.floor(Math.random()*remaining_rand_activities.length));
		}
	}
}

function send_session_data(){
  if(debug) console.log(JSON.stringify(session_data));
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://www.centroafan.com/afan-app/www/"+backend_url+'ajaxdb.php',true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responsetype="json";
  xhr.send("action=send_session_data_post&json_string="+(JSON.stringify(session_data))); 

  xhr.onload = function () {
    var data=JSON.parse(this.responseText);
    canvas_zone.innerHTML+='<br />Server message: '+data.msg+'<br /><br />\
    <br /><button id="go-back" onclick="menu_screen()">Volver</button>';
  };

}


