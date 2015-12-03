"use strict";

var memaud_obj=new Activity('Memoria Auditiva','memoria_auditiva','show_matrix');
memaud_obj.help_text='\
    Intenta memorizar las sílabas que vas a escuchar. Después tendrás que localizarlas respetando el orden en que las escuchaste.\
';

var memoria_auditiva=function(){
    canvas_zone_vcentered.innerHTML=' \
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
    memaud_obj.add_buttons(canvas_zone_vcentered);
    //memaud_obj.start();
}

memaud_obj.show_matrix=function(){
}