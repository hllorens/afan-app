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
"http://www.centroafan.com/afan-app-media/img/words/ventana.png",
"http://www.centroafan.com/afan-app-media/img/correct.png",
"http://www.centroafan.com/afan-app-media/img/wrong.png"
]

var sounds = [
	//"http://www.centroafan.com/afan-app-media/audio/datasound.m4a",
	"http://www.centroafan.com/afan-app-media/audio/soundsSprite2.m4a"
]


// ACTIVITIES
json_activities=
[
{"type":"sounds","sounds":["s","o","l"],"level":"1","answers":["sol","col","sal","pez","tren"]},
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


audio_sprite_object_ref={
a: {id: "a50", start: 13.047, end: 13.547}, 
b: {id: "b50", start: 5.500, end: 5.996}, 
ch: {id: "ch50", start: 10.045, end: 10.547}, 
d: {id: "d50", start: 29.530, end: 30.032}, 
e: {id: "e50", start: 20.511, end: 21.012}, 
f: {id: "f50", start: 26.526, end: 27.029}, 
g: {id: "g50", start: 22.012, end: 22.509}, 
i: {id: "i50", start: 14.547, end: 15.010}, 
j: {id: "j50", start: 4.000, end: 4.500}, 
k: {id: "k50", start: 31.032, end: 31.533}, 
l: {id: "l50", start: 8.499, end: 9.045}, 
m: {id: "m50", start: 19.008, end: 19.511}, 
n: {id: "n50", start: 28.029, end: 28.530}, 
o: {id: "o50", start: 32.533, end: 33.038}, 
p: {id: "p50", start: 23.509, end: 23.998}, 
r: {id: "r50", start: 24.998, end: 25.526}, 
rr: {id: "rr50", start: 17.509, end: 18.008},
s: {id: "ss50", start: 16.010, end: 16.509}, 
ss: {id: "ss50", start: 16.010, end: 16.509}, 
t: {id: "t50", start: 1.000, end: 1.500},
u: {id: "u50", start: 2.500, end: 3.000}, 
z: {id: "z50", start: 11.547, end: 12.047}, 
zfx_correct: {id: "zfx_correct50", start: 6.996, end: 7.499}, 
zfx_wrong: {id: "zfx_wrong50", start: 34.038, end: 34.539},
}



// constants
var USE_ANSWERS = 3
var max_calls=500
AUDIO_RALENTIZATION_LAG=0.050

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
score_correct=$('#current_score_num')[0]
score_answered=$('#current_answered_num')[0]
activity_timer_element=document.getElementById('activity_timer_span')
define_timer_element(activity_timer_element)
audio_sprite_object=null //$('#audio_sprite_object')[0] //document.createElement('audio'); //$('#audio_tag')[0]
currentSpriteRange = {} // current sprite being played
audio_sprite_range_ended=true
audio_chain_waiting=false
audio_chain_position=0
sound_array=[]
num_correct_activities=0
num_answered_activities=0
current_activity_data={}
current_activity_index=0

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

function select_fill_with_json(json_activities,select_elem){
	// first empty the select...
	$.each(json_activities, function(key, val) {select_elem.append('<option value="' + key + '">' + key + '</option>')})
}

function splash_screen(){
	// load audio in the object 
	audio_sprite_object=media_objects.sounds['soundsSprite2.m4a']
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
	media_objects=load_media(images,sounds,splash_screen,true)
}


function game(){
	// check for lazy_audio load (required for iOS)
	if(not_loaded['sounds'].length!=0){ console.log(not_loaded['sounds'].length+"  "+not_loaded['sounds']); load_media_wait_for_lazy_audio(game)}
	else{
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
}

function activity(i){
	activity_timer_reset()
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
		if(media_objects.images[current_activity_data['answers'][use]+'.png']==undefined)
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png'])
		else document.getElementById("answer"+i).appendChild(media_objects.images[current_activity_data['answers'][use]+'.png']);
		
		
		//answers_html+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"><img src="'+media_url+'img/words/'+current_activity_data['answers'][use]+'.png" /></div>'		
		used_answers[used_answers.length]=use
	 }
	
	
	// count the time until the user clicks an answer		
	// reproduce the sounds one after the other and stop and button to replay
	zone_sound=$('#sound')[0]
	zone_sound.innerHTML="starting..."
	sound_array=current_activity_data['sounds']
	play_sound_arr()
	activity_timer_start()
}


// seeking, paused properties and seeking, seeked, pause events 

function play_sound_arr(){
	audio_chain_waiting=true; audio_chain_position=0
	play_sprite_chain()
}

function play_sprite_chain(){
	if(audio_chain_position>=sound_array.length){
		audio_chain_waiting=false
		audio_chain_position=0
		zone_sound.innerHTML='<button onclick="play_sound_arr(current_activity_data.sounds,0)">re-play</button>'
	}else{
		while (sound_array[audio_chain_position]=="/") {++audio_chain_position;} // ignore /	
		zone_sound.innerHTML="playing: "+audio_sprite_object.currentSrc+" time:"+audio_sprite_object.currentTime+" ended:"+audio_sprite_object.ended+" paused:"+audio_sprite_object.paused+" calls:"+calls+" id:"+sound_array[audio_chain_position]+" audio_chain_position:"+audio_chain_position+" audio_chain_waiting:"+audio_chain_waiting
		calls++
		playSpriteRange(sound_array[audio_chain_position])
	}
}

var audio_chain_callback = function () {
	if(audio_chain_waiting==true){
		audio_chain_position++	
		play_sprite_chain()		
	}
}

// time update handler to ensure we stop when a sprite is complete
var onTimeUpdate = function() {
    if (this.ended || (audio_sprite_range_ended==false && this.currentTime >= (currentSpriteRange.end+AUDIO_RALENTIZATION_LAG)) ) { // 0.25 margin.. also try to add silence at the beginning of the sprite 
    //currentSpriteRange.start + currentSpriteRange.length
        this.pause()
        audio_seeked_paused(this)
        this.currentTime=0 // I added this, fails because pause takes time.. we have to wait until we check it is really paused...
        audio_seeked_paused(this)
       	audio_sprite_range_ended=true
	if(audio_chain_waiting==true) audio_chain_callback()
	/*setTimeout(function(){audio_chain_callback()},500)*/
    }
};

var playSpriteRange = function(id) {
	if(audio_sprite_range_ended==false || !audio_sprite_object.paused) alert("trying to play a sprite range while other not ended")
	// pause audio
	//audio_sprite_object.pause()
	// wait until paused?	
	// reset?
	audio_sprite_object.currentTime = 0
        audio_seeked_paused(audio_sprite_object)
	
	if (audio_sprite_object_ref[id]) { // assumes the array is correct (contains start and end)
		currentSpriteRange = audio_sprite_object_ref[id]
		audio_sprite_object.currentTime = currentSpriteRange.start // not supported on IE9 (DOM Exception INVALID_STATE_ERR)
		audio_sprite_range_ended=false
		//audio_sprite_object.play();
		audio_play_safe(audio_sprite_object)
	}else{
		console.log("ERROR: Sprite "+id+" not found!")
		audio_sprite_range_ended=true
	}
};


function audio_play_safe(audio_object){
	// wait until paused and not seekeing
	if(audio_object.paused && !audio_object.seekeing) audio_object.play() 
	else setTimeout(function(){audio_play_safe(audio_object)},250)
	// more efficien could be trying to use events... but complicates things...
}

function audio_seeked_paused(audio_object){
	// wait until paused and not seekeing
	if(audio_object.paused && !audio_object.seekeing) return 
	else setTimeout(function(){audio_seeked_paused(audio_object)},250)
}






function check_correct(clicked_answer,correct_answer){
	if(audio_chain_waiting) return // do not allow cliking while uttering
	// pause activity_timer 
	activity_timer_stop()
	// pause audio
	audio_chain_waiting=false
	audio_sprite_object.pause()
	audio_sprite_object.currentTime = 0
	result_correct=false
	session_duration+=activity_timer_seconds // + activity_timer_minutes*60
	image_src_start_exists=clicked_answer.indexOf("src=\""+media_url)
	if (image_src_start_exists > -1){
		img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
		clicked_answer=clicked_answer.substring(image_src_start_exists+media_url.length+15,img_src_end)	// src="img/words/ -> 15 chars	
	}
	//alert(clicked_answer)
	if (clicked_answer==correct_answer){
		playSpriteRange("zfx_correct")
		//alert("correct!")// <br /><button onclick="nextActivity()">Next</button>
		canvas_zone.innerHTML='<div id="answer_result" style="width:100%;text-align:center"></div>'
		// <img src="'+media_url+'img/correct.png" width="180px"/>
		document.getElementById("answer_result").appendChild(media_objects.images['correct.png'])
		num_correct_activities++
		result_correct=true
		score_correct.innerHTML=num_correct_activities
	}else{
		playSpriteRange("zfx_wrong")	
		//alert("wrong!") //<br /><button onclick="nextActivity()">Next</button></div>
		canvas_zone.innerHTML='<div id="answer_result" style="width:100%;text-align:center"></div>'
		// <img src="'+media_url+'img/wrong.png" width="180px"/>
		document.getElementById("answer_result").appendChild(media_objects.images['wrong.png'])
	}
	num_answered_activities++
	score_answered.innerHTML=num_answered_activities
	// current_activity_data[current] get lenght and store like "number" : { activity-data}
	// send data (optinal, we can send it at the end...)
	
	// fire next activity after 2 seconds (time for displaying img and playing the sound)
	setTimeout(function(){nextActivity()}, 2000)
}

function nextActivity(){
	remaining_rand_activities.splice(current_activity_index,1) // remove current activity	
	if(remaining_rand_activities.length==0){	
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








