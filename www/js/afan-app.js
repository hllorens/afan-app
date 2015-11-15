"use strict";

var QueryString=get_query_string();
var game_mode=false;
if(QueryString.hasOwnProperty('game_mode') && QueryString.game_mode=='true') game_mode=true;

var app_name='CoLE';

// MEDIA
var images = [
"../../afan-app-media/img/spacer158.png",
"../../afan-app-media/img/wordimg-sprite.png",
"../../afan-app-media/img/correct.png",
"../../afan-app-media/img/wrong.png"
];

var sounds = [
	// it can be dropbox https://dl.dropboxusercontent.com/u/188219/
	//or absolute http://www.centroafan.com/afan-app-media/audio/...m4a"
	// relative is the best to reuse it in the cordova app
	"../../afan-app-media/audio/letters128kbps.m4a"
];



var media_objects;
var session_state="unset";
var header_zone=document.getElementById('header');
var header_text=undefined;
var canvas_zone=document.getElementById('zone_canvas');
var canvas_zone_vcentered=document.getElementById('zone_canvas_vcentered');

if(game_mode){
	canvas_zone.classList.remove("canvas-with-header");
	canvas_zone.classList.add("canvas-full");
}

var audio_sprite;
var audio_sprite_name='letters128kbps.m4a';

// already done in php? to match img name (ascii) and answer? Maybe keep "original answer" with the correct letters 
//var letter_equivalence = { 'à':'a', 'á':'a', 'ç':'c', 'è':'e', 'é':'e', 'í':'i', 'ï':'i', 'ñ':'ny', 'ò':'o', 'ó':'o', 'ú':'u' };

ajax_request('backend/ajaxdb.php?action=gen_session_state',function(text) {
	session_state=text; //console.log(session_state);
});


// NOTE: to accelerate the sound edited: start+0.2 and end -0.1
var audio_object_sprite_ref={
	a: {id: "a", start: 20.418, end: 21.122}, 
	b: {id: "b", start: 10.897, end: 11.598}, 
	bv: {id: "bv", start: 26.423, end: 27.128}, 
	ch: {id: "ch", start: 1.200, end: 1.597}, 
	d: {id: "d", start: 8.898, end: 9.597}, 
	e: {id: "e", start: 45.947, end: 46.646}, 
	f: {id: "f", start: 2.897, end: 3.594}, 
	g: {id: "g", start: 12.898, end: 13.600}, 
	i: {id: "i", start: 34.433, end: 35.133}, 
	j: {id: "j", start: 24.424, end: 25.123}, 
	k: {id: "k", start: 37.934, end: 38.635}, 
	l: {id: "l", start: 41.938, end: 42.643}, 
	m: {id: "m", start: 43.943, end: 44.647}, 
	n: {id: "n", start: 16.404, end: 17.117}, 
	ny: {id: "ny", start: 30.427, end: 31.130}, 
	o: {id: "o", start: 32.430, end: 33.133}, 
	p: {id: "p", start: 22.422, end: 23.124}, 
	r: {id: "r", start: 39.935, end: 40.638}, 
	rr: {id: "rr", start: 28.428, end: 29.127}, 
	s: {id: "s", start: 18.417, end: 19.118}, 
	t: {id: "t", start: 4.894, end: 5.594}, 
	u: {id: "u", start: 49.951, end: 50.651}, 
	y: {id: "y", start: 6.894, end: 7.598}, 
	z: {id: "z", start: 47.946, end: 48.651}, 
	zfx_correct: {id: "zfx_correct50", start: 14.700, end: 15.204}, 
	zfx_wrong: {id: "zfx_wrong50", start: 36.233, end: 36.734}, 
	zsilence_start: {id: "zsilence_start", start: 0.100, end: 0.700}
};
var wordimage_image_ref=getAllCSSselectorsMatching("wordimg-sprite.css",new RegExp("wordimage-"));
for(var i=0;i<wordimage_image_ref.length;i++){
    wordimage_image_ref[i]=wordimage_image_ref[i].replace('.wordimage-','');
}


// constants
// TODO: Move this to each activity object...
var USE_ANSWERS = 3;
var MAX_PLAYS=2;
var MAX_TRAINING_ACTIVITIES=20;
var MAX_MEMORY_LEVELS=6;

//optional??
var zone_sound=null;
var dom_score_correct;
var dom_score_answered;

// TODO: each game vars... to be encapsulated in objects
var remaining_rand_activities=[];
var correct_answer='undefined';
var current_activity_type='undefined'; // to avoid loading all the html
var activity_timer=new ActivityTimer();
var current_activity_data={};
var current_activity_index=0;
var current_activity_played_times=0;
var current_activity_memory_level=1;
var current_activity_memory_level_passed_times=0;
var current_activity_memory_pattern=undefined;
var current_activity_memory_options=undefined;
var current_activity_memory_uncovered=0;
var current_activity_memory_already_incorrect=false;


var user_data={};
var session_data={
	user: null,
	subject: "invitado",
	subject_age: "5",
	level: "1",
	duration: 0,
	timestamp: "0000-00-00 00:00",
	num_correct: 0,
	num_answered: 0,
	result: 0,
	type: 'conciencia',
	mode: 'training',
    action: 'send_session_data_post',
	details: []
};

var subjects_select_elem="none";
var users_select_elem="none";

// Cache, clear this if user changes, session, or when they are modified...
var cache_user_subjects=null;
var cache_user_subject_results={};
var cache_user_subject_result_detail={};

function login_screen(){
	if(debug){alert('login_screen called');}
	header_zone.innerHTML='<h1>Acceso</h1>';
	canvas_zone_vcentered.innerHTML='\
	<div id="signinButton" class="button">Google+\
   <span class="icon"></span>\
    <span class="buttonText"></span>\
	</div>\
	<br /><button class="button exit" onclick="invitee_access();">Invitado</button> \
	<br /><button id="exit" class="button exit" onclick="exit_app();">Salir</button> \
		';
	gapi.signin.render('signinButton', {
	  'callback': 'signInCallback',
	  'clientid': '125860785862-s07kh0j5tpb2drjkeqsifldn39krhh60.apps.googleusercontent.com',
	  'cookiepolicy': 'single_host_origin',
	  'redirecturi': 'postmessage',
	  'accesstype': 'offline',
	  'scope': 'openid email'
	}); //'redirecturi': 'postmessage', --> avoids reloading the page?
	// accesstype="offline" --> ?? isn't implicit?
}

function invitee_access(){
	session_data.user='invitado';
	session_data.user_access_level='invitee';
	user_data.email='invitee';
	user_data.display_name='invitado';
	user_data.access_level='invitee';
    cache_user_subject_results[session_data.subject]={}
    cache_user_subject_results[session_data.subject].general={'user':'invitado','subject':'invitado'}
    cache_user_subject_results[session_data.subject].elements=[]
    // cache_user_subject_result_detail is created lively in case of results
    menu_screen();
}


function signInCallback(authResult) {
	//console.log(authResult);
	if (authResult['code']) {
		document.getElementById('signinButton').innerHTML="Loading...";
		// Send one-time-code to server, if responds -> success
		if(debug) console.log(authResult);
		ajax_request_json(
			backend_url+'ajaxdb.php?action=gconnect&state='+session_state+'&code='+authResult['code'],
			function(result) {
				if (result) {
					if(debug){
                        console.log(result);
                        console.log("logged! "+result.email+" level:"+result.access_level);
                        alert("logged! "+result.email+" level:"+result.access_level);
                    }
                    if(result.hasOwnProperty('error') && result.error!=""){alert("LOGIN ERROR: "+result.error); return;}
                    user_data.display_name=result.display_name;
                    user_data.email=result.email;
					user_data.access_level=result.access_level;
					session_data.user=result.email;
					session_data.user_access_level=result.access_level;
					menu_screen();
				} else if (authResult['error']) {
					alert('There was an error: ' + authResult['error']);
				} else {
					alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
				}
			}
		);
	}
}

function gdisconnect(){
	hamburger_close();
	if(user_data.email=='invitee'){ login_screen(); return;}
	ajax_request_json(
		backend_url+'ajaxdb.php?action=gdisconnect', 
		function(result) {
			if (result.hasOwnProperty('success')) {
				if(debug) console.log(result.success);
			} else {
				if(!result.hasOwnProperty('error')) result.error="NO JSON RETURNED";
				alert('Failed to disconnect.</br>Result:'+ result.error);
			}
            login_screen();
		}
	);
}

function admin_screen(){
	header_text.innerHTML=' &larr; '+app_name+' menu';
	ajax_request_json(
		backend_url+'ajaxdb.php?action=get_users', 
		function(data) {
			var users=data; // TODO: protect, if return is not good fail...
			canvas_zone_vcentered.innerHTML=' \
				User:  <select id="users-select"></select> \
				<br /><button onclick="set_user()" class="button">Acceder</button> \
			    <br /><button onclick="check_missing_elements()" class="button">Comprobar sonidos/imagenes</button> \
				<br /><button class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button>\
				';
			users_select_elem=document.getElementById('users-select');
			select_fill_with_json(users,users_select_elem);
		}
	);
}

var letter_reader=function(){
    if(!check_if_sounds_loaded(letter_reader)){return;}
    canvas_zone_vcentered.innerHTML=' \
        Sonidos a leer (separados por espacio) <input id="input_sounds" type="text" /> \
        <button id="read-button" onclick="read_input_sounds()" class="button">Leer</button> \
        <br /><br /><button onclick="menu_screen()" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
}

var read_input_sounds=function(){
	document.getElementById("read-button").disabled=true;
	var input_sounds=document.getElementById("input_sounds").value.replace(/[ ]+/g, " ").trim().split(" ");
    if(check_if_sounds_loaded(read_input_sounds)){
        SoundChain.play_sound_arr(input_sounds, audio_sprite, letter_reader);
    }
}

var check_missing_elements=function(){
	var undefined_sounds={total:0};
	var undefined_images={total:0};
	var msg="";
	for (var i=0;i<json_training.length;i++){
		var act_sounds=json_training[i].sounds;
		for (var s=0;s<act_sounds.length;s++){
			if(act_sounds[s]=="\/") continue;
			if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
				undefined_sounds[act_sounds[s]]=true;
				undefined_sounds.total=undefined_sounds.total+1;
				msg+="\n sound("+act_sounds[s]+") not found in training ("+json_training[i].answers[0]+").";
			}
		}
		if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+json_training[i].answers[0]) 
            && !undefined_images.hasOwnProperty(json_training[i].answers[0])){
			undefined_images[json_training[i].answers[0]]=true;
			undefined_images.total=undefined_images.total+1;
			msg+="\n image("+json_training[i].answers[0]+") not found in training.";
		}
	}
	for (var i=0;i<json_test.length;i++){
		var act_sounds=json_test[i].sounds;
		for (var s=0;s<act_sounds.length;s++){
			if(act_sounds[s]=="\/") continue;
			if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
				undefined_sounds[act_sounds[s]]=true;
				undefined_sounds.total=undefined_sounds.total+1;
				msg+="\n sound("+act_sounds[s]+") not found in test ("+json_test[i].answers[0]+").";
			}
		}
		if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+json_test[i].answers[0]) 
            && !undefined_images.hasOwnProperty(json_test[i].answers[0])){
			undefined_images[json_test[i].answers[0]]=true;
			undefined_images.total=undefined_images.total+1;
			msg+="\n image("+json_test[i].answers[0]+") not found in test.";
		}
	}
	if(msg==""){
		alert("All elements are defined");
	}else{
		alert(msg+"\nMissing "+undefined_sounds.total+" sounds and "+undefined_images.total+" images")
	}
}

function set_user(){
	if(session_data.user!=users_select_elem.options[users_select_elem.selectedIndex].value){
		session_data.user=users_select_elem.options[users_select_elem.selectedIndex].value;
		cache_user_subjects=null; cache_user_subject_results={};
        cache_user_subject_result_detail={};
	}
	menu_screen();
}

function set_subject(){
    if(subjects_select_elem.options[subjects_select_elem.selectedIndex]!=undefined){
        session_data.subject=subjects_select_elem.options[subjects_select_elem.selectedIndex].value;
        session_data.age=calculateAge(cache_user_subjects[session_data.subject]['birthdate']); 
    }
}

function show_profile(){
    header_text.innerHTML=' &larr; '+app_name+' menu';
    canvas_zone_vcentered.innerHTML=' \
        Usuario: '+user_data.email+'  <br />\
        Acceso: '+user_data.access_level+'  <br />\
        <br /><button class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button>\
        ';
}


function menu_screen(){
	allowBackExit();
	var splash=document.getElementById("splash_screen");
	if(splash!=null && (ResourceLoader.lazy_audio==true || ResourceLoader.not_loaded['sounds'].length==0)){
        splash.parentNode.removeChild(splash); if(debug){alert('load1-complete');}
    }
	if(media_objects===undefined) media_objects=ResourceLoader.ret_media;//pointer
	if(debug){
		console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info);
		console.log('not_loaded sounds: '+ResourceLoader.not_loaded['sounds'].length);
	}
	
	/*if(is_app){session_data.user='montsedeayala@gmail.com'; // will find a way to set the usr, by google account}*/
	
	if(user_data.email==null && !game_mode){
		login_screen();
	}else if(!game_mode){
		var sign='<li><a href="#" onclick="hamburger_close();show_profile()">perfil</a></li>\
				  <li><a href="#" onclick="hamburger_close();gdisconnect()">desconectar</a></li>';
		if(user_data.email=='invitee'){
			sign='<li><a href="#" onclick="hamburger_close();login_screen()">acceder</a></li>';
		}
		// TODO if admin administrar... lo de sujetos puede ir aquí tb...
		hamburger_menu_content.innerHTML=''+get_reduced_display_name(user_data.display_name)+'<ul>\
		'+sign+'\
		<li><a href="#" onclick="exit_app()">salir</a></li>\
		</ul>';
		header_zone.innerHTML='<a id="hamburger_icon" onclick="hamburger_toggle(event)"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
		<path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/></svg></a> <span id="header_text" onclick="menu_screen()">'+app_name+'</span>';
        header_text=document.getElementById('header_text');

		var admin_opts='<br /><button id="sel-usr" onclick="admin_screen()" class="button">Administrar</button>';
		var normal_opts='\
	    <br /><button id="read-letters" disabled="true" class="button" onclick="letter_reader()">Lector de sonidos</button> \
		<br /><button id="manage-subjects" disabled="true" class="button" onclick="manage_subjects()">Participantes</button> \
		';
		if(user_data.access_level!='admin') admin_opts="";
		if(user_data.access_level=='invitee'){ normal_opts=""; cache_user_subjects={'invitado':'invitado'}}
		canvas_zone_vcentered.innerHTML=' \
		<div id="menu-logo-div"></div> \
		Participante:  <select id="subjects-select" onchange="set_subject()"></select> \
		<nav id="responsive_menu">\
		'+admin_opts+'\
		<br /><button id="start-button" class="button" disabled="true">Jugar</button> \
        <button id="start-test-button" class="button" disabled="true">Test</button> \
		'+normal_opts+'\
        <br /><button id="results" disabled="true" class="button">Resultados</button>\
		<br /><button id="exit_app" class="button exit" onclick="exit_app()">Salir</button> \
		</nav>\
		';
        document.getElementById("results").addEventListener(clickOrTouch,function(){explore_results();});
        document.getElementById("exit_app").addEventListener(clickOrTouch,function(){exit_app();});
		if(cache_user_subjects==null){
			ajax_request_json(
				backend_url+'ajaxdb.php?action=get_subjects&user='+session_data.user, 
				function(data) {
					cache_user_subjects=data;
                    prepare_menu_when_subjects_loaded();
				}
			);
		}else{
            prepare_menu_when_subjects_loaded();
		}
	}else{
		game(); // just training
	}
}

var prepare_menu_when_subjects_loaded=function(){
    subjects_select_elem=document.getElementById('subjects-select');
    select_fill_with_json(cache_user_subjects,subjects_select_elem,session_data.subject);
    set_subject();

    document.getElementById("start-button").addEventListener(clickOrTouch,function(){session_data.mode="training";game();});
    document.getElementById("start-test-button").addEventListener(clickOrTouch,function(){session_data.mode="test";game();});
    document.getElementById("start-button").disabled=false;
    document.getElementById("start-test-button").disabled=false;    
    document.getElementById("results").disabled=false;
    if(user_data.access_level!='invitee'){
        document.getElementById("read-letters").disabled=false;
        document.getElementById("manage-subjects").disabled=false;
    }
}


var manage_subjects=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
	canvas_zone_vcentered.innerHTML=' \
    <button id="add-subject" class="button" onclick="add_subject()">Añadir</button>\
	<div id="results-div">cargando participantes...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button> \
	';
	var user_subjects_data=[];
	for(var key in cache_user_subjects){
		if (cache_user_subjects.hasOwnProperty(key)) {
			user_subjects_data.push(cache_user_subjects[key]);
		}
	}    
    
	if(user_subjects_data.length==0){
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br />No hay participantes";
	}else{
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br /><table id=\"results-table\"></table>";
		var results_table=document.getElementById("results-table");
		DataTableSimple.call(results_table, {
			data: user_subjects_data,
			pagination: 5,
			row_id: 'id',
			row_id_prefix: 'row-subj',
			columns: [
				//{ data: 'id' },
				{ data: 'alias', col_header: 'Alias',  format: 'first_12', link_function_id: 'edit_subject'}, // TODO: edit_function: "" --> this will add the edit icon etc...
				{ data: 'birthdate', col_header: 'F.Nac'},
				{ data: 'comments', col_header: 'Info',  format: 'first_12' }
			]
		} );
	}
};


var add_subject=function(){
	var accept_function=function(){
		var myform=document.getElementById('my-form');
		var myformsubmit=document.getElementById('my-form-submit');
		if (!myform.checkValidity()){
			if(debug) console.log("form error");
			// TODO se puede abstraer merjor...
		    myform.removeEventListener("submit", formValidationSafariSupport);
		    myform.addEventListener("submit", formValidationSafariSupport);
		    myformsubmit.removeEventListener("click", showFormAllErrorMessages);
		    myformsubmit.addEventListener("click", showFormAllErrorMessages);
			myformsubmit.click(); // won't submit (invalid), but show errors
		}else{
			open_js_modal_content('<h1>Añadiendo... '+document.getElementById('new-alias').value+'</h1>');
			ajax_request_json(
			backend_url+'ajaxdb.php?action=add_subject&user='+user_data.email+'&alias='+document.getElementById('new-alias').value+'&name='+document.getElementById('new-name').value+'&birthdate='+document.getElementById('new-birthdate').value+'&comments='+document.getElementById('new-comments').value, 
			function(data) {
				if(data['success']!='undefined'){
					cache_user_subjects[data['success']]=data['data'];
					remove_modal();
					remove_modal("js-modal-window-alert");
					manage_subjects(); // to reload with the new user...
				}else{
					alert("ERROR: "+JSON.stringify(data));
				}
			}
			);
		}
	};
	var cancel_function=function(){ remove_modal("js-modal-window-alert"); };
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<label for="new-alias">Alias</label><input id="new-alias" type="text" required="required" /><br /> \
			<label for="new-name">Nombre</label><input id="new-name" type="text" required="required" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label><input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  /><br /> \
			<label>Comentarios</label><textarea id="new-comments"></textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Añadir Participante",form_html,accept_function,cancel_function);
};

var edit_subject=function(sid){
	var accept_function=function(){
		var myform=document.getElementById('my-form');
		var myformsubmit=document.getElementById('my-form-submit');
		if (!myform.checkValidity()){
			if(debug) console.log("form error");
			// TODO se puede abstraer merjor...
		    myform.removeEventListener("submit", formValidationSafariSupport);
		    myform.addEventListener("submit", formValidationSafariSupport);
		    myformsubmit.removeEventListener("click", showFormAllErrorMessages);
		    myformsubmit.addEventListener("click", showFormAllErrorMessages);
			myformsubmit.click(); // won't submit (invalid), but show errors
		}else{
			open_js_modal_content('<h1>Actualizando... '+document.getElementById('new-alias').value+'</h1>');
			ajax_request_json(
			backend_url+'ajaxdb.php?action=update_subject&lid='+sid+'&user='+user_data.email+'&alias='+document.getElementById('new-alias').value+'&name='+document.getElementById('new-name').value+'&birthdate='+document.getElementById('new-birthdate').value+'&comments='+document.getElementById('new-comments').value, 
			function(data) {
				if(data['success']!='undefined'){
					cache_user_subjects[data['success']]=data['data'];
					remove_modal();
					remove_modal("js-modal-window-alert");
					manage_subjects(); // to reload with the new user...
				}else{
					alert("ERROR: "+JSON.stringify(data));
				}
			}
			);
		}
	};
	var cancel_function=function(){ remove_modal("js-modal-window-alert"); };
	var subj2edit={"id": sid, "alias":"", "name":"", "birthdate":"", "comments":"", "user":"afan"}
	for(var key in cache_user_subjects){
		if (cache_user_subjects.hasOwnProperty(key) && cache_user_subjects[key]['id']==sid) {
			subj2edit=cache_user_subjects[key];
		}
	}
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<label>Usuario</label><input type="text" readonly="readonly" value="'+subj2edit.user+'" /><br /> \
			<label for="new-alias">Alias</label><input id="new-alias" type="text" required="required" readonly="readonly" value="'+subj2edit.alias+'" /><br /> \
			<label for="new-name">Nombre</label><input id="new-name" type="text" required="required" value="'+subj2edit.name+'" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label><input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  value="'+subj2edit.birthdate+'" /><br /> \
			<label>Comentarios</label><textarea id="new-comments">'+subj2edit.comments+'</textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Editar Participante",form_html,accept_function,cancel_function);
};


var explore_results=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando resultados...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button> \
	';
    if(!cache_user_subject_results.hasOwnProperty(session_data.subject)){
        ajax_request_json(
            backend_url+'ajaxdb.php?action=get_results&user='+session_data.user+'&subject='+session_data.subject, 
            function(data) {
                cache_user_subject_results[session_data.subject]=data; //cache (never changes)
                if(cache_user_subject_results[session_data.subject].elements.length==0){
                    document.getElementById("results-div").innerHTML="Resultados "+cache_user_subject_results[session_data.subject].general.user+" - sujeto: <b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
                }else{
                    document.getElementById("results-div").innerHTML="Resultados "+cache_user_subject_results[session_data.subject].general.user+" - sujeto: <b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br /><table id=\"results-table\"></table>";
                    var results_table=document.getElementById("results-table");
                    DataTableSimple.call(results_table, {
                        data: cache_user_subject_results[session_data.subject].elements,
                        row_id: 'id',
                        pagination: 5,
                        columns: [
                            //{ data: 'id' },
                            { data: 'timestamp', col_header: 'Id', link_function_id: 'explore_result_detail' },
                            { data: 'type', col_header: 'Tipo',  format: 'first_4'},
                            { data: 'mode', col_header: 'Modo',  format: 'first_4'},
                            { data: 'age', col_header: 'Edad' },
                            { data: 'duration', col_header: 'Tiempo',  format: 'time_from_seconds_up_to_mins'}, 
                            { data: 'result', col_header: '%', format: 'percentage_int' } 
                        ]
                    } );
                }
            });	
    }else{
        if(cache_user_subject_results[session_data.subject].elements.length==0){
            document.getElementById("results-div").innerHTML="Resultados "+cache_user_subject_results[session_data.subject].general.user+" - sujeto: <b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
        }else{
            document.getElementById("results-div").innerHTML="Resultados "+cache_user_subject_results[session_data.subject].general.user+" - sujeto: <b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br /><table id=\"results-table\"></table>";
            var results_table=document.getElementById("results-table");
            DataTableSimple.call(results_table, {
                data: cache_user_subject_results[session_data.subject].elements,
                row_id: 'id',
                pagination: 5,
                columns: [
                    //{ data: 'id' },
                    { data: 'timestamp', col_header: 'Id', link_function_id: 'explore_result_detail' },
                    { data: 'type', col_header: 'Tipo',  format: 'first_4'},
                    { data: 'mode', col_header: 'Modo',  format: 'first_4'},
                    { data: 'age', col_header: 'Edad' },
                    { data: 'duration', col_header: 'Tiempo',  format: 'time_from_seconds_up_to_mins'}, 
                    { data: 'result', col_header: '%', format: 'percentage_int' } 
                ]
            } );
        }
    }
};

var explore_result_detail=function(session_id){
	preventBackExit();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando detalle resultado '+session_id+'...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back" onclick="explore_results()">&larr;</button> \
	';
	if(!cache_user_subject_result_detail.hasOwnProperty(session_id)){
		ajax_request_json(
			backend_url+'ajaxdb.php?action=get_result_detail&session='+session_id+'&user='+session_data.user, 
			function(data) {
				cache_user_subject_result_detail[session_id]=data; //cache (never changes)
                if(!cache_user_subject_result_detail[session_id].hasOwnProperty('elements') || cache_user_subject_result_detail[session_id].elements.length==0){
                    document.getElementById("results-div").innerHTML="session: "+cache_user_subject_result_detail[session_id].general.session+"<br />No hay detalles";
                    return;
                }
				document.getElementById("results-div").innerHTML="session: "+cache_user_subject_result_detail[session_id].general.session+" - subject: "+cache_user_subject_result_detail[session_id].elements[0].subject+"<br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"></table>";
				var results_table=document.getElementById("results-table");
				DataTableSimple.call(results_table, {
					data: cache_user_subject_result_detail[session_id].elements,
					pagination: 6,
					row_id: 'id',
					columns: [
						//{ data: 'id' },
						{ data: 'activity' },
						{ data: 'choice' },
						{ data: 'result',  special: 'red_incorrect' },
						{ data: 'duration',  format: 'time_from_seconds_up_to_mins'}
					]
				} );
			});
	}else{
        if(!cache_user_subject_result_detail[session_id].hasOwnProperty('elements') || cache_user_subject_result_detail[session_id].elements.length==0){
            document.getElementById("results-div").innerHTML="session: "+cache_user_subject_result_detail[session_id].general.session+"<br />No hay detalles";
        }else{
            document.getElementById("results-div").innerHTML="session: "+cache_user_subject_result_detail[session_id].general.session+" - subject: "+cache_user_subject_result_detail[session_id].elements[0].subject+"<br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"></table>";
            var results_table=document.getElementById("results-table");
            DataTableSimple.call(results_table, {
                data: cache_user_subject_result_detail[session_id].elements,
                pagination: 6,
                row_id: 'id',
                columns: [
                    //{ data: 'id' },
                    { data: 'activity' },
                    { data: 'choice' },
                    { data: 'result',  special: 'red_incorrect' },
                    { data: 'duration',  format: 'time_from_seconds_up_to_mins'}
                ]
            } );
        }
	}
};

var game=function(){
    remove_modal(); // for safety...
    if(debug){alert('game-called - game-mode? '+game_mode);}
    
    // CANNOT be here, in game-mode no clicks yet---------------------------
    //if(!check_if_sounds_loaded(memoria)){return;}
    // ----------------------------------------------------------------------
    
    // logic
    //random number within activity numbers of level1 (0 for now)
    //Fisher-Yates random at the beginning and then increment, or
    // do not rand array but just select a random position of the remaining array
    // ??
	// activity selection (if game_mode, remove and restyle header/footer...)
   
    //reset game variables --------
	session_data.num_correct=0;
	session_data.num_answered=0;
	session_data.duration=0;
    session_data.details=[];
    current_activity_memory_level=1;
    current_activity_played_times=0;
    current_activity_memory_level_passed_times=0;
    activity_timer.reset();
    //-----------------------------
	var extra_options="";
	if(!game_mode){
        extra_options='<br /><button id="go_back_button" class="minibutton fixed-bottom-right go-back">&larr;</button>';
        header_text.innerHTML=' &larr; '+app_name+' menu';
    }
    canvas_zone_vcentered.innerHTML=' \
    <br /><button id="conciencia" class="button">Conciencia</button> \
    <br /><button id="memoria" class="button">Memoria</button> \
    <br /><button id="ritmo" class="button">Ritmo</button> \
    <br /><button id="velocidad" class="button">Velocidad</button> \
    <br /><button id="discr_visual" class="button">Discr. Visual</button> \
    '+extra_options+'\
    ';
    
    document.getElementById("conciencia").addEventListener(clickOrTouch,function(){conciencia();});
    document.getElementById("memoria").addEventListener(clickOrTouch,function(){memoria();});
    document.getElementById("ritmo").addEventListener(clickOrTouch,function(){ritmo();});
    document.getElementById("velocidad").addEventListener(clickOrTouch,function(){velocidad();});
    document.getElementById("discr_visual").addEventListener(clickOrTouch,function(){discr_visual();});
    if(!game_mode){
        document.getElementById("go_back_button").addEventListener(clickOrTouch,function(){menu_screen();});
    }
}

// IMPORTANT: Has to be called after 1 click so it cannot be game() since
// in game-mode that one is the first function (no click)
var check_if_sounds_loaded=function(callback){
    if(typeof(callback)!=='function'){throw new Error("check_if_sounds_loaded called without a callback.");}
	canvas_zone_vcentered.innerHTML='...pre-cargando sonidos...'; // for the user to notice
	if(ResourceLoader.check_if_lazy_sounds_loaded(callback)){
		if(typeof(audio_sprite)==='undefined'){// load audio in the object 
			var audio_sprite_object=media_objects.sounds[audio_sprite_name]; // soundsSpriteABR56.30kbps.141k.m4a, soundsSpriteVBR30-19kbps-100k.m4a
			audio_sprite=new AudioSprite(audio_sprite_object,audio_object_sprite_ref,debug);
			audio_sprite.playSpriteRange('zsilence_start',callback);
            return false;
		}else{
            return true;
		}
	}
}

/******** EXTERNALIZE WHEN DONE *********************/
var memoria=function(){
    if(!check_if_sounds_loaded(memoria)){return;}
    preventBackExit();
	canvas_zone_vcentered.innerHTML=' \
	<br /><button class="button" id="memoria_visual">Memoria Visual</button> \
	<br /><button class="button" id="memoria_auditiva">Memoria Auditiva</button> \
	<br /><button class="button" id="go_back_button" class="minibutton fixed-bottom-right go-back">&larr;</button>\
	';
    document.getElementById("memoria_visual").addEventListener(clickOrTouch,function(){memoria_visual();});
    document.getElementById("memoria_auditiva").addEventListener(clickOrTouch,function(){memoria_auditiva();});
    document.getElementById("go_back_button").addEventListener(clickOrTouch,function(){game();});
}

/*****************************************************/









function send_session_data(){
    remove_modal();
	if(game_mode){game();}
    else{
        if(user_data.access_level=='invitee'){
            var result_obj={
                    id:""+cache_user_subject_results[session_data.subject].elements.length+1,
                    type:session_data.type,
                    mode:session_data.mode,
                    age:session_data.age,
                    num_answered:session_data.num_answered,
                    num_correct:session_data.num_correct,
                    result:session_data.result,
                    level:session_data.level,
                    duration:session_data.duration,
                    timestamp:session_data.timestamp
                };
            cache_user_subject_results[session_data.subject].elements.push(result_obj);
            canvas_zone_vcentered.innerHTML='<br />Resultados guardados temporalmente para\
                usuario "invitado"<br /><br />\
            <br /><button id="go-back" class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button>';
        }else{
            if(debug) console.log(JSON.stringify(session_data));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://www.centroafan.com/afan-app/www/"+backend_url+'ajaxdb.php',true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.responsetype="json";
            xhr.send("action=send_session_data_post&json_string="+(JSON.stringify(session_data))); 
            canvas_zone_vcentered.innerHTML='<br />Fin del Test<br />...Enviando test al servidor...<br /><br />';
            xhr.onload = function () {
                var data=JSON.parse(this.responseText);
                canvas_zone_vcentered.innerHTML='<br />Fin del Test<br />Datos guardados en el servidor.<br /><br />\
                <br /><button id="go-back" class="minibutton fixed-bottom-right go-back" onclick="menu_screen()">&larr;</button>';
                delete cache_user_subject_results[session_data.subject];
                if(debug) console.log('Storing data. Server message: '+data.msg);
            };
        }
    }
}

