// data (will be ajax in the server in the future)
json_data={
	".comment": "The correct answer is always the first, the app rands them, the minimum number of answers is two, the maximum is unlimited",
	"activities": [
		{
			"type": "sounds",
			"sounds": ["k","a","ss","a"],
			"answers": [
				"casa",
				"caza",
				"cana",
				"cala"
			],
			"level": "1"
		},
		{
			"type": "sounds",
			"sounds": ["k","a","k","a"],
			"answers": [
				"caca",
				"capa",
				"cata",
				"caba",
				"casa"
			],
			"level": "1"
		},
		{
			"type": "sounds",
			"sounds": ["ss","a","ss","a"],
			"answers": [
				"sasa",
				"capa",
				"cata",
				"caba",
				"casa"
			],
			"level": "1"
		}	
	]

}

/*
"s": {id: "s25", start: 0.000, end: 0.250, loop: false}, 
"a": {id: "a30", start: 0.450, end: 0.752, loop: false}, 
"b": {id: "b", start: 0.952, end: 3.344, loop: false}, 
"k": {id: "k25", start: 3.544, end: 3.799, loop: false}, 
"s": {id: "s25", start: 0.000, end: 0.250, loop: false},
"a": {id: "a30", start: 1.250, end: 1.552, loop: false}, 
"b": {id: "b", start: 2.552, end: 4.944, loop: false}, 
"k": {id: "k25", start: 5.944, end: 6.199, loop: false} 

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
calls=0
remaining_rand_activities=[] 
correct_answer='undefined'
current_activity_type='undefined' // to avoid loading all the html pattern but just changing the values
zone_sound=null
canvas_zone=$('#zone_canvas')[0];
audio_sprite_object = $('#audio_sprite_object')[0] //document.createElement('audio'); //$('#audio_tag')[0]
score_correct=$('#current_score_num')[0]
score_answered=$('#current_answered_num')[0]
audio_ended=false
audio_chain_waiting=false
audio_sprite_position=0
sound_array=[]
correct=0
answered=0
canvas_zone=$('#zone_canvas')[0];
current_activity_data={}
current_activity_index=0
	
$(function () { // DOM ready
	/*$.getJSON("data.json", function(json_data) {
	    console.log(json_data); // this will show the info it in firebug console
	});*/
	//alert("there "+json_data['activities'][0]['name'])
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

function splash_screen(){
	canvas_zone.innerHTML=' \
	<button onclick="game()">START</button><br /><img src="img/key.png" width="200px"/> \
	<br /> userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info+'\
	<br /> detectar si se està accediendo desde un navegador o desde la app para identificar al usuario con el num de movil o con la IP (por defecto se guardan estadísticas basadas en eso).  \
	'	
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
	splash_screen()
}


function game(){
	// logic
	//random number within activity numbers of level1 (0 for now)
	//Fisher-Yates random at the beginning and then increment, or
	// do not rand array but just select a random position of the remaining array
	//
	remaining_rand_activities=json_data['activities']
	$('#remaining_activities_num')[0].innerHTML=""+(remaining_rand_activities.length-1)	
        activity(Math.floor(Math.random()*remaining_rand_activities.length))
}

function activity(i){
	current_activity_index=i
	current_activity_data=json_data['activities'][i]
	correct_answer=current_activity_data['answers'][0]
	
	// display the sounds and a select with 3 div buttons with the answers

	canvas_zone.innerHTML=' \
	<div id="sound">sound icon</div> \
	<div id="answers"> \
	<div id="answer0" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"><img src="img/words/'+current_activity_data['answers'][0]+'.png" /></div>\
	<div id="answer1" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"><img src="img/words/'+current_activity_data['answers'][1]+'.png" /></div>\
	<div id="answer2" onclick="check_correct(this.innerHTML,correct_answer)" style="float:left;"><img src="img/words/'+current_activity_data['answers'][2]+'.png" /></div>\
	</div>\
	'
/*	<ul> \
		<li id="answer0" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][0]+'</li>\
		<li id="answer1" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][1]+'</li>\
		<li id="answer2" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][2]+'</li>\
	</ul>\
*/
	
	// count the time until the user clicks an answer	
	
	// reproduce the sounds one after the other and stop and button to replay
	zone_sound=$('#sound')[0]
	zone_sound.innerHTML="starting..."
	sound_array=current_activity_data['sounds']
	play_sound_arr();	
}

function play_sound_arr(){
	audio_chain_waiting=true;
	play_sprite_chain()
}

function play_sprite_chain(){
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
	image_src_start_exists=clicked_answer.indexOf("src=\"")
	if (image_src_start_exists > -1){
		img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
		clicked_answer=clicked_answer.substring(image_src_start_exists+15,img_src_end)	// src="img/words/ -> 15 chars	
	}
	//alert(clicked_answer)
	audio_chain_waiting=false
	if (clicked_answer==correct_answer){
		playSprite("zfx_correct")
		//alert("correct!")
		canvas_zone.innerHTML='<div style="width:100%;text-align:center"><img src="img/correct.png" width="180px"/><br /><button onclick="nextActivity()">Next</button></div>'		
		correct++	
		score_correct.innerHTML=correct
	}else{
		playSprite("zfx_wrong")	
		//alert("wrong!")
		canvas_zone.innerHTML='<div style="width:100%;text-align:center"><img src="img/wrong.png" width="180px"/><br /><button onclick="nextActivity()">Next</button></div>'		
	}
	answered++
	score_answered.innerHTML=answered
}

function nextActivity(){
	remaining_rand_activities.splice(current_activity_index,1) // remove current activity	
	if(remaining_rand_activities.length==0){
	canvas_zone.innerHTML=' \
	NO HAY MAS ACTIVIDADES. FIN\
	'	
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
audio_sprite_object.addEventListener('timeupdate', onTimeUpdate, false); // VER... SI EL FALSE ES UN CALLBACK APLICAR (CHECK_IF_CHAIN_WAITING)

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





