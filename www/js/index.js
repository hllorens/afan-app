// data (will be ajax in the server in the future)
json_data={
	".comment": "The correct answer is always the first, the app rands them, the minimum number of answers is two, the maximum is unlimited",
	"activities": [
		{
			"type": "sounds",
			"sounds": ["k","a","s","a"],
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
			"sounds": ["s","a","s","a"],
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
*/
audio_sprite_object_ref={
"s": {id: "s25", start: 0.000, end: 0.250, loop: false},
"a": {id: "a30", start: 1.250, end: 1.552, loop: false}, 
"b": {id: "b", start: 2.552, end: 4.944, loop: false}, 
"k": {id: "k25", start: 5.944, end: 6.199, loop: false} 
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
	splash_screen()
});

function splash_screen(){
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	canvas_zone.innerHTML=' \
	<button onclick="game()">START</button><br /><img src="img/key.png" width="200px"/> \
	<br /> detectar si se està accediendo desde un navegador o desde la app para identificar al usuario con el num de movil o con la IP (por defecto se guardan estadísticas basadas en eso).  \
	'	
}



	


// Wait for PhoneGap to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    var element = document.getElementById('deviceProperties');

    element.innerHTML = 'Device Name: '     + device.name     + '<br />' + 
                        'Device PhoneGap: ' + device.phonegap + '<br />' + 
                        'Device Platform: ' + device.platform + '<br />' + 
                        'Device UUID: '     + device.uuid     + '<br />' + 
                        'Device Version: '  + device.version  + '<br />';
}




/*
BUT IT IS NOT COMPLETE...
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  onDeviceReady(); //this is the browser
}
*/
/*
function isPhoneGap() {
    return (cordova || PhoneGap || phonegap) 
    && /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

if ( isPhoneGap() ) {
    alert("Running on PhoneGap!");
} else {
    alert("Not running on PhoneGap!");
}
*/

/*
This should probably work perfectly because in a normal browser you won't get device.cordova at all...
Get the version of Cordova running on the device.
onDeviceReady...
var string = device.cordova;
device.name
device.platform
device.* should be NaN... 

See http://slavik.meltser.info/phonegap-detect-if-the-application-runs-on-mobile-or-browser-using-javascript-before-the-deviceready-and-document-ready-events-are-triggered/
*/

/*
var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
if ( app ) {
    // PhoneGap application
} else {
    // Web page
}
*/


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
	<ul> \
		<li id="answer0" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][0]+'</li>\
		<li id="answer1" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][1]+'</li>\
		<li id="answer2" onclick="check_correct(this.innerHTML,correct_answer)">'+current_activity_data['answers'][2]+'</li>\
	</ul>\
	</div>\
	'
	
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
	//alert(clicked_answer)
	if (clicked_answer==correct_answer){
		alert("correct!")
		correct++	
		score_correct.innerHTML=correct
	}else{
		alert("wrong!")
	}
	answered++
	score_answered.innerHTML=answered
	
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
    }
};





