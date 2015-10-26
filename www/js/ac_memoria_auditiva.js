"use strict";

var memoria_auditiva=function(){
	remove_modal();
	session_data.type="memoria_auditiva";
	canvas_zone_vcentered.innerHTML=' \
	<div class="text-center montessori-div">\
	<p class="montessori">MEMORIA AUDITIVA, en construcción</p>\
	<br /><button id="go-back" onclick="game()">Volver</button> \
	</div>\
	';
}
