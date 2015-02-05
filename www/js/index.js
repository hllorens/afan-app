// data (will be ajax in the server in the future)
//".comment": "The correct answer is always the first, the app rands them, the minimum number of answers is two, the maximum is unlimited",

// MEDIA
var images = [
"http://www.centroafan.com/afan-app-media/img/words/abrigo.png",
"http://www.centroafan.com/afan-app-media/img/words/aceite.png",
"http://www.centroafan.com/afan-app-media/img/words/arbol.png",
"http://www.centroafan.com/afan-app-media/img/words/arco.png",
"http://www.centroafan.com/afan-app-media/img/words/avion.png",
"http://www.centroafan.com/afan-app-media/img/words/barco.png",
"http://www.centroafan.com/afan-app-media/img/words/bici.png",
"http://www.centroafan.com/afan-app-media/img/words/boca.png",
"http://www.centroafan.com/afan-app-media/img/words/brazo.png",
"http://www.centroafan.com/afan-app-media/img/words/cabra.png",
"http://www.centroafan.com/afan-app-media/img/words/cama.png",
"http://www.centroafan.com/afan-app-media/img/words/camara.png",
"http://www.centroafan.com/afan-app-media/img/words/caracol.png",
"http://www.centroafan.com/afan-app-media/img/words/carta.png",
"http://www.centroafan.com/afan-app-media/img/words/casa.png",
"http://www.centroafan.com/afan-app-media/img/words/col.png",
"http://www.centroafan.com/afan-app-media/img/words/comprar.png",
"http://www.centroafan.com/afan-app-media/img/words/copa.png",
"http://www.centroafan.com/afan-app-media/img/words/cortinas.png",
"http://www.centroafan.com/afan-app-media/img/words/cuatro.png",
"http://www.centroafan.com/afan-app-media/img/words/lampara.png",
"http://www.centroafan.com/afan-app-media/img/words/libros.png",
"http://www.centroafan.com/afan-app-media/img/words/mano.png",
"http://www.centroafan.com/afan-app-media/img/words/maracas.png",
"http://www.centroafan.com/afan-app-media/img/words/mesa.png",
"http://www.centroafan.com/afan-app-media/img/words/mono.png",
"http://www.centroafan.com/afan-app-media/img/words/murciélago.png",
"http://www.centroafan.com/afan-app-media/img/words/naranja.png",
"http://www.centroafan.com/afan-app-media/img/words/pantano.png",
"http://www.centroafan.com/afan-app-media/img/words/pato.png",
"http://www.centroafan.com/afan-app-media/img/words/pera.png",
"http://www.centroafan.com/afan-app-media/img/words/percha.png",
"http://www.centroafan.com/afan-app-media/img/words/pescado.png",
"http://www.centroafan.com/afan-app-media/img/words/piedra.png",
"http://www.centroafan.com/afan-app-media/img/words/pino.png",
"http://www.centroafan.com/afan-app-media/img/words/piña.png",
"http://www.centroafan.com/afan-app-media/img/words/plano.png",
"http://www.centroafan.com/afan-app-media/img/words/plato.png",
"http://www.centroafan.com/afan-app-media/img/words/pluma.png",
"http://www.centroafan.com/afan-app-media/img/words/plátano.png",
"http://www.centroafan.com/afan-app-media/img/words/puente.png",
"http://www.centroafan.com/afan-app-media/img/words/pájaro.png",
"http://www.centroafan.com/afan-app-media/img/words/queso.png",
"http://www.centroafan.com/afan-app-media/img/words/ratón.png",
"http://www.centroafan.com/afan-app-media/img/words/regadera.png",
"http://www.centroafan.com/afan-app-media/img/words/rojo.png",
"http://www.centroafan.com/afan-app-media/img/words/sal.png",
"http://www.centroafan.com/afan-app-media/img/words/sapo.png",
"http://www.centroafan.com/afan-app-media/img/words/seta.png",
"http://www.centroafan.com/afan-app-media/img/words/sol.png",
"http://www.centroafan.com/afan-app-media/img/words/sopa.png",
"http://www.centroafan.com/afan-app-media/img/words/tijeras.png",
"http://www.centroafan.com/afan-app-media/img/words/tostadora.png",
"http://www.centroafan.com/afan-app-media/img/words/tres.png",
"http://www.centroafan.com/afan-app-media/img/words/ventana.png"	
]

var sounds = [
	"http://www.centroafan.com/afan-app-media/audio/soundsSprite.m4a",
	"http://www.centroafan.com/afan-app-media/audio/datasound.m4a"
]


// ACTIVITIES
json_activities=



[
{"type":"sounds","sounds":["s","o","l"],"level":"1","answers":["sol","col","sal","pez","tren"]},
{"type":"sounds","sounds":["p","e","z"],"level":"1","answers":["pez","tren","sol","sal","col"]},
{"type":"sounds","sounds":["s","a","l"],"level":"1","answers":["sal","sol","col","pez","tren"]},
{"type":"sounds","sounds":["k","o","l"],"level":"1","answers":["col","sol","sal","pez","tren"]},
{"type":"sounds","sounds":["t","r","e","n"],"level":"1","answers":["tren","pez","sol","sal","col"]},
		{
			"type": "sounds",
			"sounds": ["k","a","ss","a"],
			"answers": [
				"casa",
				"carta",
				"cabra"
			],
			"level": "1"
		},
		{
			"type": "sounds",
			"sounds": ["k","a","r","t","a"],
			"answers": [
				"carta",
				"casa",
				"caracol"
			],
			"level": "1"
		},
		{
			"type": "sounds",
			"sounds": ["a","r","b","o","l"],
			"answers": [
				"arbol",
				"arco",
				"avion"
			],
			"level": "1"
		}	
	]



//media_url='https://dl.dropboxusercontent.com/u/188219/apps-media/afan-app/' // inside dropbox public...
// if these are found localy (e.g., search for a local folder called ... or a file xxx), Set the url locally
// Otherwise use cognitionis 
media_url='http://www.centroafan.com/afan-app-media/'
backend_url='http://www.centroafan.com/afan-app-backend/'

/*
"s": {id: "s25", start: 0.000, end: 0.250, loop: false}, 
"a": {id: "a30", start: 0.450, end: 0.752, loop: false}, 
"b": {id: "b", start: 0.952, end: 3.344, loop: false}, 
"k": {id: "k25", start: 3.544, end: 3.799, loop: false}, 
*/
audio_sprite_object_ref={
a: {id: "a50", start: 12.047, end: 12.547, loop: false}, 
b: {id: "b50", start: 4.500, end: 4.996, loop: false}, 
ch: {id: "ch50", start: 9.045, end: 9.547, loop: false}, 
d: {id: "d50", start: 28.530, end: 29.032, loop: false}, 
e: {id: "e50", start: 19.511, end: 20.012, loop: false}, 
f: {id: "f50", start: 25.526, end: 26.029, loop: false}, 
g: {id: "g50", start: 21.012, end: 21.509, loop: false}, 
i: {id: "i50", start: 13.547, end: 14.010, loop: false}, 
j: {id: "j50", start: 3.000, end: 3.500, loop: false}, 
k: {id: "k50", start: 30.032, end: 30.533, loop: false}, 
l: {id: "l50", start: 7.499, end: 8.045, loop: false}, 
m: {id: "m50", start: 18.008, end: 18.511, loop: false}, 
n: {id: "n50", start: 27.029, end: 27.530, loop: false}, 
o: {id: "o50", start: 31.533, end: 32.038, loop: false}, 
p: {id: "p50", start: 22.509, end: 22.998, loop: false}, 
r: {id: "r50", start: 23.998, end: 24.526, loop: false}, 
rr: {id: "rr50", start: 16.509, end: 17.008, loop: false}, 
ss: {id: "ss50", start: 15.010, end: 15.509, loop: false}, 
s: {id: "ss50", start: 15.010, end: 15.509, loop: false}, 
t: {id: "t50", start: 0.000, end: 0.500, loop: false}, 
u: {id: "u50", start: 1.500, end: 2.000, loop: false}, 
z: {id: "z50", start: 10.547, end: 11.047, loop: false}, 
zfx_correct: {id: "zfx_correct50", start: 5.996, end: 6.499, loop: false}, 
zfx_wrong: {id: "zfx_wrong50", start: 33.038, end: 33.539, loop: false}
}

// constants
var USE_ANSWERS = 3
var max_calls=500

// variables
var media_objects
session_user="afan"
session_subject="juan"
session_subject_age="5"
session_level="1"
calls=0
remaining_rand_activities=[] 
correct_answer='undefined'
current_activity_type='undefined' // to avoid loading all the html pattern but just changing the values
zone_sound=null
canvas_zone=$('#zone_canvas')[0]
var audio_sprite_object //$('#audio_sprite_object')[0] //document.createElement('audio'); //$('#audio_tag')[0]
score_correct=$('#current_score_num')[0]
score_answered=$('#current_answered_num')[0]
audio_ended=false
audio_chain_waiting=false
audio_sprite_position=0
sound_array=[]
num_correct_activities=0
num_answered_activities=0
current_activity_data={}
current_activity_index=0
timer_seconds=0
timer_started=false
timer_span=$('#timer_span')[0]
timer_timeout=null
session_duration=0
session_timestamp_str="0000-00-00 00:00"
subjects_select_elem="none"

// TODO HTML5 store results locally (JSON/Cache?) and communicate with DB with ajax (PHP see examples)
// See how to login and control session with javascript frontend... Use cookies (learn)
	
$(function () { // DOM ready
	/*$.getJSON("data.json", function(json_activities) {
	    console.log(json_activities); // this will show the info it in firebug console
	});*/
	//alert("there "+json_activities['activities'][0]['name'])
	is_app=is_cordova() // make this global to access whenever you want
	if(is_app){
	        document.addEventListener('deviceready', onDeviceReady, false);
	}else{
		onDeviceReady()
	}
});

function is_cordova(){
	if( navigator.userAgent.match(/(ios|iphone|ipod|ipad|android|blackberry|iemobile)/i)
		&& /^file:\/{3}[^\/]/i.test(window.location.href) ){	
		return true		
	}
	return false
}
//////////////////// FUNCTIONS TO BE STORED IN cognitionis_utils_general or for bigger stuff cognitionis_xxxx
function pad_string(val, digits, pad_char){
    var val_str = val + "", pad_str=""
    if(val_str.length < digits){
    	for(var i=digits-1;i>0;i--)pad_str+=pad_char
        return pad_str + val_str;
   }else
        return val_str;
}

function timer_start(){
	if(timer_started){
		console.log("ERROR: Timer already started")	
	}else{
		timer_reset()
		timer_started=true
		timer_timeout=setTimeout('timer_advance()',1000)		
	}
}

function timer_advance(){
	if(timer_started){
		++timer_seconds
		// seconds only is easier and calculations are fast...
		//if (timer_seconds>=60){	++timer_minutes;timer_seconds=0}
		//timer_span.innerHTML=pad_string(timer_minutes,2,"0")+":"+pad_string(timer_seconds,2,"0")
		timer_span.innerHTML="00:"+pad_string( (timer_seconds / 60) >> 0,2,"0")+":"+pad_string(timer_seconds % 60,2,"0")
		timer_timeout=setTimeout('timer_advance()',1000)
	}else{
		console.log("ERROR: Timer not started. Starting it.")
		timer_start()
	}
}

function timer_stop(){
	clearTimeout(timer_timeout)
	timer_started=false
}

function timer_reset(){
	timer_stop()
	timer_span.innerHTML="00:00:00"
	timer_seconds=0 // timer_minutes=0
}
///////////////////////////

function select_fill_with_json(json_activities,select_elem){
	// first empty the select...
	$.each(json_activities, function(key, val) {select_elem.append('<option value="' + key + '">' + key + '</option>')})
}

function splash_screen(){
	// load audio in the object 
	audio_sprite_object=media_objects.sounds['soundsSprite.m4a']
	audio_sprite_object.addEventListener('timeupdate', onTimeUpdate, false);

	console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info)
       // detectar si se està accediendo desde un navegador o desde la app para identificar al usuario con el num de movil o con la IP (por defecto se guardan estadísticas basadas en eso).
	canvas_zone.innerHTML=' \
	<br /><img src="'+media_url+'img/key.png" width="200px"/> \
	<br />  \
	<br />  \
	Selecciona el sujeto:<br />  \
	<select id="subjects-select"></select> \
	<button id="start-button" onclick="game()" disabled="true">EMPEZAR</button> \
	'
	subjects_select_elem=$("#subjects-select")
	$.getJSON(
		backend_url+'ajaxdb.php?action=get_subjects&user='+session_user, 
		function(data) { select_fill_with_json(data,subjects_select_elem); $("#start-button")[0].disabled=false; }
		);
	// TODO:  images sprite 
	// TODO: Select default user and subject
}


// Cordova or browser is ready
function onDeviceReady() {
	device_info="browser"
	if(is_app){
		device_info = 'name='     + device.name     + '-' + 
                        'PhoneGap=' + device.phonegap + '-' + 
                        'Platform=' + device.platform + '-' + 
                        'UUID='     + device.uuid     + '-' + 
                        'Ver='  + device.version
		
	}
	media_objects=load_media(images,sounds,splash_screen)
}


function game(){
	// logic
	//random number within activity numbers of level1 (0 for now)
	//Fisher-Yates random at the beginning and then increment, or
	// do not rand array but just select a random position of the remaining array
	//
	session_subject=subjects_select_elem[0].options[subjects_select_elem[0].selectedIndex].value
	var session_timestamp=new Date();
	session_timestamp_str=session_timestamp.getFullYear()+"-"+(session_timestamp.getMonth()+1) + "-" + session_timestamp.getDate() + " "
		 + session_timestamp.getHours() + ":"  + session_timestamp.getMinutes()
	// TODO calculate age of the subject ...
	// session_subject_age=... 
	remaining_rand_activities=json_activities
	$('#remaining_activities_num')[0].innerHTML=""+(remaining_rand_activities.length-1)	
        activity(Math.floor(Math.random()*remaining_rand_activities.length))
}

function activity(i){
	timer_reset()
	current_activity_index=i
	current_activity_data=json_activities[i]
	correct_answer=current_activity_data['answers'][0]
	
	// display the sounds and a select with 3 div buttons with the answers
	canvas_zone.innerHTML=' \
	<div id="sound">sound icon</div> \
	<div id="answers"></div>\
	'	
	//answers_html=""
	answers_div=document.getElementById('answers')
	used_answers=[];
	for(var i=0; i<USE_ANSWERS ; ++i) {
		use=Math.floor(Math.random() * USE_ANSWERS)
		while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * USE_ANSWERS);
		answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"></div>'
		if(media_objects.images[current_activity_data['answers'][use]+'.png']==undefined) alert("ERROR: "+current_activity_data['answers'][use]+'.png'+" NOT FOUND, MONTSE PASAM LES FOTOS")
		document.getElementById("answer"+i).appendChild(media_objects.images[current_activity_data['answers'][use]+'.png']);
		//answers_html+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"><img src="'+media_url+'img/words/'+current_activity_data['answers'][use]+'.png" /></div>'		
		used_answers[used_answers.length]=use
	 }
	
	
	// count the time until the user clicks an answer		
	// reproduce the sounds one after the other and stop and button to replay
	zone_sound=$('#sound')[0]
	zone_sound.innerHTML="starting..."
	sound_array=current_activity_data['sounds']
	play_sound_arr()
	timer_start()
}

function play_sound_arr(){
	audio_chain_waiting=true;
	play_sprite_chain()
}

function play_sprite_chain(){
	while (sound_array[audio_sprite_position]=="/") {++audio_sprite_position;} // ignore /	
	if(audio_sprite_position>=sound_array.length){
		zone_sound.innerHTML='<button onclick="play_sound_arr(current_activity_data.sounds,0)">re-play</button>'
		audio_sprite_position=0
		audio_chain_waiting=false
		return
	}else{
		zone_sound.innerHTML="playing: "+audio_sprite_object.currentSrc+" time:"+audio_sprite_object.currentTime+" ended:"+audio_sprite_object.ended+" calls:"+calls+" id:"+sound_array[audio_sprite_position]+" audio_sprite_position:"+audio_sprite_position+" audio_chain_waiting:"+audio_chain_waiting
		calls++
		playSprite(sound_array[audio_sprite_position])
	}
}

function check_correct(clicked_answer,correct_answer){
	timer_stop()
	result_correct=false
	session_duration+=timer_seconds // + timer_minutes*60
	image_src_start_exists=clicked_answer.indexOf("src=\""+media_url)
	if (image_src_start_exists > -1){
		img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
		clicked_answer=clicked_answer.substring(image_src_start_exists+media_url.length+15,img_src_end)	// src="img/words/ -> 15 chars	
	}
	//alert(clicked_answer)
	audio_chain_waiting=false
	if (clicked_answer==correct_answer){
		playSprite("zfx_correct")
		//alert("correct!")// <br /><button onclick="nextActivity()">Next</button>
		canvas_zone.innerHTML='<div style="width:100%;text-align:center"><img src="'+media_url+'img/correct.png" width="180px"/></div>'		
		num_correct_activities++
		result_correct=true
		score_correct.innerHTML=num_correct_activities
	}else{
		playSprite("zfx_wrong")	
		//alert("wrong!") //<br /><button onclick="nextActivity()">Next</button></div>
		canvas_zone.innerHTML='<div style="width:100%;text-align:center"><img src="'+media_url+'img/wrong.png" width="180px"/>'	
	}
	num_answered_activities++
	score_answered.innerHTML=num_answered_activities
	// current_activity_data[current] get lenght and store like "number" : { activity-data}
	// send data (optinal, we can send it at the end...)
	setTimeout(function(){nextActivity()}, 2000)
}

function nextActivity(){
	remaining_rand_activities.splice(current_activity_index,1) // remove current activity	
	if(remaining_rand_activities.length==0){	
		alert()	
		canvas_zone.innerHTML=' \
		NO HAY MAS ACTIVIDADES. FIN, '+ backend_url+'ajaxdb.php?action=send_session_data&user='+session_user+'&subject='+session_subject+'&age='+session_subject_age+'&num_answered='+num_answered_activities+'&num_correct='+num_correct_activities+'&level='+session_level +'&duration='+session_duration+'&timestamp='+session_timestamp_str +'\
		'
		// calculate result
		session_result=num_correct_activities/num_answered_activities
		send_session_data()
	}else{		
		$('#remaining_activities_num')[0].innerHTML=""+(remaining_rand_activities.length-1)	
		if(remaining_rand_activities.length==1){	
			remaining_rand_activities=[]
			activity(0)
		}else{
			activity(Math.floor(Math.random()*remaining_rand_activities.length))	
		}		
	}
}

function send_session_data(){
	//alert(backend_url+'ajaxdb.php?action=send_session_data&user='+session_user+'&subject='+session_subject+'&age='+session_subject_age+'&num_answered='+num_answered_activities+'&num_correct='+num_correct_activities+'&level='+session_level +'&duration='+session_duration+'&session_timestamp='+session_timestamp_str)
	msg=$.getJSON(
		backend_url+'ajaxdb.php?action=send_session_data&user='+session_user+'&subject='+session_subject+'&age='+session_subject_age+'&num_answered='+num_answered_activities+'&num_correct='+num_correct_activities+'&level='+session_level +'&duration='+session_duration+'&timestamp='+session_timestamp_str,
		function(data) { canvas_zone.innerHTML+='<br />Server message: '+data.msg; }
		);
		
	
}

// current sprite being played
var currentSprite = {};

var audio_chain_callback = function () {
	if(audio_chain_waiting==true){
		audio_sprite_position++	
		play_sprite_chain()		
	}
}

// time update handler to ensure we stop when a sprite is complete
var onTimeUpdate = function() {
    if (this.currentTime >= currentSprite.end) { //currentSprite.start + currentSprite.length
        this.pause()
        //this.currentTime=0 // I added this, fails because pause takes time.. we have to wait until we check it is really paused...
	audio_ended=true
	audio_chain_callback()
	/*setTimeout(function(){audio_chain_callback()},500)*/
    }
};

// in mobile Safari, the first time this is called will load the audio. Ideally, we'd load the audio file completely before doing this.
var playSprite = function(id) {
    if (audio_sprite_object_ref[id]) { // assumes the array is correct (contains start and end)
        currentSprite = audio_sprite_object_ref[id]
        audio_sprite_object.currentTime = currentSprite.start // not supported on IE9 (DOM Exception INVALID_STATE_ERR)
        audio_ended=false
        audio_sprite_object.play();
    }else{
    	console.log("Sprite "+id+" not found!")
    }
};





