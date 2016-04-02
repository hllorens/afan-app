// Check for media needs
if(typeof images === 'undefined'){var images = [];}
if(typeof sounds === 'undefined'){var sounds = [];}

// Check for debug mode
var QueryString=get_query_string();
var debug=false;
var user_bypass=undefined;
if(QueryString.hasOwnProperty('debug') && QueryString.debug=='true') debug=true;
if(QueryString.hasOwnProperty('user') && QueryString.user!='') user_bypass=QueryString.user;

// responsive tunings
prevent_scrolling();

// variables
var exit_url="http://www.centroafan.com";
var backend_url='backend/' //../backend




var is_app=is_cordova();
if(is_app){
    alert("is app");
	document.addEventListener('deviceready', onDeviceReady, false);
    backend_url='http://www.centroafan.com/afan-app/www/backend/';
}else{
	onDeviceReady();
}



var exit_app=function(){
		if(is_cordova()){
			navigator.app.exitApp();
		}else{
			location.href = exit_url;
		}
}

function onDeviceReady() {
	device_info="browser"
	if(is_app){
		device_info = 'name='     + device.name     + '-' + 
                        'PhoneGap=' + device.phonegap + '-' + 
                        'Platform=' + device.platform + '-' + 
                        'UUID='     + device.uuid     + '-' + 
                        'Ver='  + device.version + '-' + 
                        'Online='  + (navigator.connection.type == Connection.NONE); // remove if this fails, might need cordova plugin add cordova-plugin-network-information
	}
	splash_screen();
}

function splash_screen(){
	// the default index.html might contain splash screen directly (more efficient)
	ResourceLoader.load_media(images,sounds,jsons,menu_screen,true,debug);
}
/* TODO add an argument to ResourceLoader ... json_files so it re-uses load bar etc...
function load_json_data(){
    ResourceLoader.load_json_data(json_data,menu_screen,true,debug);
}*/

// IMPORTANT: this should wait for all resources, even the jsons requested in js
//            but it is proven false at least when a resource is not found
//            Also this removed splash too early on those cases...
window.onload = function () { 
	if(debug) console.log("win.onload");
	//var splash=document.getElementById("splash_screen");
	//if(splash!=null && (ResourceLoader.lazy_audio==false || ResourceLoader.not_loaded['sounds'].length==0)){ splash.parentNode.removeChild(splash); }
}
