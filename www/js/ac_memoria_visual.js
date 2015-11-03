"use strict";

var memoria_visual_help_title='Memoria Visual';
var memoria_visual_help='\
    en construcción en construcción <br />en construcción <br />en construcción <br />\
    en construcción <br />en construcción en construcción <br />en construcción <br />\
';

var memoria_visual=function(){
	remove_modal();
	session_data.type="memoria_visual";
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

	if(current_activity_memory_level_passed_times==0 && current_activity_memory_level==1){
        activity_timer.reset();
		session_data.num_correct=0;
		session_data.num_answered=MAX_MEMORY_LEVELS; // *2
		session_data.duration=0;
		session_data.details=[];
		var timestamp=new Date();
		session_data.timestamp=timestamp.getFullYear()+"-"+
			pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
			 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0");
	}
    
	current_activity_memory_uncovered=0;

	var sprite_images=wordimage_image_ref; //['pato','gato','sol','pez','tren','sal','col','reja','oreja','koala','bala','ala'];
	current_activity_memory_options = random_array(sprite_images,9);
	console.log(current_activity_memory_options);

	// elegir n imagenes segun el nivel alcanzado (sin repetidos)
	current_activity_memory_pattern = random_array(current_activity_memory_options,current_activity_memory_level);
	console.log(current_activity_memory_pattern);



	// mostrar tapadas e ir abriendo en intervalos de 2 segundos
	memoria_visual_show_pattern();

}

var memoria_visual_show_pattern=function(){
	// TODO instead of passing global varialbes create objects for each game
	//      and then use this and .bind(this) for timeouts...
    //      a better encapsulation
	
	// TODO with a for loop create the divs...
	var pattern_representation="";
	for(var i=0;i<current_activity_memory_pattern.length;i++){
		pattern_representation+='<div class="membox"><div class="wordimage wordimage-'+current_activity_memory_pattern[i]+' covered"></div></div>';
	}
	canvas_zone_vcentered.innerHTML='\
			<div id="xx">\
			'+pattern_representation+'\
			</div>\
		  <button id="playb" class="button">PLAY</button>\
        <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right">Volver</button> \
	';
    document.getElementById("playb").addEventListener(clickOrTouch,function(){memoria_visual_uncover_next();});
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){open_js_modal_alert(memoria_visual_help_title,memoria_visual_help);});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();});
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
        <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right">Volver</button> \
    ';
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){open_js_modal_alert(memoria_visual_help_title,memoria_visual_help);});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();});
    var boxes=document.getElementsByClassName("wordimage");
    for(var i=0;i<boxes.length;i++){
        boxes[i].addEventListener(clickOrTouch,function(){
            memoria_visual_check_click(this);
            });
    }
}


var memoria_visual_check_click=function (element){
	if(element.className.indexOf('covered')!=-1){ alert("covered"); return;} // already covered
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
        var the_content='<h1>...siguiente actividad...</h1>';
        if(current_activity_memory_already_incorrect==false){
            if(session_data.mode!="test"){
                audio_sprite.playSpriteRange("zfx_correct");
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
            }
            open_js_modal_content(the_content);
            session_data.num_correct++;
            if(current_activity_memory_level>=MAX_MEMORY_LEVELS){
                console.log('Has superado el juego!'); // debe ser un modal
                current_activity_memory_level=1;
                current_activity_played_times=0;
                current_activity_memory_level_passed_times=0;
                if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
                if(session_data.mode=="test" && !game_mode) setTimeout(function(){send_session_data();}, 2000);
                else setTimeout(function(){game();}, 2000);
            }else{
                current_activity_memory_level_passed_times++;
                //if((session_data.mode=="test" && !game_mode && current_activity_memory_level_passed_times>=2) || (session_data.mode!="test" || game_mode) ){
                    console.log('siguiente nivel...'); // debe ser un modal
                    current_activity_memory_level_passed_times=0;
                    current_activity_memory_level++;
                //}
                current_activity_played_times=0;
                setTimeout(function(){memoria_visual();}, 2000);
            }
        }else{
            current_activity_memory_already_incorrect=false;
            if(session_data.mode!="test"){
                audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';
            }
            open_js_modal_content(the_content);
            current_activity_played_times++;
            if( (session_data.mode=="test" && !game_mode && current_activity_played_times>=MAX_PLAYS)  || ( (session_data.mode!="test" || game_mode) && current_activity_played_times>=10)){
                console.log('incorrect memory...');
                current_activity_memory_level=1;
                current_activity_played_times=0;
                current_activity_memory_level_passed_times=0;
                console.log('Ooooh! :( Has fallado dos veces. Fin del juego.'); // should be a modal
                if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
                if(session_data.mode=="test" && !game_mode) setTimeout(function(){send_session_data();}, 2000);
                else setTimeout(function(){game();}, 2000);
            }else{
                setTimeout(function(){memoria_visual();}, 2000);
            }
        }
    }
}
