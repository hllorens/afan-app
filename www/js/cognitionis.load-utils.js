
// audio types. Best choice: m4a (mp4)
var html5_audiotypes={ 
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"m4a": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}


// LOAD CONFIG
var MEDIA_LOAD_TIMEOUT=6000 			// 6 sec
var media_load_time=0 				// load time counter
var media_load_check_status_interval=250 	// check status every 0.25 sec
var load_progressbar
var modal_load_window

function get_resource_name(resource_url){
	resource_name=resource_url
	if(resource_name.indexOf('/')!=-1) resource_name=resource_name.substring(resource_name.lastIndexOf('/')+1)
	return resource_name
}

function load_image(resource_url){
	var image_object = new Image()
	image_object.addEventListener("load", function() {load_progressbar.value+=1},true)
	image_object.src = resource_url // after because load begins as soon as src is set
	return image_object
}

function load_sound(resource_url){
	var audio_object=new Audio() 
	if (!audio_object.canPlayType || audio_object.canPlayType("audio/mp4")==""){ 
		return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio or mp4/m4a")}}
	}
	audio_object.addEventListener('canplaythrough', function () {console.log("canplaythrough ("+resource_url+")");load_progressbar.value+=1});
	audio_object.src=resource_url
	audio_object.playclip=function(){
		try{
			console.log(audio_object.error+  " - "+audio_object.readyState+ " - "+audio_object.networkState)
			audio_object.pause(); audio_object.currentTime=0; audio_object.play()
		}catch(exception){alert("error")}
	}
	return audio_object
}

function check_load_status() {
	media_load_time+=media_load_check_status_interval
	if (load_progressbar.value == load_progressbar.max) {
		clearInterval(load_interval);//load_progressbar.parentNode.removeChild(load_progressbar);
		document.body.removeChild(modal_load_window)
		// start the app
		// sound_objects["datasound.m4a"].play() only works with Desktop/Laptop browsers (not mobile/tablet which need click/touch)
	}
	if (media_load_time==MEDIA_LOAD_TIMEOUT){
		clearInterval(load_interval);//load_progressbar.parentNode.removeChild(load_progressbar);
		alert("ERROR: Load media timeout")
	}
}



function load_media(image_arr, sound_arr){
	ret={};ret.sounds=[];ret.images=[];
	modal_load_window=document.createElement("div")
	modal_load_window.className="js-modal-window"
	var modal_dialog=document.createElement("div")
	load_progressbar=document.createElement("progress")
	load_progressbar.max=sounds.length+images.length; load_progressbar.value=0

	modal_dialog.appendChild(load_progressbar)
	modal_load_window.appendChild(modal_dialog)
	document.body.appendChild(modal_load_window)
	
	//document.body.appendChild(load_progressbar)
	load_interval = setInterval(function() {check_load_status();}, media_load_check_status_interval)
	for (var i = 0; i < sound_arr.length; i++) {ret.sounds[get_resource_name(sound_arr[i])]=load_sound(sound_arr[i])}
	for (var i = 0; i < image_arr.length; i++) {ret.images[get_resource_name(image_arr[i])]=load_image(image_arr[i])}
	return ret
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





