"use strict";

var memoria_auditiva_help_title='Memoria Auditiva';
var memoria_auditiva_help='\
    Intenta memorizar las sílabas que vas a escuchar. Después tendrás que localizarlas respetando el orden en que las escuchaste.\
';


var memoria_auditiva=function(){
	remove_modal();
	session_data.type="memoria_auditiva";
	canvas_zone_vcentered.innerHTML=' \
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){open_js_modal_alert(memoria_auditiva_help_title,memoria_auditiva_help);});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();});   
}
