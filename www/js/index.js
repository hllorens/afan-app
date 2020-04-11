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

var is_app=is_cordova();
var forced_no_lazy=false;
if(is_app){
    alert("is app");
    if (!window.cordova) alert("ERROR: Running cordova without including cordova.js!");
    var r = confirm("Proceed as app (otherwise browser setup will be used)");
    if (r == true) {
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        is_app=false;
        forced_no_lazy=true;
        ResourceLoader.is_iOS=false;
        onDeviceReady();
    } 
}else{
	onDeviceReady();
}

function onDeviceReady() {
	device_info="browser"
	/*if(is_app){
		device_info = 'name='     + device.name     + '-' + 
                        'PhoneGap=' + device.phonegap + '-' + 
                        'Platform=' + device.platform + '-' + 
                        'UUID='     + device.uuid     + '-' + 
                        'Ver='  + device.version 
                        ; 
                        // remove if this fails, might need cordova plugin add cordova-plugin-network-information
                        //+ '-' + 
                        //'Online='  + (navigator.connection.type == Connection.NONE) needs plugin
	}*/
	splash_screen();
}

function splash_screen(){
	// the default index.html might contain splash screen directly (more efficient)
   //                                                                                       lazy  debug
   if(!forced_no_lazy)	ResourceLoader.load_media(images,sounds,jsons,check_internet_access,true,debug); 
   else       ResourceLoader.load_media(images,sounds,jsons,check_internet_access,false,true);
}

// IMPORTANT: this should wait for all resources, even the jsons requested in js
//            but it is proven false at least when a resource is not found
//            Also this removed splash too early on those cases...
window.onload = function () { 
	if(debug) console.log("win.onload");
	//var splash=document.getElementById("splash_screen");
	//if(splash!=null && (ResourceLoader.lazy_audio==false || ResourceLoader.not_loaded['sounds'].length==0)){ splash.parentNode.removeChild(splash); }
}
