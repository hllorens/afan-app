"use strict";


var memvis_obj=new Activity('Memoria Visual','memoria_visual','start_activity');
memvis_obj.help_text='\
    Intenta memorizar estas imágenes. Después tendrás que localizarlas respetando el orden en que fueron presentadas.\
';

memvis_obj.MAX_LEVELS=6;
memvis_obj.MAX_PLAYED_TIMES=10;
memvis_obj.MAX_PLAYED_TIMES_TEST=2;


var memoria_visual=function(){
	/** 
	 ** NO SE ADMITE REPETIDOS de manera q cuando hace click en una imágen esta
	 ** Se queda marcada y no se puede hacer click (no superponer numeros pq puede distraer, solo ensombrecer)
     ** CADA iteración el LA SECUENCIA PUEDE CAMBIAR (aunque dificulte la memorización)
     ** CADA iteración el CONJUNTO DE IMG PUEDE CAMBIAR (aunque dificulte la memorización)
     ** SI FALLA, TIENE UN INTENTO MÁS (SIN PENALIZACIÓN) EN EL MISMO NIVEL
	 ** SI FALLA 2 VECES SEGUIDAS EN EL MISMO NIVEL (FIN DEL JUEGO)
     ** LA INFORMACIÓN QUE SE GUARDA ES LA CANTIDAD DE ELEMENTOS QUE HA PODIDO RECORDAR
	*/
    memvis_obj.played_times=0;
    memvis_obj.failed_times=0;
    memvis_obj.level=1;
    session_data.num_answered=memvis_obj.MAX_LEVELS;
	memvis_obj.start();
}


memvis_obj.start_activity=function(){
    if(memvis_obj.level>memvis_obj.MAX_LEVELS || (session_data.mode=="test" && !game_mode && memvis_obj.played_times>=memvis_obj.MAX_PLAYED_TIMES_TEST)  
        || ( (session_data.mode!="test" || game_mode) && memvis_obj.played_times>=memvis_obj.MAX_PLAYED_TIMES)){
		memvis_obj.finish();
    }else{
        memvis_obj.current_usr_answer=[];
        var sprite_images=wordimage_image_ref; //['pato','gato','sol','pez','tren','sal','col','reja','oreja','koala','bala','ala'];
        memvis_obj.options = random_array(sprite_images,9);
        if(debug) console.log(memvis_obj.options);

        // elegir n imagenes segun el nivel alcanzado (sin repetidos)
        memvis_obj.current_key_answer = random_array(memvis_obj.options,memvis_obj.level);
        memvis_obj.uncovered=0;
        if(debug) console.log(memvis_obj.current_key_answer);
        
        var pattern_representation="";
        for(var i=0;i<memvis_obj.current_key_answer.length;i++){
            pattern_representation+='<div class="membox"><div class="wordimage wordimage-'+memvis_obj.current_key_answer[i]+' covered"></div></div>';
        }
        canvas_zone_vcentered.innerHTML='\
                <div id="xx">\
                '+pattern_representation+'\
                </div>\
              <button id="playb" class="button">PLAY</button>\
        ';
        memvis_obj.add_buttons(canvas_zone_vcentered);
        document.getElementById("playb").addEventListener(clickOrTouch,function(){memoria_visual_uncover_next();});
    }
}

var memoria_visual_uncover_next=function(){
	// don't worry about recursion, all functions will end there
	document.getElementById('playb').disabled=true;
	if(memvis_obj.uncovered==memvis_obj.current_key_answer.length){
		memvis_obj.uncovered=0;
		setTimeout(function(){memoria_visual_find_pattern();}, 4000);
	}else{	//uncover...
		document.getElementById('xx').children[memvis_obj.uncovered].children[0].classList.remove('covered');
		memvis_obj.uncovered++;
		setTimeout(function(){memoria_visual_uncover_next()}, 2000);
	}
}

var memoria_visual_find_pattern=function(){
    activity_timer.reset();
    activity_timer.start();
    canvas_zone_vcentered.innerHTML='\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[0]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[1]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[2]+'"></div></div>\
            </div>\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[3]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[4]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[5]+'"></div></div>\
            </div>\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[6]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[7]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+memvis_obj.options[8]+'"></div></div>\
            </div>\
    ';
    memvis_obj.add_buttons(canvas_zone_vcentered);
    var boxes=document.getElementsByClassName("wordimage");
    for(var i=0;i<boxes.length;i++){
        boxes[i].addEventListener(clickOrTouch,function(){
            memoria_visual_check_click(this);
            });
    }
}


var memoria_visual_check_click=function (element){
	if(element.className.indexOf('covered')!=-1){ return;} // already covered
    
    memvis_obj.current_usr_answer.push(element.classList[1].split("-")[1]);
    element.classList.add('covered');
    
    if(memvis_obj.current_usr_answer.length==memvis_obj.current_key_answer.length){
        memvis_obj.details={};
        memvis_obj.details.activity=memvis_obj.current_key_answer.toString();
        memvis_obj.details.choice=memvis_obj.current_usr_answer.toString();
        if(memvis_obj.details.activity==memvis_obj.details.choice){
            memvis_obj.details.result="correct";
            session_data.num_correct++;
            //if((session_data.mode=="test" && !game_mode && memvis_obj.level_played_times>=2) || (session_data.mode!="test" || game_mode) ){
                memvis_obj.level_played_times=0;
                memvis_obj.level++;
            //}
        }else{
            memvis_obj.details.result="incorrect";
            memvis_obj.failed_times++;
        }
        memvis_obj.level_played_times++;
        memvis_obj.played_times++;
        memvis_obj.end(memvis_obj.details.result);
    }
}
