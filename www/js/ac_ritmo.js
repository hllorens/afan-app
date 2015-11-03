"use strict";

var ritmo_help_title='Ritmo';
var ritmo_help='en construcción';


var ritmo=function(){
    if(!check_if_sounds_loaded(ritmo)){return;}
	preventBackExit();
    remove_modal();
	session_data.type="ritmo";
	canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        <button class="minibutton fixed-bottom-left help" onclick="open_js_modal_alert(ritmo_help_title,ritmo_help)">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right" onclick="game()">Volver</button> \
    ';
}

