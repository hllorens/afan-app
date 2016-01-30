"use strict";


var acMemAud=function(){
    this.ac=new Activity('Memoria Auditiva','memoria_auditiva','start_activity');
    this.ac.help_text='Intenta memorizar las sílabas que vas a escuchar. Después tendrás que localizarlas respetando el orden en que las escuchaste.';
    var that=this;
    this.ac.start_activity=function(){
      canvas_zone_vcentered.innerHTML=' \
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
        that.ac.add_buttons(canvas_zone_vcentered);
    }
}

var memoria_auditiva=function(finish_callback){
    var memaud_obj=new acMemAud();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    memaud_obj.ac.finish_callback=finish_callback;
    memaud_obj.ac.start();
}

