"use strict";


var memvis_obj=new Activity('Memoria Visual','memoria_visual','start_activity');
memvis_obj.help_text='\
    Intenta memorizar estas imágenes. Después tendrás que localizarlas respetando el orden en que fueron presentadas.\
';

var memoria_visual=function(){
	/** Se presentan imágenes al usuario que se van abriendo y tapando como cartas
	 ** Luego desaparecen, y salen 9 opciones a ordenar
	 ** Se inicia con una carta y se va incrementando hasta 7
	 ** NO SE ADMITE REPETIDOS de manera q cuando hace click en una imágen esta
	 ** Se queda marcada y no se puede hacer click (no superponer numeros pq puede distraer, solo ensombrecer)
     ** CADA iteración el LA SECUENCIA PUEDE CAMBIAR (aunque dificulte la memorización)
     ** CADA iteración el CONJUNTO DE IMG PUEDE CAMBIAR (aunque dificulte la memorización)
     ** SI FALLA, TIENE UN INTENTO MÁS (SIN PENALIZACIÓN) EN EL MISMO NIVEL
	 ** SI FALLA 2 VECES SEGUIDAS EN EL MISMO NIVEL (FIN DEL JUEGO)
     ** LA INFORMACIÓN QUE SE GUARDA ES LA CANTIDAD DE ELEMENTOS QUE HA PODIDO RECORDAR
     ** Y EL TIEMPO, ETC...
	*/

	// elegir 9 imagenes de forma aleatoria (sin repetidos)
	// TODO donde saco el wordlist? del sprite del css?




    session_data.num_answered=MAX_MEMORY_LEVELS; // *2
	// mostrar tapadas e ir abriendo en intervalos de 2 segundos
	memvis_obj.start();

}


memvis_obj.start_activity=function(){
	// TODO instead of passing global varialbes create objects for each game
	//      and then use this and .bind(this) for timeouts...
    //      a better encapsulation
    if(current_activity_memory_level>MAX_MEMORY_LEVELS || (session_data.mode=="test" && !game_mode && current_activity_played_times>=MAX_PLAYS)  || ( (session_data.mode!="test" || game_mode) && current_activity_played_times>=10)){
		memvis_obj.finish();
    }else{
        current_activity_memory_uncovered=0;
        var sprite_images=wordimage_image_ref; //['pato','gato','sol','pez','tren','sal','col','reja','oreja','koala','bala','ala'];
        current_activity_memory_options = random_array(sprite_images,9);
        if(debug) console.log(current_activity_memory_options);

        // elegir n imagenes segun el nivel alcanzado (sin repetidos)
        current_activity_memory_pattern = random_array(current_activity_memory_options,current_activity_memory_level);
        if(debug) console.log(current_activity_memory_pattern);
        
        var pattern_representation="";
        for(var i=0;i<current_activity_memory_pattern.length;i++){
            pattern_representation+='<div class="membox"><div class="wordimage wordimage-'+current_activity_memory_pattern[i]+' covered"></div></div>';
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
	if(current_activity_memory_uncovered==current_activity_memory_pattern.length){
		current_activity_memory_uncovered=0;
		setTimeout(function(){memoria_visual_find_pattern();}, 4000);
	}else{	//uncover...
		var covered_div=document.getElementById('xx').children[current_activity_memory_uncovered].children[0];
		covered_div.classList.remove('covered');
		current_activity_memory_uncovered++;
		setTimeout(function(){memoria_visual_uncover_next()}, 2600);
	}
}

var memoria_visual_find_pattern=function(){
    activity_timer.reset();
    activity_timer.start();
    canvas_zone_vcentered.innerHTML='\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[0]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[1]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[2]+'"></div></div>\
            </div>\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[3]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[4]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[5]+'"></div></div>\
            </div>\
            <div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[6]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[7]+'"></div></div>\
                <div class="membox"><div class="wordimage wordimage-'+current_activity_memory_options[8]+'"></div></div>\
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
    activity_timer.stop();
    session_data.duration+=activity_timer.seconds;
    activity_timer.reset();    
	var clicked_element=element.classList[1].split("-")[1];
    
	if(clicked_element!=current_activity_memory_pattern[current_activity_memory_uncovered]){
        current_activity_memory_already_incorrect=true;
    }
    current_activity_memory_uncovered++;
    element.classList.add('covered');
    
    if(current_activity_memory_uncovered==current_activity_memory_pattern.length){
        memvis_obj.details={};
        if(current_activity_memory_already_incorrect==false){
            memvis_obj.details.result="correct";
            session_data.num_correct++;
            current_activity_memory_level_passed_times++;
            //if((session_data.mode=="test" && !game_mode && current_activity_memory_level_passed_times>=2) || (session_data.mode!="test" || game_mode) ){
                console.log('siguiente nivel...'); // debe ser un modal
                current_activity_memory_level_passed_times=0;
                current_activity_memory_level++;
            //}
        }else{
            memvis_obj.details.result="incorrect";
            current_activity_memory_already_incorrect=false;
            current_activity_played_times++;
        }
        memvis_obj.end(memvis_obj.details.result);
    }
}
