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
"http://www.centroafan.com/afan-app-media/img/key.png",
"http://www.centroafan.com/afan-app-media/img/correct.png",
"http://www.centroafan.com/afan-app-media/img/wrong.png"
]

var sounds = [
	//TODO Probar sin el path absoluto... solo relativo ../afan-app-media/audio/...
	// si es online se puede usar dropbox https://dl.dropboxusercontent.com/u/188219/
	"http://www.centroafan.com/afan-app-media/audio/soundsSpriteVBR30-19kbps-93k.m4a"
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
zsilence_start: {id: "zsilence_start", start: 0.100, end: 0.700}
}



// constants
var USE_ANSWERS = 3
var max_calls=500
AUDIO_RALENTIZATION_LAG=0.050
FLOAT_THRESHOLD=0.005

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
	is_app=is_cordova()
       // detectar si se està accediendo desde un navegador o desde la app para identificar al usuario con el num de movil o con la IP (por defecto se guardan estadísticas basadas en eso).
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


function splash_screen(){
	// load audio in the object 
	audio_sprite_object=media_objects.sounds['soundsSpriteVBR30-19kbps-93k.m4a']
	audio_sprite_object.addEventListener('timeupdate', onTimeUpdate, false);
	console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info)
	canvas_zone.innerHTML=' \
	<br /><div id="splash-logo-div"></div> \
	not_loaded: '+not_loaded['sounds'].length+'<br />  \
	<br />  \
	Selecciona el sujeto:<br />  \
	<select id="subjects-select"></select> \
	<button id="start-button" onclick="game()" disabled="true">EMPEZAR</button> \
	'
	document.getElementById("splash-logo-div").appendChild(media_objects.images['key.png'])
	subjects_select_elem=$("#subjects-select")
	$.getJSON(
		backend_url+'ajaxdb.php?action=get_subjects&user='+session_user, 
		function(data) { select_fill_with_json(data,subjects_select_elem); $("#start-button")[0].disabled=false; }
		);
	// TODO:  images sprite 
	// TODO: Select default user and subject
}




function game(){
	if(not_loaded['sounds'].length!=0){	
		console.log(not_loaded['sounds'].length+"  "+not_loaded['sounds']);
		load_media_wait_for_lazy_audio(game)
	}else{
		// logic
		//random number within activity numbers of level1 (0 for now)
		//Fisher-Yates random at the beginning and then increment, or
		// do not rand array but just select a random position of the remaining array
		//
		audio_sprite_object.removeEventListener('canplaythrough', log_and_remove_from_not_loaded)		
		title_modal_window=open_js_modal_title("Nivel 1")
		playSpriteRange('zsilence_start',start_activity_set)		
	}
}

function start_activity_set(){
	document.body.removeChild(title_modal_window)
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
	activity_timer_reset()
	current_activity_index=i
	current_activity_data=json_activities[i]
	correct_answer=current_activity_data['answers'][0]
	
	canvas_zone.innerHTML=' \
	<div id="sound">sound icon</div> \
	<div id="answers"></div>\
	'	
	answers_div=document.getElementById('answers')
	used_answers=[];
	for(var i=0; i<USE_ANSWERS ; ++i) {
		use=Math.floor(Math.random() * USE_ANSWERS)
		while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * USE_ANSWERS);
		answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"></div>'
		if(media_objects.images[current_activity_data['answers'][use]+'.png']==undefined)
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png'])
		else document.getElementById("answer"+i).appendChild(media_objects.images[current_activity_data['answers'][use]+'.png']);		
		used_answers[used_answers.length]=use
	 }
	
	zone_sound=$('#sound')[0]
	zone_sound.innerHTML="starting..."
	sound_array=current_activity_data['sounds']
	play_sound_arr()
	activity_timer_start()
}


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
		playSpriteRange(sound_array[audio_chain_position],audio_chain_callback)
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
   console.log("playing: "+audio_sprite_object.currentSrc+" time:"+audio_sprite_object.currentTime+" ended:"+audio_sprite_object.ended)

    if (this.ended || (!audio_sprite_range_ended && this.currentTime >= (currentSpriteRange.end+AUDIO_RALENTIZATION_LAG)) ) { 
    	console.log("Sprite range play ended!!")
        this.pause()
        audio_seeked_paused(this)
        this.currentTime=0 // probably unnecessary
        audio_seeked_paused(this)
       	audio_sprite_range_ended=true
	if(this.hasOwnProperty("callback_on_end") && typeof(this.callback_on_end) === 'function' ) this.callback_on_end()
    }
};

var playSpriteRange = function(id,callback_function) {
	if(audio_sprite_range_ended==false || !audio_sprite_object.paused) alert("trying to play a sprite range while other not ended")
	if(callback_function==='undefined') delete audio_sprite_object.callback_on_end
	else audio_sprite_object.callback_on_end=callback_function
	
	audio_sprite_object.currentTime = 0
        audio_seeked_paused(audio_sprite_object)
	
	if (audio_sprite_object_ref[id]) { // assumes the array is correct (contains start and end)
		console.log("id found")
		currentSpriteRange = audio_sprite_object_ref[id]
		audio_sprite_object.currentTime = currentSpriteRange.start // not supported on IE9 (DOM Exception INVALID_STATE_ERR)
		audio_sprite_range_ended=false
		audio_play_safe(audio_sprite_object, currentSpriteRange.start)
	}else{
		console.log("ERROR: Sprite "+id+" not found!")
		audio_sprite_range_ended=true
	}
};


function audio_play_safe(audio_object, seek_position){
	// wait until paused and not seekeing
	if(audio_object.paused && !audio_object.seekeing && Math.abs(audio_object.currentTime-seek_position)<FLOAT_THRESHOLD) audio_object.play() 
	else setTimeout(function(){console.log("waiting to play safe ct:"+audio_object.currentTime+" - seek: "+seek_position);audio_play_safe(audio_object,seek_position)},250)
	// more efficien could be trying to use events... but complicates things...
}

function audio_seeked_paused(audio_object){
	// wait until paused and not seekeing
	if(audio_object.paused && !audio_object.seekeing) return 
	else setTimeout(function(){audio_seeked_paused(audio_object)},250)
}




function check_correct(clicked_answer,correct_answer){
	if(audio_chain_waiting) return // do not allow cliking while uttering
	activity_timer_stop()
	audio_chain_waiting=false
	audio_sprite_object.pause()
	audio_sprite_object.currentTime = 0
	result_correct=false
	session_duration+=activity_timer_seconds // + activity_timer_minutes*60
	image_src_start_exists=clicked_answer.indexOf("src=\""+media_url)
	if (image_src_start_exists > -1){
		img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
		clicked_answer=clicked_answer.substring(image_src_start_exists+media_url.length+15,img_src_end)
	}
	if (clicked_answer==correct_answer){
		playSpriteRange("zfx_correct")
		canvas_zone.innerHTML='<div id="answer_result" style="width:100%;text-align:center"></div>'
		document.getElementById("answer_result").appendChild(media_objects.images['correct.png'])
		num_correct_activities++
		result_correct=true
		score_correct.innerHTML=num_correct_activities
	}else{
		playSpriteRange("zfx_wrong",function(){console.log('wrong already played')})	
		canvas_zone.innerHTML='<div id="answer_result" style="width:100%;text-align:center"></div>'
		document.getElementById("answer_result").appendChild(media_objects.images['wrong.png'])
	}
	num_answered_activities++
	score_answered.innerHTML=num_answered_activities
	setTimeout(function(){nextActivity()}, 2000) // fire next activity after 2 seconds (time for displaying img and playing the sound)
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


