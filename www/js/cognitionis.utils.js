
// audio types. Best choice: m4a (mp4)
var html5_audiotypes={ 
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"m4a": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}


// LOAD CONFIG
var MEDIA_LOAD_TIMEOUT=10000 			// 10 sec
var media_load_time=0 				// load time counter
var media_load_check_status_interval=250 	// check status every 0.25 sec
var load_progressbar
var modal_load_window
var callback_function_global
var num_images=0
var num_sounds=0
var not_loaded={}
var ret_media={}
var lazy_audio=false
var download_lazy_audio_active = false

// USER DATA
var user_language=window.navigator.userLanguage || window.navigator.language;
var is_iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false )

// TIMER CONFIG
activity_timer_seconds=0
activity_timer_started=false
activity_timer_span='undefined'
activity_timer_timeout=null

function get_resource_name(resource_url){
	resource_name=resource_url
	if(resource_name.indexOf('/')!=-1) resource_name=resource_name.substring(resource_name.lastIndexOf('/')+1)
	return resource_name
}

function load_image(resource_url){
	var image_object = new Image()
	image_object.addEventListener("load", function() {load_progressbar.value+=1;not_loaded['images'].splice(not_loaded['images'].indexOf(resource_url),1)},true)
	image_object.src = resource_url // after because load begins as soon as src is set
	return image_object
}

function load_sound(resource_url){
	var audio_object=new Audio() 
	if (!audio_object.canPlayType || audio_object.canPlayType("audio/mp4")==""){ 
		return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio or mp4/m4a")}}
	}
	audio_object.addEventListener('canplaythrough', function () {console.log("canplaythrough ("+resource_url+")");
		load_progressbar.value+=1;not_loaded['sounds'].splice(not_loaded['sounds'].indexOf(resource_url),1)});
	//audio_object.preload='auto' or audio_object.load() doe not seem to help for iOS
	audio_object.src=resource_url
	audio_object.playclip=function(){
		try{
			console.log(audio_object.error+  " - "+audio_object.readyState+ " - "+audio_object.networkState)
			audio_object.pause(); audio_object.currentTime=0; audio_object.play()
		}catch(exception){alert("error")}
	}
	return audio_object
}

function download_audio_ios(){
		load_interval = setInterval(function() {check_load_status();}, media_load_check_status_interval)
		for(var i=0;i<not_loaded['sounds'].length;i++){
			ret_media.sounds[get_resource_name(not_loaded['sounds'][i])].load();
			//track.play();    setTimeout(function(){ track.pause();  },1); // extreme alternative if load() fails
		}	
}

function check_load_status() {
	console.log('check_load_status '+media_load_time)
	media_load_time+=media_load_check_status_interval
	if (load_progressbar.value == load_progressbar.max || (load_progressbar.value==num_images && not_loaded['images'].length==0 && is_iOS)) {
		if(load_progressbar.value==num_images){
			alert(iOS)	
			if(!lazy_audio && !download_lazy_audio_active){
				clearInterval(load_interval);
				download_lazy_audio_active=true	
				media_load_time=0
				var retry=document.createElement("div") // we can reuse the other div
				var ios_media_msg="Pula Ok para empezar"
				if(user_language=='en-US') ios_media_msg="Click Ok to start"
				retry.innerHTML=ios_media_msg+'<button onclick="download_audio_ios()">Ok</button> '
				modal_load_window.appendChild(retry)
			}
			if(lazy_audio){					
				clearInterval(load_interval);
				document.body.removeChild(modal_load_window)
				callback_function_global() // start the app				
			}
		}else{
			clearInterval(load_interval);
			document.body.removeChild(modal_load_window)
			callback_function_global() // start the app
		}
	}
	if (media_load_time==MEDIA_LOAD_TIMEOUT){
		clearInterval(load_interval);
		var retry=document.createElement("div") // we can reuse the other div
		var err_msg="";
		for(var i=0;i<not_loaded['images'].length;i++){
			temp_obj=ret_media.images[get_resource_name(not_loaded['images'][i])]			
			err_msg+="<br />Load complete?"+temp_obj.complete
		}
		for(var i=0;i<not_loaded['sounds'].length;i++){
			temp_obj=ret_media.images[get_resource_name(not_loaded['sounds'][i])]			
			err_msg+="<br />Error: "+temp_obj.error+  " - Ready: "+temp_obj.readyState+ " - Network: "+temp_obj.networkState;
		}		
		// re-try by a button to reload url, previously loaded stuff should be cached (fast load)
		retry.innerHTML='ERROR: Load media timeout. Not loaded ('+(not_loaded['images'].length+not_loaded['sounds'].length)+'): '+not_loaded['images']+'<br/>'+not_loaded['sounds']+' <br /> <a href="">retry</a> '+err_msg
		modal_load_window.appendChild(retry)
	}
}

function check_load_status_lazy_audio() {
	media_load_time+=media_load_check_status_interval
	if (load_progressbar.value == load_progressbar.max) {
		clearInterval(load_interval);
		document.body.removeChild(modal_load_window)
		callback_function_global() // start the app
	}
	if (media_load_time==MEDIA_LOAD_TIMEOUT){
		clearInterval(load_interval);
		var retry=document.createElement("div") // we can reuse the other div
		var err_msg="";
		for(var i=0;i<not_loaded['sounds'].length;i++){
			temp_obj=ret_media.images[get_resource_name(not_loaded['sounds'][i])]			
			err_msg+="<br />Error: "+temp_obj.error+  " - Ready: "+temp_obj.readyState+ " - Network: "+temp_obj.networkState;
		}		
		// re-try by a button to reload url, previously loaded stuff should be cached (fast load)
		retry.innerHTML='ERROR: Load media timeout. Not loaded ('+not_loaded['sounds'].length+'): '+not_loaded['sounds']+' <br /> <a href="">retry</a> '+err_msg
		modal_load_window.appendChild(retry)
	}
}


function load_media(image_arr, sound_arr, callback_function, lazy_audio){
	if(lazy_audio==='undefined') lazy_audio=false
	ret_media={};ret_media.sounds=[];ret_media.images=[];
	callback_function_global=callback_function
	modal_load_window=document.createElement("div")
	modal_load_window.className="js-modal-window"
	var modal_dialog=document.createElement("div")
	load_progressbar=document.createElement("progress")
	num_images=image_arr.length; num_sounds=sound_arr.length
	load_progressbar.value=0; load_progressbar.max=num_images+num_sounds

	not_loaded['images']=image_arr;	not_loaded['sounds']=sound_arr // to show in case of error and lazy load (required in iOS)
	download_lazy_audio_active = false

	modal_dialog.appendChild(load_progressbar)
	modal_load_window.appendChild(modal_dialog)
	document.body.appendChild(modal_load_window)
	
	load_interval = setInterval(function() {check_load_status();}, media_load_check_status_interval)
	for (var i = 0; i < sound_arr.length; i++) {ret_media.sounds[get_resource_name(sound_arr[i])]=load_sound(sound_arr[i])}
	for (var i = 0; i < image_arr.length; i++) {ret_media.images[get_resource_name(image_arr[i])]=load_image(image_arr[i])}
	return ret_media // even if objects are not loaded yet, they are created and will point to the loaded media
}

function load_media_wait_for_lazy_audio(callback_function){
	callback_function_global=callback_function
	modal_load_window=document.createElement("div")
	modal_load_window.className="js-modal-window"
	var modal_dialog=document.createElement("div")
	load_progressbar=document.createElement("progress")
	num_images=0; num_sounds=not_loaded['sounds'].length
	load_progressbar.value=0; load_progressbar.max=num_images+num_sounds

	modal_dialog.appendChild(load_progressbar)
	modal_load_window.appendChild(modal_dialog)
	document.body.appendChild(modal_load_window)
	
	load_interval = setInterval(function() {check_load_status_lazy_audio();}, media_load_check_status_interval)
	for(var i=0;i<not_loaded['sounds'].length;i++)	ret_media.sounds[get_resource_name(not_loaded['sounds'][i])].load()
}









// MODAL WINDOWS
function open_js_modal(){  //(title_text, text_text){
	var modal_window=document.createElement("div")
	modal_window.id="js-modal-window"; modal_window.className="js-modal-window"
	 document.getElementById("myBtn").style.top="100px";

	var modal_dialog=document.createElement("div")
	var close_elem=document.createElement('a')
	close_elem.innerHTML="x"
	close_elem.href="javascript:void(0)"
	close_elem.onclick=function (){
		var elem_to_remove=document.getElementById("js-modal-window")
		elem_to_remove.parentNode.removeChild(elem_to_remove)
	}

	var title_elem=document.createElement('h2')
	title_elem.innerHTML="aaa" //title_text

	var text_elem=document.createElement('p')
	text_elem.innerHTML="bbb" //text_text

	modal_dialog.appendChild(close_elem)
	modal_dialog.appendChild(title_elem)
	modal_dialog.appendChild(text_elem)

	modal_window.appendChild(modal_dialog)
	document.body.appendChild(modal_window)
}


// STRING UTILS ///////////////////////////////////
function pad_string(val, digits, pad_char){
    var val_str = val + "", pad_str=""
    if(val_str.length < digits){
    	for(var i=digits-1;i>0;i--)pad_str+=pad_char
        return pad_str + val_str;
   }else
        return val_str;
}


//////////////////// TIMER FOR A USER ACTIVITY OF ANY KIND ////////////// 

function define_timer_element(elem){
	activity_timer_span=elem //$('#activity_timer_span')[0]	
}


function activity_timer_start(){
	if(activity_timer_span=='undefined'){alert("ERROR: Starging a timer without defining it first")}

	if(activity_timer_started){
		console.log("ERROR: activity_timer already started")	
	}else{
		activity_timer_reset()
		activity_timer_started=true
		activity_timer_timeout=setTimeout('activity_timer_advance()',1000)		
	}
}

function activity_timer_advance(){
	if(activity_timer_started){
		++activity_timer_seconds
		// seconds only is easier and calculations are fast...
		//if (activity_timer_seconds>=60){	++activity_timer_minutes;activity_timer_seconds=0}
		//activity_timer_span.innerHTML=pad_string(activity_timer_minutes,2,"0")+":"+pad_string(activity_timer_seconds,2,"0")
		activity_timer_span.innerHTML="00:"+pad_string( (activity_timer_seconds / 60) >> 0,2,"0")+":"+pad_string(activity_timer_seconds % 60,2,"0")
		activity_timer_timeout=setTimeout('activity_timer_advance()',1000)
	}else{
		console.log("ERROR: activity_timer not started. Starting it.")
		activity_timer_start()
	}
}

function activity_timer_stop(){
	clearTimeout(activity_timer_timeout)
	activity_timer_started=false
}

function activity_timer_reset(){
	activity_timer_stop()
	activity_timer_span.innerHTML="00:00:00"
	activity_timer_seconds=0 // activity_timer_minutes=0
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



