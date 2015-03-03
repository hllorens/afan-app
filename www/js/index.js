
// data (will be ajax in the server in the future)
//".comment": "The correct answer is always the first, the app rands them, the minimum number of answers is two, the maximum is unlimited",

// MEDIA
var images = [
//"http://www.centroafan.com/afan-app-media/img/words/abrigo.png",
"../../afan-app-media/img/wordimg-sprite.png",
"../../afan-app-media/img/key.png",
"../../afan-app-media/img/correct.png",
"../../afan-app-media/img/wrong.png"
]

var sounds = [
	// si es online se puede usar dropbox https://dl.dropboxusercontent.com/u/188219/
	//"http://www.centroafan.com/afan-app-media/audio/soundsSpriteVBR30-19kbps-93k.m4a"
	"../../afan-app-media/audio/soundsSpriteVBR30-19kbps-93k.m4a"
]


// ACTIVITIES
var json_activities;
var json_test;
var json_training;
$.getJSON("../data/test1.tsv.json", function(json) {
    console.log(json)
    json_test=json; 
});
$.getJSON("../data/training1.json", function(json) {
    console.log(json)
    json_training=json; 
});
json_activities=json_training;


// if these are found localy (e.g., search for a local folder called ... or a file xxx), Set the url locally
// Otherwise use cognitionis 
media_url='http://www.centroafan.com/afan-app-media/'
//backend_url='http://www.centroafan.com/afan-app-backend/'
backend_url='backend/' //../backend


audio_sprite_object_ref={
//falta grabar
ll: {id: "i50", start: 8.499, end: 9.045}, 
y: {id: "i50", start: 8.499, end: 9.045}, 
ny: {id: "n50", start: 28.029, end: 28.530}, 
bv: {id: "b50", start: 5.500, end: 5.996}, 
//-------------
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

activity_timer=new ActivityTimer()
activity_timer.anchor_to_dom(activity_timer_element)

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
game_type='training'

session_duration=0
session_timestamp_str="0000-00-00 00:00"
subjects_select_elem="none"

var exit_app=function(){
		if(is_app){
			navigator.app.exitApp();
		}else{
			 window.location = "http://www.centroafan.com";
		}
}


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
	console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info)
	console.log('not_loaded sounds: '+not_loaded['sounds'].length)
	canvas_zone.innerHTML=' \
	<br />\
	<div id="splash-content" class="text-center">\
	<div id="splash-logo-div"></div> \
	<br />  \
	Selecciona el sujeto:<br />  \
	<select id="subjects-select"></select> \
	<br />Falta gestionar sesión/login, si es la app \
	<br />o la web usar cookies para no pedir user-pass cada vez \
	<br /><button id="start-button" disabled="true">Practicar</button> \
	<br /><button id="start-test-button" disabled="true">Test</button> \
	<br /><button id="add-subject" disabled="true">Añadir Niño</button> \
	<br /><button id="results" disabled="true" onclick="explore_results()">Resultados</button> \
	<br /><br /><button id="exit" onclick="exit_app()">Salir</button> \
	</div>\
	'


	//document.getElementById("splash-logo-div").appendChild(media_objects.images['key.png'])
	subjects_select_elem=$("#subjects-select")
		var accept_function=function(){		
			$.getJSON(
			backend_url+'ajaxdb.php?action=add_subject&user='+$('#new-user').val()+'&alias='+$('#new-alias').val()+'&name='+$('#new-name').val()+'&birthdate='+$('#new-birthdate').val()+'&comments='+$('#new-comments').val(), 
			function(data) {
				if(data['success']!='undefined'){
					subjects_select_elem.append('<option value="' + data['success'] + '">' + data['success'] + '</option>')
				}	
				var elem_to_remove=document.getElementById("js-modal-window");
				elem_to_remove.parentNode.removeChild(elem_to_remove);
			}
			);
			};
	$.getJSON(
		backend_url+'ajaxdb.php?action=get_subjects&user='+session_user, 
		function(data) {
			select_fill_with_json(data,subjects_select_elem); 
			$("#start-button")[0].disabled=false; 
			$("#start-test-button")[0].disabled=false;
			$("#add-subject")[0].disabled=false;
			$("#results")[0].disabled=false;
			// MAL pq no se puede modificar el evento... lo que hay q hacer es un objeto game y prototiparlo
			$("#start-button")[0].onclick=function(){game_type="training";json_activities=json_training;game()};
			$("#start-test-button")[0].onclick=function(){game_type="test";json_activities=json_test;game()};
			$("#add-subject")[0].onclick=function(){
				var cancel_function=function(){
					var elem_to_remove=document.getElementById("js-modal-window");
					elem_to_remove.parentNode.removeChild(elem_to_remove);
				};	
				form_html='<form id="my-form"> \
						<label>Usuario</label><input id="new-user" type="text" value="afan" /><br /> \
						<label>Alias</label><input id="new-alias" type="text" value="" /><br /> \
						<label>Nombre</label><input id="new-name" type="text" value="" /><br /> \
						<label>Fecha Nac. (yyyy-mm-dd)</label><input id="new-birthdate" type="date" value="yyyy-mm-dd" /><br /> \
						<label>Comentarios</label><textarea id="new-comments"></textarea><br /> \
						</form>';
				open_js_modal_alert("Añadir Niño",form_html,accept_function,cancel_function)
			};
		});
		
		
		
}

var explore_results=function(){
	canvas_zone.innerHTML=' \
	<div class="text-center">\
	<br /><div id="user-results">resultados para user...</div> \
	<div id="results-div">aquí los resultados</div> \
	<br /><br /><button id="go-back" onclick="splash_screen()">Volver</button> \
	</div>\
	';
	session_subject=subjects_select_elem[0].options[subjects_select_elem[0].selectedIndex].value;
	$.getJSON(
		backend_url+'ajaxdb.php?action=get_results&user='+session_user+'&subject='+session_subject, 
		function(data) { 
			$("#results-div")[0].innerHTML="<pre>"+JSON.stringify(data,null,2)+"</pre>";
		});	
};



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

		// load audio in the object 
		audio_sprite_object=media_objects.sounds['soundsSpriteVBR30-19kbps-93k.m4a']
		
		audio_sprite_object.removeEventListener('timeupdate', onTimeUpdate, false); // for safety
		audio_sprite_object.addEventListener('timeupdate', onTimeUpdate, false);

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
	activity_timer.reset()
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
		//answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"></div>'
		var answer_i=current_activity_data['answers'][use];
		answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border"  style="float:left;"></div>'; //onclick="check_correct(this,correct_answer)"
		//if(media_objects.images[current_activity_data['answers'][use]+'.png']==undefined){
		if(!selectorInCSS("wordimg-sprite.css",".wordimage-"+current_activity_data['answers'][use])){
			
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png'])
		}else{	
			//document.getElementById("answer"+i).appendChild(media_objects.images[current_activity_data['answers'][use]+'.png']);		
			//document.getElementById("answer"+i).className += " wordimage wordimage-"+current_activity_data['answers'][use];		
			document.getElementById("answer"+i).innerHTML += "<div onclick=\"check_correct(this,correct_answer)\" class=\"wordimage wordimage-"+current_activity_data['answers'][use]+"\"></div>";		
		}
		used_answers[used_answers.length]=use
	 }
	
	zone_sound=$('#sound')[0]
	zone_sound.innerHTML="starting..."
	sound_array=current_activity_data['sounds']
	play_sound_arr()
	activity_timer.start()
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
		console.log("id ("+id+") found")
		currentSpriteRange = audio_sprite_object_ref[id]
		audio_sprite_object.currentTime = currentSpriteRange.start // not supported on IE9 (DOM Exception INVALID_STATE_ERR)
		audio_sprite_range_ended=false
		audio_play_safe(audio_sprite_object, currentSpriteRange.start)
	}else{
		console.log("ERROR: Sprite ("+id+") not found!")
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
	activity_timer.stop()
	audio_chain_waiting=false
	audio_sprite_object.pause()
	audio_sprite_object.currentTime = 0
	session_duration+=activity_timer.seconds
	//image_src_start_exists=clicked_answer.indexOf("src=\""+media_url)
	if(typeof clicked_answer == "string"){ // it is not a sprite but an image
		image_src_start_exists=clicked_answer.lastIndexOf("/")
		if(image_src_start_exists==-1) image_src_start_exists=clicked_answer.indexOf("src=\"")
		if (image_src_start_exists > -1){
			img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
			//clicked_answer=clicked_answer.substring(image_src_start_exists+media_url.length+15,img_src_end)
			clicked_answer=clicked_answer.substring(image_src_start_exists+1,img_src_end)
		}
	}else{
		clicked_answer=(clicked_answer.className.replace("wordimage wordimage-","")).trim();
	}
	canvas_zone.innerHTML='<div id="answer_result" style="width:100%;text-align:center"></div>'
	if (clicked_answer==correct_answer){
		num_correct_activities++
		if(game_type!="test"){
			playSpriteRange("zfx_correct")
			document.getElementById("answer_result").appendChild(media_objects.images['correct.png'])
			score_correct.innerHTML=num_correct_activities
		}
	}else{
		if(game_type!="test"){
			playSpriteRange("zfx_wrong",function(){console.log('wrong already played')})	
			document.getElementById("answer_result").appendChild(media_objects.images['wrong.png'])
		}
	}
	num_answered_activities++
	score_answered.innerHTML=num_answered_activities
	setTimeout(function(){nextActivity()}, 2000) // fire next activity after 2 seconds (time for displaying img and playing the sound)
}

function nextActivity(){
	remaining_rand_activities.splice(current_activity_index,1) // remove current activity	
	if(remaining_rand_activities.length==0){	
		canvas_zone.innerHTML=' \
		NO HAY MAS ACTIVIDADES. FIN, '+ backend_url+'ajaxdb.php?action=send_session_data&user='+session_user+'&subject='+session_subject+'&reference='+game_type+'&age='+session_subject_age+'&num_answered='+num_answered_activities+'&num_correct='+num_correct_activities+'&level='+session_level +'&duration='+session_duration+'&timestamp='+session_timestamp_str +'\
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
	
	// TODO USE "REFERENCE" TO DECIDE WHICH TEST IS THIS...
	
	msg=$.getJSON(
		backend_url+'ajaxdb.php?action=send_session_data&user='+session_user+'&subject='+session_subject+'&reference='+game_type+'&age='+session_subject_age+'&num_answered='+num_answered_activities+'&num_correct='+num_correct_activities+'&level='+session_level +'&duration='+session_duration+'&timestamp='+session_timestamp_str,
		function(data) { canvas_zone.innerHTML+='<br />Server message: '+data.msg+'<br /><br /><button id="go-back" onclick="splash_screen()">Volver</button>'; }
		);
		
	
}


