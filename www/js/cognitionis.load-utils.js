
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
var not_loaded=[]
var ret_media={}
var is_iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false )
var download_ios_active = false
var user_language=window.navigator.userLanguage || window.navigator.language;

function get_resource_name(resource_url){
	resource_name=resource_url
	if(resource_name.indexOf('/')!=-1) resource_name=resource_name.substring(resource_name.lastIndexOf('/')+1)
	return resource_name
}

function load_image(resource_url){
	var image_object = new Image()
	image_object.addEventListener("load", function() {load_progressbar.value+=1;not_loaded.splice(not_loaded.indexOf(resource_url),1)},true)
	image_object.src = resource_url // after because load begins as soon as src is set
	return image_object
}

function load_sound(resource_url){
	var audio_object=new Audio() 
	if (!audio_object.canPlayType || audio_object.canPlayType("audio/mp4")==""){ 
		return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio or mp4/m4a")}}
	}
	audio_object.addEventListener('canplaythrough', function () {console.log("canplaythrough ("+resource_url+")");
		load_progressbar.value+=1;not_loaded.splice(not_loaded.indexOf(resource_url),1)});
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

function download_ios(){
		load_interval = setInterval(function() {check_load_status();}, media_load_check_status_interval)
		for(var i=0;i<not_loaded.length;i++){
			ret_media.sounds[get_resource_name(not_loaded[i])].load();
			//track.play();    setTimeout(function(){ track.pause();  },1); // extreme alternative if load() fails
		}	
}

function check_load_status() {
	media_load_time+=media_load_check_status_interval
	if (load_progressbar.value == load_progressbar.max || (load_progressbar.value==num_images && is_iOS)) {
		if(load_progressbar.value==num_images){
			if(!download_ios_active){	
				download_ios_active=true	
				clearInterval(load_interval);
				media_load_time=0
				var retry=document.createElement("div") // we can reuse the other div
				var ios_media_msg="Pula Ok para empezar"
				if(user_language=='en-US') ios_media_msg="Click Ok to start"
				retry.innerHTML=ios_media_msg+'<button onclick="download_ios()">Ok</button> '
				modal_load_window.appendChild(retry)
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
		for(var i=0;i<not_loaded.length;i++){
			var temp_obj
			if(not_loaded[i].match('\.(m4a|mp4|mp3|ogg)')) temp_obj=ret_media.sounds[get_resource_name(not_loaded[i])]
			else temp_obj=ret_media.images[get_resource_name(not_loaded[i])]			
			err_msg+="<br />"+temp_obj.error+  " - "+temp_obj.readyState+ " - "+temp_obj.networkState;
		}
		// re-try by a button to reload url, previously loaded stuff should be cached (fast load)
		retry.innerHTML='ERROR: Load media timeout. Not loaded ('+not_loaded.length+'): '+not_loaded+' <a href="">retry</a> '+err_msg
		modal_load_window.appendChild(retry)
	}
}



function load_media(image_arr, sound_arr, callback_function){
	ret_media={};ret_media.sounds=[];ret_media.images=[];
	callback_function_global=callback_function
	modal_load_window=document.createElement("div")
	modal_load_window.className="js-modal-window"
	var modal_dialog=document.createElement("div")
	load_progressbar=document.createElement("progress")
	num_images=image_arr.length; num_sounds=sound_arr.length
	load_progressbar.max=num_images+num_sounds; load_progressbar.value=0

	not_loaded=image_arr.concat(sound_arr) // to show in case of error
	download_ios_active = false

	modal_dialog.appendChild(load_progressbar)
	modal_load_window.appendChild(modal_dialog)
	document.body.appendChild(modal_load_window)
	
	load_interval = setInterval(function() {check_load_status();}, media_load_check_status_interval)
	for (var i = 0; i < sound_arr.length; i++) {ret_media.sounds[get_resource_name(sound_arr[i])]=load_sound(sound_arr[i])}
	for (var i = 0; i < image_arr.length; i++) {ret_media.images[get_resource_name(image_arr[i])]=load_image(image_arr[i])}
	return ret_media // even if objects are not loaded yet, they are created and will point to the loaded media
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





