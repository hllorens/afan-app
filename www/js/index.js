// Check for media needs
if(typeof images === 'undefined'){var images = [];}
if(typeof sounds === 'undefined'){var sounds = [];}

// Check for debug mode
var QueryString=get_query_string();
var debug=false; // set to true for debug apk
var user_bypass=undefined;
if(QueryString.hasOwnProperty('debug') && QueryString.debug=='true') debug=true;
if(QueryString.hasOwnProperty('user') && QueryString.user!='') user_bypass=QueryString.user;

// responsive tunings
prevent_scrolling();
var splash=document.getElementById("splash_screen");
var is_app=is_cordova();
var forced_no_lazy=false;
if(is_app){
    splash.innerHTML="is application"
    if(debug) alert("is app");
    if (!window.cordova) alert("ERROR: Running cordova without including cordova.js!");
    let r=true;
    splash.innerHTML="is app and has cordova.js loaded"
    if(debug) r = confirm("Proceed as app (otherwise browser setup will be used)");
    if (r == true) {
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        is_app=false;
        forced_no_lazy=true;
        ResourceLoader.is_iOS=false;
        onDeviceReady();
    }
}else{
    if(debug) alert("not app")
	onDeviceReady();
}

function onDeviceReady() {
    if(debug) alert("ready");
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

/*
// ADD google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','analytics.js','ga');


// REMOVE IF CAUSES PROBLEMS 
if(window.localStorage) {
    ga('create', 'UA-3106165-3', {
      'storage': 'none'
      , 'clientId': window.localStorage.getItem('ga_clientId')  //The tracker id obtained from local storage
    });
    ga(function(tracker) {
      window.localStorage.setItem('ga_clientId', tracker.get('clientId'));
     //The tracker id for each device is different and stored in local storage
    });
}
else {
    ga('create', 'UA-3106165-3', 'auto');
}
ga('set','checkProtocolTask',null); //checkProtocal Task is set to null so that GA allows tracking other than http/https 
ga('set', 'page', "afan_restart"); //Page Name is name of each html page
ga('send', 'pageview');
*/
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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
	if(debug) alert("win.onload");
	//var splash=document.getElementById("splash_screen");
	//if(splash!=null && (ResourceLoader.lazy_audio==false || ResourceLoader.not_loaded['sounds'].length==0)){ splash.parentNode.removeChild(splash); }
}
