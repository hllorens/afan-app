"use strict";


var acMemAud=function(){
    this.ac=new Activity('Memoria Auditiva','memoria_auditiva','start_activity');
    this.ac.help_text='Intenta memorizar las sílabas que vas a escuchar. Después tendrás que localizarlas respetando el orden en que las escuchaste.';
    var that=this;
}

var memoria_auditiva=function(){
    if(!check_if_sounds_loaded(function(){conciencia(finish_callback);})){return;}
    preventBackExit();
    var memaud_obj=new acMemAud();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    memaud_obj.ac.finish_callback=finish_callback;
    canvas_zone_vcentered.innerHTML=' \
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
    memaud_obj.ac.add_buttons(canvas_zone_vcentered);
    //memaud_obj.ac.start();
}

