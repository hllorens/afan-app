
// USER DATA
var user_language=window.navigator.userLanguage || window.navigator.language;
var is_iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false )
function is_cordova(){
	if( navigator.userAgent.match(/(i(os|phone|pod|pad|emobile)|android|blackberry)/i)
		&& /^file:\/{3}[^\/]/i.test(window.location.href) ){	
		return true		
	}
	return false
}

// Audio types. Best choice: m4a (mp4)
var html5_audiotypes={"mp3": "audio/mpeg","mp4": "audio/mp4","m4a": "audio/mp4",
					  "ogg": "audio/ogg","wav": "audio/wav" };


var ResourceLoader={
	MEDIA_LOAD_TIMEOUT:15000, 		// 15 sec
	media_load_time:0,			// load time counter
	media_load_check_status_interval:250, 	// check status every 0.25 sec
	load_progressbar: undefined,
	load_interval: undefined,
	modal_load_window: undefined,
	modal_dialog: undefined,
	modal_dialog_msg: undefined,
	callback_on_load_end: undefined,
	num_images:0,
	num_sounds:0,
	not_loaded:{},
	ret_media:{},
	lazy_audio:false,
	download_lazy_audio_active : false,
	
	load_image: function (resource_url){
		var image_object = new Image();
		image_object.addEventListener("load", ResourceLoader.log_and_remove_from_not_loaded('load','images',resource_url));
		image_object.src = resource_url; // after because load begins as soon as src is set
		return image_object;
	},
	
	load_sound: function (resource_url){
		var audio_object=new Audio() 
		if (!audio_object.canPlayType || audio_object.canPlayType("audio/mp4")==""){ 
			return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio or mp4/m4a")}}
		}
		audio_object.addEventListener('canplaythrough', ResourceLoader.log_and_remove_from_not_loaded('canplaythrough','sounds',resource_url));
		audio_object.src=resource_url;
		audio_object.playclip=function(){
			try{
				console.log(audio_object.error+  " - "+audio_object.readyState+ " - "+audio_object.networkState);
				audio_object.pause(); audio_object.currentTime=0; audio_object.play();
			}catch(exception){alert("error playing audio")}
		}
		return audio_object;
	},	

	log_and_remove_from_not_loaded: function(event_name,res_type,res_url){
		console.log(event_name+" ("+res_type+": "+res_url+")");
		ResourceLoader.load_progressbar.value+=1;
		ResourceLoader.not_loaded[res_type].splice(ResourceLoader.not_loaded[res_type].indexOf(res_url),1);
	},


	download_audio_ios: function(){
		this.modal_load_window.removeChild(document.getElementById('confirm_div'))
		this.load_interval = setInterval(function() {	
			ResourceLoader.check_load_status()},
			this.media_load_check_status_interval);
		for(var i=0;i<ResourceLoader.not_loaded['sounds'].length;i++){
			ResourceLoader.ret_media.sounds[get_resource_name(ResourceLoader.not_loaded['sounds'][i])].load(); // play()-pause() with 1ms timeout extreme alternative
		}	
	},

	check_load_status: function() {
		ResourceLoader.media_load_time+=ResourceLoader.media_load_check_status_interval;
		ResourceLoader.modal_dialog_msg.innerHTML='check_load_status '+ResourceLoader.media_load_time+' - progress: '+ResourceLoader.load_progressbar.value+' - max: '+ResourceLoader.load_progressbar.max
		if (ResourceLoader.load_progressbar.value == ResourceLoader.load_progressbar.max || ( ResourceLoader.load_progressbar.value==ResourceLoader.num_images && ResourceLoader.not_loaded['images'].length==0 && is_iOS )  ) {
			if(ResourceLoader.load_progressbar.value==ResourceLoader.num_images){
				if(!ResourceLoader.lazy_audio && !ResourceLoader.download_lazy_audio_active){
					clearInterval(ResourceLoader.load_interval)
					ResourceLoader.download_lazy_audio_active=true;
					ResourceLoader.media_load_time=0;
					var confirm_div=document.createElement("div") // we can reuse the other div
					confirm_div.id="confirm_div"
					var ios_media_msg="Pula Ok para empezar"
					if(user_language=='en-US') ios_media_msg="Click Ok to start"
					confirm_div.innerHTML=ios_media_msg+' <button onclick="download_audio_ios()">Ok</button> '
					ResourceLoader.modal_load_window.appendChild(confirm_div)
				}
				if(ResourceLoader.lazy_audio){		
					clearInterval(ResourceLoader.load_interval);
					document.body.removeChild(ResourceLoader.modal_load_window);
					ResourceLoader.callback_on_load_end(); // start the app	
					return;
				}
			}else{
				clearInterval(ResourceLoader.load_interval)
				document.body.removeChild(ResourceLoader.modal_load_window)
				ResourceLoader.callback_on_load_end() // start the app
				return
			}
		}
		if (ResourceLoader.media_load_time==ResourceLoader.MEDIA_LOAD_TIMEOUT){
			clearInterval(ResourceLoader.load_interval);
			var retry_div=document.createElement("div") // we can reuse the other div
			var err_msg="";
			for(var i=0;i<ResourceLoader.not_loaded['images'].length;i++){
				temp_obj=ResourceLoader.ret_media.images[get_resource_name(ResourceLoader.not_loaded['images'][i])]			
				err_msg+="<br />Load complete?"+temp_obj.complete
			}
			for(var i=0;i<ResourceLoader.not_loaded['sounds'].length;i++){
				temp_obj=ResourceLoader.ret_media.sounds[get_resource_name(ResourceLoader.not_loaded['sounds'][i])]			
				err_msg+="<br />Error: "+temp_obj.error+  " - Ready: "+temp_obj.readyState+ " - Network: "+temp_obj.networkState;
			}		
			// re-try by a button to reload url, previously loaded stuff should be cached (fast load)
			retry_div.innerHTML='ERROR: Load media timeout. Not loaded ('+(ResourceLoader.not_loaded['images'].length+ResourceLoader.not_loaded['sounds'].length)+'): '+ResourceLoader.not_loaded['images']+'<br/>'+ResourceLoader.not_loaded['sounds']+' <br /> <a href="">retry</a> '+err_msg
			ResourceLoader.modal_load_window.appendChild(retry_div)
		}
	},

	check_load_status_lazy_audio: function () {
		ResourceLoader.media_load_time+=ResourceLoader.media_load_check_status_interval;
		ResourceLoader.modal_dialog_msg.innerHTML='check_load_status '+ResourceLoader.media_load_time+' - progress: '+ResourceLoader.load_progressbar.value+' - max: '+ResourceLoader.load_progressbar.max;
		if (ResourceLoader.load_progressbar.value == ResourceLoader.load_progressbar.max) {	//alert("done")	
			document.body.removeChild(ResourceLoader.modal_load_window);
			clearInterval(ResourceLoader.load_interval);
			setTimeout(function(){ResourceLoader.callback_on_load_end()},500); // start the app
			return;
		}
		else if (ResourceLoader.media_load_time==ResourceLoader.MEDIA_LOAD_TIMEOUT){
			clearInterval(ResourceLoader.load_interval);
			var retry_div=document.createElement("div"); // we can reuse the other div
			var err_msg="";
			// re-try by a button to reload url, previously loaded stuff should be cached (fast load)
			retry_div.innerHTML='ERROR: Load lazy aduio timeout. Not loaded ('+ResourceLoader.not_loaded['sounds'].length+') <br /> <a href="">retry</a> '+err_msg;
			ResourceLoader.modal_load_window.appendChild(retry_div);
		}
	},

	load_media: function (image_arr, sound_arr, callback_function, lazy_audio_option){
		if(lazy_audio_option==='undefined') ResourceLoader.lazy_audio=false;
		else ResourceLoader.lazy_audio=lazy_audio_option;
		ResourceLoader.ret_media={};ResourceLoader.ret_media.sounds=[];ResourceLoader.ret_media.images=[];
		ResourceLoader.callback_on_load_end=callback_function;
		ResourceLoader.modal_load_window=document.createElement("div");
		ResourceLoader.modal_load_window.className="js-modal-window";
		ResourceLoader.modal_dialog=document.createElement("div");
		ResourceLoader.modal_dialog.id="modal-dialog";
		ResourceLoader.modal_dialog_msg=document.createElement("p");
		ResourceLoader.modal_dialog_msg.id="modal-dialog-msg";
		ResourceLoader.load_progressbar=document.createElement("progress");
		ResourceLoader.num_images=image_arr.length;
		ResourceLoader.num_sounds=sound_arr.length;
		ResourceLoader.load_progressbar.value=0; ResourceLoader.load_progressbar.max=ResourceLoader.num_images+ResourceLoader.num_sounds;

		ResourceLoader.not_loaded['images']= image_arr.slice();	
		ResourceLoader.not_loaded['sounds']=sound_arr.slice(); // to show in case of error and lazy load (required in iOS)
		ResourceLoader.download_lazy_audio_active = false;

		ResourceLoader.modal_dialog.appendChild(ResourceLoader.load_progressbar)
		ResourceLoader.modal_dialog.appendChild(ResourceLoader.modal_dialog_msg)
		ResourceLoader.modal_load_window.appendChild(ResourceLoader.modal_dialog)
		document.body.appendChild(ResourceLoader.modal_load_window)
	
		ResourceLoader.load_interval = setInterval(function() {	
			ResourceLoader.check_load_status()},
			ResourceLoader.media_load_check_status_interval);
		for (var i = 0; i < sound_arr.length; i++) {	
			ResourceLoader.ret_media.sounds[get_resource_name(sound_arr[i])]=ResourceLoader.load_sound(sound_arr[i]);
		}
		for (var i = 0; i < image_arr.length; i++) {
			//console.log(image_arr);console.log(i+"/"+image_arr.length+"--"+image_arr[i]+" -- "+get_resource_name(image_arr[i]));	
			ResourceLoader.ret_media.images[get_resource_name(image_arr[i])]=ResourceLoader.load_image(image_arr[i]);
		}
		return ResourceLoader.ret_media; // even if objects are not loaded yet, they are created and will point to the loaded media
	},

	load_media_wait_for_lazy_audio: function(callback_function){
		ResourceLoader.callback_on_load_end=callback_function;
		ResourceLoader.modal_load_window=document.createElement("div")
		ResourceLoader.modal_load_window.className="js-modal-window"
		ResourceLoader.modal_dialog=document.createElement("div")
		ResourceLoader.modal_dialog.id="modal-dialog"
		ResourceLoader.modal_dialog_msg=document.createElement("p")
		ResourceLoader.modal_dialog_msg.id="modal-dialog-msg"
		ResourceLoader.load_progressbar=document.createElement("progress")
		ResourceLoader.num_images=0; ResourceLoader.num_sounds=not_loaded['sounds'].length
		ResourceLoader.load_progressbar.value=0; ResourceLoader.load_progressbar.max=ResourceLoader.num_images+ResourceLoader.num_sounds;

		ResourceLoader.modal_dialog.appendChild(ResourceLoader.load_progressbar);
		ResourceLoader.modal_dialog.appendChild(ResourceLoader.modal_dialog_msg);
		ResourceLoader.modal_load_window.appendChild(ResourceLoader.modal_dialog);
		document.body.appendChild(ResourceLoader.modal_load_window);
	
		for(var i=0;i<ResourceLoader.not_loaded['sounds'].length;i++)
			ResourceLoader.ret_media.sounds[get_resource_name(ResourceLoader.not_loaded['sounds'][i])].load();
		ResourceLoader.load_interval = setInterval(function() {
			ResourceLoader.check_load_status_lazy_audio()}, 
			ResourceLoader.media_load_check_status_interval);
	}

	
};













// MODAL WINDOWS
function open_js_modal_alert_demo(){  //(title_text, text_text){
	var modal_window=document.createElement("div")
	modal_window.id="js-modal-window"; modal_window.className="js-modal-window"

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


function open_js_modal_alert(title_text, text_text, accept_function, cancel_function){
	var modal_window=document.createElement("div")
	modal_window.id="js-modal-window"; modal_window.className="js-modal-window"

	var modal_dialog=document.createElement("div")
	var close_elem=document.createElement('a')
	close_elem.innerHTML="x"
	close_elem.href="javascript:void(0)"
	close_elem.onclick=function (){
		var elem_to_remove=document.getElementById("js-modal-window");
		elem_to_remove.parentNode.removeChild(elem_to_remove);
	}

	var title_elem=document.createElement('h2')
	title_elem.innerHTML=title_text

	var text_elem=document.createElement('p')
	text_elem.innerHTML=text_text


	modal_dialog.appendChild(close_elem)
	modal_dialog.appendChild(title_elem)
	modal_dialog.appendChild(text_elem)

	if(accept_function!=='undefined'){
		var accept_button=document.createElement('button')
		accept_button.innerHTML='Aceptar'	
		accept_button.onclick=accept_function	
		modal_dialog.appendChild(accept_button)
	}

	if(cancel_function!=='undefined'){
		var cancel_button=document.createElement('button')
		cancel_button.innerHTML='Cancelar'		
		cancel_button.onclick=cancel_function	
		modal_dialog.appendChild(cancel_button)
	}


	modal_window.appendChild(modal_dialog)
	document.body.appendChild(modal_window)
}



function open_js_modal_title(title_text){  
	var modal_window=document.createElement("div")
	modal_window.id="js-modal-window"; modal_window.className="js-modal-window"

	var modal_title=document.createElement("h1")
	modal_title.style.color="#FFF"
	modal_title.innerHTML=title_text

	modal_window.appendChild(modal_title)
	document.body.appendChild(modal_window)
	return modal_window
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

function get_resource_name(resource_url){
	if(resource_url.indexOf('/')!=-1) return resource_url.substring(resource_url.lastIndexOf('/')+1);
	return resource_url;
}

function isNumber(value) {
    if ((undefined === value) || (null === value)) return false;
    if (typeof value == 'number')  return true;
    return !isNaN(value - 0);
}
function isInteger(value) {     // in the future javacript will have Number.isInteger, etc
    if ((undefined === value) || (null === value))  return false;
    return value % 1 == 0;     // or   return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
}


//////////////////// TIMER FOR A USER ACTIVITY OF ANY KIND ////////////// 
var ActivityTimer=function (){	
	this.seconds=0
	this.started=false
	this.dom_anchor='undefined'
	this.advance_timeout=null
	//var that=this // bad hack to store reference scopes
}
ActivityTimer.prototype.anchor_to_dom=function(elem){this.dom_anchor=elem}

ActivityTimer.prototype.start=function(){
	if(this.dom_anchor=='undefined'){alert("ERROR: Starging an activity_timer without defining it first"); return}

	if(this.started){
		console.log("ERROR: activity_timer already started")	
	}else{
		this.started=true
		this.dom_anchor.innerHTML="00:"+pad_string( (this.seconds / 60) >> 0,2,"0")+":"+pad_string(this.seconds % 60,2,"0")
		this.advance_timeout=setTimeout(function(){this.advance()}.bind(this),1000)
	}
}

ActivityTimer.prototype.advance=function(){
	if(this.started){
		++this.seconds
		// seconds only is easier and calculations are fast...
		//if (this.seconds>=60){++this.minutes;this.seconds=0}
		//this.dom_anchor.innerHTML=pad_string(activity_timer_minutes,2,"0")+":"+pad_string(this.seconds,2,"0")
		this.dom_anchor.innerHTML="00:"+pad_string( (this.seconds / 60) >> 0,2,"0")+":"+pad_string(this.seconds % 60,2,"0")
		this.advance_timeout=setTimeout(function(){this.advance()}.bind(this),1000)
	}else{
		console.log("ERROR: activity_timer not started. Starting it.")
		this.start()
	}
}

ActivityTimer.prototype.stop=function(){
	clearTimeout(this.advance_timeout)
	this.started=false
}

ActivityTimer.prototype.reset=function (){	
	this.stop()
	this.dom_anchor.innerHTML="00:00:00"
	this.seconds=0 // this.minutes=0
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/// Audio Sprite //////////////////////
var AudioSprite=function(audio_object, sprite_ref, activate_debug){
	this.audio_obj=audio_object; 	// either created in js or got from DOM
	this.sound_range_ref=sprite_ref;	// index of sounds in sprite (as ranges)
	this.currentSpriteRange = {}; 	// current sprite being played
	this.range_ended=true;
	this.audio_obj.removeEventListener('timeupdate', this.onAudioSpriteTimeUpdate, false); // for safety
	this.audio_obj.addEventListener('timeupdate', this.onAudioSpriteTimeUpdate.bind(this), false);	
	this.debug=false;
	if(typeof(debug)!=='undefined') debug=activate_debug;
}
AudioSprite.FLOAT_THRESHOLD=0.005;	// for millisec comparison
AudioSprite.AUDIO_RALENTIZATION_LAG=0.040; // margin for sound range ended check
AudioSprite.prototype.playSpriteRange = function(range_id,callback_function) {
	if(this.range_ended==false || !this.audio_obj.paused) alert("ERROR: trying to play a sprite range while other not ended");
	if(callback_function==='undefined') delete this.audio_obj.callback_on_end;
	else this.audio_obj.callback_on_end=callback_function;
	this.audio_obj.currentTime = 0;
        this.wait_seeked_and_paused();
	if (this.sound_range_ref[range_id]) { // assumes the array is correct (contains start and end)
		if(this.debug) console.log("range_id ("+range_id+") found")
		this.currentSpriteRange = this.sound_range_ref[range_id]
		this.audio_obj.currentTime = this.currentSpriteRange.start // currentTime not supported on IE9 (DOM Exception INVALID_STATE_ERR)
		this.range_ended=false
		this.play_safe(this.currentSpriteRange.start)
	}else{
		if(this.debug) console.log("ERROR: Sprite ("+range_id+") not found!")
		this.range_ended=true
	}
};
AudioSprite.prototype.play_safe=function(seek_position){ // wait until paused and not seekeing
	if(this.audio_obj.paused && !this.audio_obj.seekeing && 
		Math.abs(this.audio_obj.currentTime-seek_position)<AudioSprite.FLOAT_THRESHOLD) this.audio_obj.play() 
	else setTimeout(function(){ // more efficien could be trying to use events... but complicates things...
				if(this.debug) console.log("waiting to play safe ct:"+this.audio_obj.currentTime+" - seek: "+seek_position);
				this.play_safe(seek_position)
			}.bind(this),250);
}
AudioSprite.prototype.wait_seeked_and_paused=function(){// wait until paused and not seekeing
	if(this.audio_obj.paused && !this.audio_obj.seekeing) return 
	else setTimeout(function(){
				this.wait_seeked_and_paused();
			}.bind(this),250)
}
AudioSprite.prototype.onAudioSpriteTimeUpdate = function() {// time update handler to ensure we stop when a sprite is complete
   if(this.debug)console.log("playing: "+this.audio_obj.currentSrc+" time:"+audio_obj.currentTime+" ended:"+audio_obj.ended)
    if (this.ended || (!this.range_ended && this.audio_obj.currentTime >= (this.currentSpriteRange.end+AudioSprite.AUDIO_RALENTIZATION_LAG)) ) { 
    	if(this.debug) console.log("Sprite range play ended!!")
        this.audio_obj.pause()
        this.wait_seeked_and_paused()
        this.currentTime=0 // probably unnecessary
        this.wait_seeked_and_paused()
       	this.range_ended=true
	if(this.audio_obj.hasOwnProperty("callback_on_end") && typeof(this.audio_obj.callback_on_end) === 'function' ) this.audio_obj.callback_on_end();
    }
};


///////////////////////////////////////


////////////////////////////////////////////////
var SoundChain={
	// initial initialization
	audio_chain_waiting: false,
	audio_chain_position: 0,
	calls: 0,
	sound_array: undefined,
	audio_sprite: undefined,

	play_sound_arr: function(sound_arr, audio_sprt, callback_func){
		if(this.audio_chain_waiting==true){
			throw new Error("SoundChain.play_sound_arr is already playing");
		}else if(sound_arr==='undefined' || audio_sprt==='undefined' || callback_func==='undefined'){
			throw new Error("SoundChain.play_sound_arr required arguments: sound_arr, audio_sprite, callback_function");
			//TODO why does not this halt???
		}else{
			
			console.log(callback_func +"---"+(callback_func==='undefined'));	
			this.sound_array=sound_arr;
			this.audio_sprite=audio_sprt;
			this.audio_chain_waiting=true;
			this.audio_chain_position=0;
			this.play_sprite_chain();
		}
	},

	play_sprite_chain: function(){
		if(this.audio_chain_position>=this.sound_array.length){
			this.sound_array=undefined;	
			this.audio_chain_waiting=false;
			this.audio_chain_position=0;
			this.calls=0;
			// TODO use callback instead of this
			zone_sound.innerHTML='<button onclick="SoundChain.play_sound_arr(current_activity_data.sounds,audio_sprite)">re-play</button>'
		}else{
			while (this.sound_array[this.audio_chain_position]=="/") {this.audio_chain_position++;} // ignore /	
			// TODO if this debug... and optinal argument (DOM elem) to show status
			console.log("playing: "+this.audio_sprite.audio_obj.currentSrc+" time:"+this.audio_sprite.audio_obj.currentTime+" ended:"+this.audio_sprite.audio_obj.ended+" paused:"+this.audio_sprite.audio_obj.paused+" calls:"+this.calls+" range_id:"+this.sound_array[this.audio_chain_position]+" audio_chain_position:"+this.audio_chain_position+" audio_chain_waiting:"+this.audio_chain_waiting);
			this.calls++;
			this.audio_sprite.playSpriteRange(this.sound_array[this.audio_chain_position],this.audio_chain_callback.bind(this))
		}
	},
	
	audio_chain_callback: function () {
		if(this.audio_chain_waiting==true){
			this.audio_chain_position++;
			this.play_sprite_chain();		
		}
	}
	
}


///////////////////////////////////////////////////////////


/*
Data tables
<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>

$('#example').DataTable( {
    data: data,
    columns: [
        { data: 'name' },
        { data: 'position' },
        { data: 'salary' },
        { data: 'office' }
    ]
} );
*/
var DataTableSimple = function (table_config){
	// Empty table
	this.innerHTML = "";

	var table_head = this.createTHead();
	var table_body = this.createTBody();
	
	if(table_config.hasOwnProperty('columns')){
		var table_row=table_head.insertRow(table_head.rows.length);
		for(var table_column=0;table_column<table_config.columns.length;table_column++){
				var table_cell  = table_row.insertCell(table_column);
				var cell_text  = document.createTextNode(table_config.columns[table_column].data);
				table_cell.appendChild(cell_text);
		}
	}
	if(table_config.hasOwnProperty('data')){
		//alert('has data '+table_config.data.length);
		for(var i=0;i<table_config.data.length;i++){
			var table_row   = table_body.insertRow(table_body.rows.length);
			for(var table_column=0;table_column<table_config.columns.length;table_column++){
				var table_cell  = table_row.insertCell(table_column);
				var cell_text  = document.createTextNode(table_config.data[i][table_config.columns[table_column].data]);
				table_cell.appendChild(cell_text);
			}
		}
	}
	if(table_config.hasOwnProperty('pagination') && isInteger(table_config.pagination) && table_config.pagination > 0){
		$('#'+this.id).after('<div id="'+this.id+'-nav"></div>');	
		var rowsShown = table_config.pagination;
		var rowsTotal = table_config.data.length;
		var numPages = rowsTotal/rowsShown;
		for(i = 0;i < numPages;i++) {
		    var pageNum = i + 1;
		    $('#'+this.id+'-nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
		}
		$('#'+this.id+' tbody tr').hide();
		$('#'+this.id+' tbody tr').slice(0, rowsShown).show();
		$('#'+this.id+'-nav a:first').addClass('active');
		$('#'+this.id+'-nav a').bind('click', function(){
		    $('#'+this.id+'-nav a').removeClass('active');
		    $(this).addClass('active');
		    var currPage = $(this).attr('rel');
		    var startItem = currPage * rowsShown;
		    var endItem = startItem + rowsShown;
			//console.log(currPage+"  "+startItem+"-"+endItem);
		    $('#'+this.parentNode.id.replace("-nav","")+' tbody tr')
					.css('opacity','0.0').hide().slice(startItem, endItem)
					.css('display','table-row').animate({opacity:1}, 300);
		});
	}
	
};



function selectorExistsInCSS(styleSheetName, selector) {
    // Get the index of 'styleSheetName' from the document.styleSheets object
    for (var i = 0; i < document.styleSheets.length; i++) {
        var thisStyleSheet = document.styleSheets[i].href ? document.styleSheets[i].href.replace(/^.*[\\\/]/, '') : '';
        if (thisStyleSheet == styleSheetName) { var idx = i; break; }
    }
    if (!idx) return false; // We can't find the specified stylesheet

    // Check the stylesheet for the specified selector
    var styleSheet = document.styleSheets[idx];
    var cssRules = styleSheet.rules ? styleSheet.rules : styleSheet.cssRules;
    for (var i = 0; i < cssRules.length; ++i) {
        if(cssRules[i].selectorText == selector) return true;
    }
    return false;
}
