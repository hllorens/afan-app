"use strict";


var ritmo_obj=new Activity('Ritmo','ritmo','start_activity');
ritmo_obj.help_text='Escucha la secuencia. Después tendrás que reproducirla.';
ritmo_obj.MAX_LEVELS=6;
ritmo_obj.MAX_PLAYED_TIMES=10;
ritmo_obj.MAX_FAILED_TIMES_TEST=2;

/*
Like in memory
It starts with a pattern of 1 and goes up to 6
The user first hears the sound pattern (buttons dissabled)
Then 2 buttons . short and __ long become enabled and the user can click them n times (the number of reproduced sounds)
Same behaviour as the memory game

*/

//ritmo_obj.current_sound="";
//ritmo_obj.current_position=0;


var ritmo=function(finish_callback){
    if(!check_if_sounds_loaded(function(){ritmo(finish_callback);})){return;}
    AudioLib.init(media_objects.sounds,debug);
    preventBackExit();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    ritmo_obj.finish_callback=finish_callback;
    ritmo_obj.current_key_answer="";
    ritmo_obj.current_usr_answer=[];
    ritmo_obj.played_times=0;
    ritmo_obj.failed_times=0;
    ritmo_obj.level=1;
        ritmo_obj.current_key_answer=ritmo_obj.generate_pattern(ritmo_obj.level);
        canvas_zone_vcentered.innerHTML='\
            <div class="text-center montessori-div">\
            <p id="montessori-p-text" class="montessori">Pulsa para escuchar los sonidos</p>\
            </div>\
            <button id="pta" class="button" onclick="ritmo_obj.play_ta()">.</button>\
            <button id="ptaa" class="button" onclick="ritmo_obj.play_taa()">___</button>\
            ';//+ritmo_obj.current_key_answer;
        ritmo_obj.add_buttons(canvas_zone_vcentered);
        ritmo_obj.montessori_p_text=document.getElementById('montessori-p-text');
        ritmo_obj.ta_played_once=false;
        ritmo_obj.taa_played_once=false;
        ritmo_obj.both_played_once=false;
}


ritmo_obj.start_activity=function(){
    if(ritmo_obj.level>ritmo_obj.MAX_LEVELS || (session_data.mode=="test" && !game_mode && ritmo_obj.failed_times>=ritmo_obj.MAX_FAILED_TIMES_TEST)  
        || ( (session_data.mode!="test" || game_mode) && ritmo_obj.played_times>=ritmo_obj.MAX_PLAYED_TIMES)){
	    session_data.num_answered=ritmo_obj.MAX_LEVELS;
		ritmo_obj.finish();
    }else{
        ritmo_obj.current_key_answer=ritmo_obj.generate_pattern(ritmo_obj.level);
        canvas_zone_vcentered.innerHTML='\
            <div id="sound"><button id="playb" class="button">PLAY</button></div> \
            <div class="text-center montessori-div">\
            <p id="montessori-p-text" class="montessori">Pulsa play para escuchar</p>\
            </div>\
            <button id="pta" class="button" disabled="disabled" onclick="ritmo_obj.play_ta()">.</button>\
            <button id="ptaa" class="button" disabled="disabled" onclick="ritmo_obj.play_taa()">___</button>\
            ';//+ritmo_obj.current_key_answer;
        ritmo_obj.add_buttons(canvas_zone_vcentered);
        ritmo_obj.playb=document.getElementById('playb');
        ritmo_obj.montessori_p_text=document.getElementById('montessori-p-text');
        ritmo_obj.playb.addEventListener(clickOrTouch,function(){ritmo_obj.play_pattern();});
    }
}

ritmo_obj.play_pattern=function(){
    ritmo_obj.playb.disabled=true;
    AudioLib.play_sound_arr(ritmo_obj.current_key_answer,ritmo_obj.play_pattern_ended);
}

ritmo_obj.generate_pattern=function(length){
	var pat=[];
	for(var i=0;i<length;i++){
		pat.push((Math.random() <0.5 ? "ta35.m4a" : "ta150.m4a"));
	}
	if(debug) console.log(pat);
	return pat;
}

ritmo_obj.play_pattern_ended=function(){
	ritmo_obj.current_usr_answer=[];
	document.getElementById("pta").disabled=false;
	document.getElementById("ptaa").disabled=false;
    ritmo_obj.montessori_p_text.innerHTML='¿qué has escuchado?';
    activity_timer.reset();
    activity_timer.start();
}


ritmo_obj.play_ta=function(){
    ritmo_obj.play_sound('ta35.m4a');
    if(!ritmo_obj.both_played_once){
        ritmo_obj.ta_played_once=true;
        document.getElementById("pta").disabled=true;
    }
}
ritmo_obj.play_taa=function(){
    ritmo_obj.play_sound('ta150.m4a');
    if(!ritmo_obj.both_played_once){
        ritmo_obj.taa_played_once=true;
        document.getElementById("ptaa").disabled=true;
    }
}

ritmo_obj.play_sound=function(s){
    if(ritmo_obj.both_played_once){
        document.getElementById("pta").disabled=true;
        document.getElementById("ptaa").disabled=true;
        ritmo_obj.current_usr_answer.push(s);
    }
	AudioLib.play_sound_single(s,ritmo_obj.play_sound_end);
}

ritmo_obj.play_sound_end=function(){
	if(!ritmo_obj.ta_played_once || !ritmo_obj.taa_played_once){
        return;
	}else if(!ritmo_obj.both_played_once && ritmo_obj.ta_played_once && ritmo_obj.taa_played_once){
         ritmo_obj.both_played_once=true;
         //ritmo_obj.ta_played_once=false;ritmo_obj.taa_played_once=false;
         ritmo_obj.start();
    }else if(ritmo_obj.both_played_once && ritmo_obj.current_usr_answer.length>=ritmo_obj.current_key_answer.length){
		ritmo_obj.check();
	}else{
        document.getElementById("pta").disabled=false;
        document.getElementById("ptaa").disabled=false;
    }
}

ritmo_obj.check=function(){
    ritmo_obj.details={};
    ritmo_obj.details.activity=ritmo_obj.current_key_answer.toString();
    ritmo_obj.details.choice=ritmo_obj.current_usr_answer.toString();
	console.log(ritmo_obj.details.activity+" vs "+ritmo_obj.details.choice);
	if(ritmo_obj.details.activity==ritmo_obj.details.choice){
		ritmo_obj.details.result="correct";
        session_data.num_correct++;
        ritmo_obj.level_played_times=0;
        ritmo_obj.level++;
	}else{
		ritmo_obj.details.result="incorrect";
		ritmo_obj.failed_times++;
	}
    ritmo_obj.level_played_times++;
    ritmo_obj.played_times++;
	ritmo_obj.end(ritmo_obj.details.result);

}




