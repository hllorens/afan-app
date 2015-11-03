"use strict";

var memoria_auditiva_help_title='Memoria Auditiva';
var memoria_auditiva_help='\
    en construcción en construcción <br />en construcción <br />en construcción <br />\
    en construcción <br />en construcción en construcción <br />en construcción <br />\
';


var memoria_auditiva=function(){
	remove_modal();
	session_data.type="memoria_auditiva";
	canvas_zone_vcentered.innerHTML=' \
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        <button class="minibutton fixed-bottom-left help" onclick="open_js_modal_alert(memoria_auditiva_help_title,memoria_auditiva_help)">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right" onclick="game()">Volver</button> \
	';
}
