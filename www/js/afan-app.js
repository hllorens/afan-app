"use strict";

var QueryString=get_query_string();
var game_mode=false;
if(QueryString.hasOwnProperty('game_mode') && QueryString.game_mode=='true') game_mode=true;

var app_name='CoLE';

// MEDIA
var images = [
//"../../afan-app-media/img/spacer158.png",
//"../../afan-app-media/img/AFAN.png",
"../../afan-app-media/img/happy.png",
"../../afan-app-media/img/wordimg-sprite.png",
"../../afan-app-media/img/correct.png",
"../../afan-app-media/img/wrong.png"
];
var sounds = [
	// it can be dropbox https://dl.dropboxusercontent.com/u/188219/
	//or absolute http://www.centroafan.com/afan-app-media/audio/...m4a"
	// relative is the best to reuse it in the cordova app
	"../../afan-app-media/audio/letters128kbps.m4a",
	"../../afan-app-media/audio/ta35.m4a",
	"../../afan-app-media/audio/ta150.m4a"
];

// JSON data, TODO still not used include in resource loader...
var jsons= [
	"../data/ac_conciencia_train.json",
	"../data/ac_conciencia_test.json",
	"../data/ac_velocidad_train.json",
	"../data/ac_velocidad_test.json"
]

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




var activity_timer=new ActivityTimer();

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
var cache_cognitionis_pagination_page=0;
var cache_user_subject_results={};
var cache_user_subject_result_detail={};
var cache_user_summary_view={};

function login_screen(){
	if(debug){alert('login_screen called');}
	if(user_bypass!=undefined){
		login_bypass();
	}else{
		header_zone.innerHTML='<h1>Acceso</h1>';
		canvas_zone_vcentered.innerHTML='\
		<div id="signinButton" class="button">Google+\
	   <span class="icon"></span>\
		<span class="buttonText"></span>\
		</div>\
		<br /><button class="button exit" id="invitee_access">Invitado</button> \
		<br /><button id="exit" class="button exit">Salir</button> \
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
		document.getElementById("invitee_access").addEventListener(clickOrTouch,function(){invitee_access();});
		document.getElementById("exit").addEventListener(clickOrTouch,function(){exit_app();});
	}
}

function invitee_access(){
	session_data.user='invitado';
	session_data.user_access_level='invitee';
	user_data.email='invitee';
	user_data.display_name='invitado';
	user_data.access_level='invitee';
    
    ajax_request_json(
        '../data/invitado_data.json', 
        function(data) {
            cache_user_subjects=data.cache_user_subjects;
            session_data.subject=objectProperties(cache_user_subjects)[0];
            cache_user_subject_results=data.cache_user_subject_results;
            cache_user_subject_result_detail=data.cache_user_subject_result_detail;
            cache_user_summary_view=data.cache_user_summary_view;
            menu_screen();
        });    
    /*cache_user_subjects={'invitado':{"id": "invitado", "alias":"invitado", "name":"invitado", "birthdate":"2010-01-01", "comments":"", "user":"afan"}};
    cache_user_subject_results[session_data.subject]={};
    cache_user_subject_results[session_data.subject].general={'user':'invitado','subject':'invitado'};
    cache_user_subject_results[session_data.subject].elements=[];*/
    // cache_user_subject_result_detail is created lively in case of results
    
}

function login_bypass(){
		ajax_request_json(
			backend_url+'ajaxdb.php?action=login_bypass&state='+session_state+'&user='+user_bypass,
			function(result) {
				if (result) {
                    if(result.hasOwnProperty('error') && result.error!=""){alert("LOGIN ERROR: "+result.error); return;}
                    if(debug){
                        console.log(result);
                        console.log("logged! "+result.email+" level:"+result.access_level);
                        alert("logged! "+result.email+" level:"+result.access_level);
                    }
                    user_data.info=result.info;
                    user_data.display_name=result.display_name;
                    user_data.user_id=result.user_id;
                    user_data.picture=result.picture;
                    user_data.email=result.email;
					user_data.access_level=result.access_level;
					session_data.user=result.email;
					session_data.user_access_level=result.access_level;
					cache_user_subjects=null; cache_user_subject_results={};
					cache_user_subject_result_detail={};
					menu_screen();
				} else {
					alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
					login_screen();
				}
			}
		);

}

function signInCallback(authResult) {
	//console.log(authResult);
	if (authResult['code']) {
		canvas_zone_vcentered.innerHTML='<div class="loader">Loading...</div>';
		// Send one-time-code to server, if responds -> success
		if(debug) console.log(authResult);
		ajax_request_json(
			backend_url+'ajaxdb.php?action=gconnect&state='+session_state+'&code='+authResult['code'],
			function(result) {
				if (result) {
                    if(result.hasOwnProperty('error') && result.error!=""){alert("LOGIN ERROR: "+result.error); return;}
                    if(result.hasOwnProperty('info') && result.info=="new user"){
                        open_js_modal_content_accept('<p>Usuario creado para: '+result.email+' \
                        en breve recibirá un email confirmando su registro.</p>');
                    }
                    if(debug){
                        console.log(result);
                        console.log("logged! "+result.email+" level:"+result.access_level);
                        alert("logged! "+result.email+" level:"+result.access_level);
                    }
                    user_data.info=result.info;
                    user_data.display_name=result.display_name;
                    user_data.user_id=result.user_id;
                    user_data.picture=result.picture;
                    user_data.email=result.email;
					user_data.access_level=result.access_level;
					session_data.user=result.email;
					session_data.user_access_level=result.access_level;
					cache_user_subjects=null; cache_user_subject_results={};
					cache_user_subject_result_detail={};
					menu_screen();
				} else if (authResult['error']) {
					alert('There was an error: ' + authResult['error']);
					login_screen();
				} else {
					alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
					login_screen();
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
				<br /><button id="set_user" class="button">Acceder</button> \
			    <br /><button id="check_missing_elements" class="button">Comprobar sonidos/imagenes</button> \
				<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
				';
			users_select_elem=document.getElementById('users-select');
			select_fill_with_json(users,users_select_elem);
			document.getElementById("set_user").addEventListener(clickOrTouch,function(){set_user();});
			document.getElementById("check_missing_elements").addEventListener(clickOrTouch,function(){check_missing_elements();});
			document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});			
		}
	);
}

var letter_reader=function(){
    if(!check_if_sounds_loaded(letter_reader)){return;}
    canvas_zone_vcentered.innerHTML=' \
        Escribe letras a leer (separadas por espacio)<br /><input id="input_sounds" type="text" /> <br />\
        <button id="read-button" class="button">Leer</button> \
        <br /><br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
	document.getElementById("read-button").addEventListener(clickOrTouch,function(){read_input_sounds();});
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}

var read_input_sounds=function(){
	document.getElementById("read-button").disabled=true;
	var input_sounds=document.getElementById("input_sounds").value.replace(/[ ]+/g, " ").trim().split(" ");
    SoundChain.play_sound_arr(input_sounds, audio_sprite, letter_reader);
}

var check_missing_elements=function(){
	var undefined_sounds={total:0};
	var undefined_images={total:0};
	var msg="";
	if(media_objects.jsons.hasOwnProperty("ac_conciencia_train.json")){
        var level=1;
        do{
            for (var i=0;i<media_objects.jsons["ac_conciencia_train.json"][level].length;i++){
                var act_sounds=media_objects.jsons["ac_conciencia_train.json"][level][i].sounds;
                for (var s=0;s<act_sounds.length;s++){
                    if(act_sounds[s]=="\/") continue;
                    if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
                        undefined_sounds[act_sounds[s]]=true;
                        undefined_sounds.total=undefined_sounds.total+1;
                        msg+="\n sound("+act_sounds[s]+") not found in training ("+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]+").";
                    }
                }
                if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]) 
                    && !undefined_images.hasOwnProperty(media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0])){
                    undefined_images[media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]]=true;
                    undefined_images.total=undefined_images.total+1;
                    msg+="\n image("+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]+") not found in training.";
                }
            }
            level++;
        }while(media_objects.jsons["ac_conciencia_train.json"].hasOwnProperty(level));
        level=1;
        do{
            for (var i=0;i<media_objects.jsons["ac_conciencia_test.json"].length;i++){
                var act_sounds=media_objects.jsons["ac_conciencia_test.json"][i].sounds;
                for (var s=0;s<act_sounds.length;s++){
                    if(act_sounds[s]=="\/") continue;
                    if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
                        undefined_sounds[act_sounds[s]]=true;
                        undefined_sounds.total=undefined_sounds.total+1;
                        msg+="\n sound("+act_sounds[s]+") not found in test ("+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]+").";
                    }
                }
                if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]) 
                    && !undefined_images.hasOwnProperty(media_objects.jsons["ac_conciencia_test.json"][i].answers[0])){
                    undefined_images[media_objects.jsons["ac_conciencia_test.json"][i].answers[0]]=true;
                    undefined_images.total=undefined_images.total+1;
                    msg+="\n image("+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]+") not found in test.";
                }
            }
            level++;
        }while(media_objects.jsons["ac_conciencia_test.json"].hasOwnProperty(level));
	}else{
        msg+="\n ac_conciencia_train.json not found.";
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
        <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
        ';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}

function show_about(){
    header_text.innerHTML=' &larr; '+app_name+' menu';
    canvas_zone_vcentered.innerHTML=' \
        <img src="../../afan-app-media/img/logo-afan.png" /><br /><h1>Programa CoLE</h1>Corrección de los errores en Lectura y Escritura<br />\
        &copy; 2015\
        <br /><br />M.de Ayala, H.Llorens<br />\
        Url: <a href="http://www.centroafan.com">www.centroafan.com</a> <br />\
        Contacto: info@centroafan.com  <br />\
        <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
        ';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
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
	cache_cognitionis_pagination_page=0;
	if(debug) console.log('user.email: '+user_data.email);
	if(session_state=="unset"){
        canvas_zone_vcentered.innerHTML='...waiting for session state...';
        setTimeout(function() {menu_screen()}, 2000); // add a counter and if it reaches something fail gracefully
	}else if(user_data.email==null && !game_mode){
		login_screen();
	}else if(!game_mode){
		var sign='<li><a href="#" id="show_profile">perfil</a></li>\
				  <li><a href="#" id="gdisconnect">desconectar</a></li>';
		if(user_data.email=='invitee'){
			sign='<li><a href="#" id="login_screen">acceder</a></li>';
		}
		// TODO if admin administrar... lo de sujetos puede ir aquí tb...
		hamburger_menu_content.innerHTML=''+get_reduced_display_name(user_data.display_name)+'<ul>\
		'+sign+'\
		<li><a href="#" id="show_about">acerca de..</a></li>\
		<li><a href="#" id="exit_app_hamburger">salir</a></li>\
		</ul>';
		header_zone.innerHTML='<a id="hamburger_icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
		<path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/></svg></a> <span id="header_text">'+app_name+'</span>';
        header_text=document.getElementById('header_text');

		var admin_opts='<br /><button id="admin_screen"  class="button">Administrar</button>\
			<br /><button id="letter_reader" disabled="true" class="button">Lector de sonidos</button>';
		var normal_opts='\
		';
		if(user_data.access_level!='admin') admin_opts="";
		if(user_data.email=='invitee'){ normal_opts="";}
		canvas_zone_vcentered.innerHTML=' \
		<div id="menu-logo-div"></div> \
		Participante:  <select id="subjects-select" onchange="set_subject()"></select> \
		<nav id="responsive_menu">\
		'+admin_opts+'\
		<br /><button id="start-button" class="button" disabled="true">Jugar</button> \
        <button id="start-test-button" class="button" disabled="true">Test</button> \
		'+normal_opts+'\
		<br /><button id="manage-subjects" disabled="true" class="button">Participantes</button> \
        <br /><button id="results" disabled="true" class="button">Resultados</button>\
		<br /><button id="exit_app" class="button exit">Salir</button> \
		</nav>\
		';
		if(user_data.access_level=='admin'){
			document.getElementById("admin_screen").addEventListener(clickOrTouch,function(){admin_screen();});
			document.getElementById("letter_reader").addEventListener(clickOrTouch,function(){letter_reader();});
		}
		if(user_data.email!='invitee'){
			document.getElementById("show_profile").addEventListener(clickOrTouch,function(){hamburger_close();show_profile();});
			document.getElementById("gdisconnect").addEventListener(clickOrTouch,function(){hamburger_close();gdisconnect();});
        }else{
            document.getElementById("login_screen").addEventListener(clickOrTouch,function(){hamburger_close();login_screen();});
        }

		document.getElementById("hamburger_icon").addEventListener(clickOrTouch,hamburger_toggle);
		document.getElementById("header_text").addEventListener(clickOrTouch,function(){menu_screen();});
		document.getElementById("manage-subjects").addEventListener(clickOrTouch,function(){manage_subjects();});
        document.getElementById("results").addEventListener(clickOrTouch,function(){show_results();});
        document.getElementById("exit_app").addEventListener(clickOrTouch,function(){exit_app();});
        document.getElementById("show_about").addEventListener(clickOrTouch,function(){hamburger_close();show_about();});
        document.getElementById("exit_app_hamburger").addEventListener(clickOrTouch,function(){exit_app();});

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
    document.getElementById("manage-subjects").disabled=false;
    //if(user_data.email!='invitee'){}
    if(user_data.access_level=='admin'){document.getElementById("letter_reader").disabled=false;}

}


var manage_subjects=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
    var normal_opts='<button id="add-subject" class="button">Añadir</button>';
    if(user_data.email=='invitee'){ normal_opts="";}
	canvas_zone_vcentered.innerHTML=' \
    '+normal_opts+'\
	<div id="results-div">cargando participantes...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
	if(user_data.email!='invitee') {document.getElementById("add-subject").addEventListener(clickOrTouch,function(){add_subject();});}
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
	var user_subjects_data=[];
	for(var key in cache_user_subjects){
		if (cache_user_subjects.hasOwnProperty(key)) {
			user_subjects_data.push(cache_user_subjects[key]);
		}
	}    
    
	if(user_subjects_data.length==0){
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br />No hay participantes";
	}else{
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br /><table id=\"results-table\"  class=\"results-table\"></table>";
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
                if(data.hasOwnProperty('success')){
                    cache_user_subjects[data['success']]=data['data'];
                    remove_modal();
                    remove_modal("js-modal-window-alert");
                    manage_subjects(); // to reload with the new user...
                }else{
                    remove_modal();
                    remove_modal("js-modal-window-alert");
                    manage_subjects(); // to reload with the new user...
                    alert("ERROR: "+data['error']);
                }
            }
            );
		}
	};
	var cancel_function=function(){ remove_modal("js-modal-window-alert"); };
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<!--<label for="new-alias">Alias</label>--> <input id="new-alias" type="text" required="required" readonly="readonly" style="visibility:hidden;" /><br /> \
			<label for="new-name">Nombre</label> <input id="new-name" type="text" required="required" onkeyup="update_alias()" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label> <input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  /><br /> \
			<label>Comentarios</label> <textarea id="new-comments"></textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Añadir Participante",form_html,accept_function,cancel_function);
};

var update_alias=function(){
	var name=document.getElementById('new-name').value;
	document.getElementById('new-alias').value=slugify(name);
}

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
            if(user_data.email=='invitee'){
                cache_user_subjects.invitado.name=document.getElementById('new-name').value;
                cache_user_subjects.invitado.birthdate=document.getElementById('new-birthdate').value;
                cache_user_subjects.invitado.comments=document.getElementById('new-comments').value;
                remove_modal();
                remove_modal("js-modal-window-alert");
                manage_subjects(); // to reload with the new user...
            }else{
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
			<!--<label>Usuario</label><input type="text" readonly="readonly" value="'+subj2edit.user+'" /><br />--> \
			<!--<label for="new-alias">Alias</label>--> <input id="new-alias" type="text" required="required" readonly="readonly" style="visibility:hidden;" value="'+subj2edit.alias+'" /><br /> \
			<label for="new-name">Nombre</label> <input id="new-name" type="text" required="required" value="'+subj2edit.name+'" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label> <input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  value="'+subj2edit.birthdate+'" /><br /> \
			<label>Comentarios</label> <textarea id="new-comments">'+subj2edit.comments+'</textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Editar Participante",form_html,accept_function,cancel_function);
};


var show_results=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
	canvas_zone_vcentered.innerHTML=' \
	    <button id="summary_view" class="button">Todos</button><br /> \
	    <button id="explore_results" class="button">Solo '+session_data.subject+'</button><br /> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    document.getElementById("explore_results").addEventListener(clickOrTouch,function(){explore_results();});
    document.getElementById("summary_view").addEventListener(clickOrTouch,function(){summary_view();});
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}



var reset_session=function(){
    session_data.num_correct=0;
    session_data.num_answered=0;
    session_data.result=0;
    session_data.duration=0;
    session_data.details=[];
    activity_timer.reset(); // also stops the timer
}


var game=function(){
    remove_modal(); // for safety...
    if(debug){console.log('game-called - game-mode? '+game_mode);}
    if(objectLength(cache_user_subjects)==0){
        open_js_modal_alert('Info', 'Debe crear al menos un participante.<br/>Participantes -> Añadir');
        return;
    }
    // CANNOT be here, in game-mode no clicks yet---------------------------
    //if(!check_if_sounds_loaded(memoria)){return;}
    // ---------------------------------------------------------------------- 
    // send data if seesion.mode is training
    if(session_data.mode=="training" && !game_mode && session_data.duration!=0){send_session_data(game);return;}
    //reset game variables --------
    reset_session();
    //-----------------------------
	var extra_options="";
	if(!game_mode){
        extra_options='<br /><button id="go_back_button" class="minibutton fixed-bottom-right go-back">&larr;</button>';
        header_text.innerHTML=' &larr; '+app_name+' menu';
    }
    canvas_zone_vcentered.innerHTML=' \
    <br /><button id="conciencia" class="button">Conciencia</button> \
    <br /><button id="memoria_visual" class="button">Memoria Visual</button> \
    <br /><button id="ritmo" class="button">Ritmo</button> \
    <br /><button id="velocidad" class="button">Velocidad</button> \
    <br /><button id="discr_visual" class="button">Discr. Visual</button> \
	<br /><button id="completo" class="button">COMPLETO</button>\
    '+extra_options+'\
    ';
    
    document.getElementById("completo").addEventListener(clickOrTouch,function(){completo();});
    document.getElementById("conciencia").addEventListener(clickOrTouch,function(){conciencia();});
    document.getElementById("memoria_visual").addEventListener(clickOrTouch,function(){memoria_visual();});
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
			var audio_sprite_object=media_objects.sounds[audio_sprite_name];
			audio_sprite=new AudioSprite(audio_sprite_object,audio_object_sprite_ref,debug);
			audio_sprite.playSpriteRange('zsilence_start',callback);
            return false;
		}else{
            return true;
		}
	}
}











function send_session_data(finish_callback){
    remove_modal();
	if(!game_mode){
		if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
        if(debug) console.log(JSON.stringify(session_data));
        if(user_data.email=='invitee'){
            if(session_data.mode=="test"){
                var result_obj={
                        id:""+(cache_user_subject_results[session_data.subject].elements.length+1),
                        subject: session_data.subject,
                        type:session_data.type,
                        mode:session_data.mode,
                        age: session_data.age,
                        num_answered:session_data.num_answered,
                        num_correct:session_data.num_correct,
                        result:session_data.result,
                        level:session_data.level,
                        duration:session_data.duration,
                        timestamp:session_data.timestamp,
                        details: session_data.details
                    };
                cache_user_subject_results[session_data.subject].elements.push(result_obj);
                cache_user_subject_result_detail[result_obj.id]={general: {
                                                                    session: result_obj.id
                                                                } ,
                                                                 elements: result_obj.details};
                var found_in_summary=false;
                for(var i=0;i<cache_user_summary_view.elements.length;i++){
                    if(cache_user_summary_view.elements[i].subject==session_data.subject){
                        cache_user_summary_view.elements[i][session_data.type]=session_data.num_correct+"/"+session_data.num_answered;
                        found_in_summary=true;
                    }
                }
                if(!found_in_summary){
                    var sum_res={
                            "subject" : session_data.subject,
                            "conciencia" : "-",
                            "memoria_visual": "-",
                            "ritmo" : "-",
                            "velocidad" : "-",
                            "discr_visual" : "-",
                            "timestamp" : session_data.timestamp
                        };
                    sum_res[session_data.type]=session_data.num_correct+"/"+session_data.num_answered;
                    cache_user_summary_view.elements.push(sum_res);
                }
                canvas_zone_vcentered.innerHTML='<br />Resultados guardados  "invitado"<br /><br />\
                <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>';
            }else{
                canvas_zone_vcentered.innerHTML='<br />cargando menú...<br /><br />\
                <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>';
            }
            document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
        }else{
            var xhr = new XMLHttpRequest();
            xhr.open("POST", backend_url+'ajaxdb.php',true); //"http://www.centroafan.com/afan-app/www/"+
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.responsetype="json";
            xhr.send("action=send_session_data_post&json_string="+(JSON.stringify(session_data))); 
            canvas_zone_vcentered.innerHTML='<br />...Enviando datos al servidor...<br /><br />';
            xhr.onload = function () {
                var data=JSON.parse(this.responseText);
                canvas_zone_vcentered.innerHTML='<br />Datos guardados en el servidor.<br /><br />\
                <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>';
                document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
                delete cache_user_subject_results[session_data.subject];
                cache_user_summary_view={};
                if(debug) console.log('Storing data. Server message: '+data.msg);
            };
        }
    }
    reset_session();
    if(typeof(finish_callback)!='undefined'){finish_callback();}
    else{game();}
}

