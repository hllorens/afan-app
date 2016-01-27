"use strict";


var ritmo_obj=new Activity('Ritmo','ritmo','start_activity');
ritmo_obj.help_text='Escucha la secuencia. Después tendrás que reproducirla.';
ritmo_obj.MAX_LEVELS=6;
ritmo_obj.MAX_PLAYED_TIMES=1000; // game mode 1000=infinity
ritmo_obj.MAX_FAILED_TIMES_TEST=2;

/*
Like in memory
It starts with a pattern of 1 and goes up to 6
The user first hears the sound pattern (buttons dissabled)
Then 2 buttons . short and ___ long become enabled and the user can click them n times (the number of reproduced sounds)
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
    ritmo_obj.started=false;
    ritmo_obj.current_key_answer=ritmo_obj.generate_pattern(ritmo_obj.level);
    canvas_zone_vcentered.innerHTML='\
        <div id="hinttext">Pulsa para escuchar los sonidos</div>\
        <div style="min-height:52px;"></div> \
        <div style="min-height:52px;"></div>\
        <button id="pta" class="button button-fat" onclick="ritmo_obj.play_ta()">.</button>\
        <button id="ptaa" class="button button-fat" onclick="ritmo_obj.play_taa()">___</button>\
        <br /><button id="ac_check" class="button button-long button-hidden" disabled="disabled">¡Empezar!</button>\
        ';//+ritmo_obj.current_key_answer;
    ritmo_obj.add_buttons(canvas_zone_vcentered);
    ritmo_obj.hinttext=document.getElementById('hinttext');
    ritmo_obj.ta_played_once=false;
    ritmo_obj.taa_played_once=false;
    ritmo_obj.both_played_once=false;
    document.getElementById("ac_check").addEventListener(clickOrTouch,function(){ritmo_obj.start();});
}

ritmo_obj.start_activity=function(){
    if(ritmo_obj.level>ritmo_obj.MAX_LEVELS || (session_data.mode=="test" && !game_mode && ritmo_obj.failed_times>=ritmo_obj.MAX_FAILED_TIMES_TEST)  
        || ( (session_data.mode!="test" || game_mode) && ritmo_obj.played_times>=ritmo_obj.MAX_PLAYED_TIMES)){
	    session_data.num_answered=ritmo_obj.MAX_LEVELS;
		ritmo_obj.finish();
    }else{
        //if(session_data.mode=="test" && this.played_times==this.MAX_PLAYED_TIMES_TEST_DRY) ritmo_obj.level=1; auto in common
        ritmo_obj.started=true;
        ritmo_obj.current_key_answer=ritmo_obj.generate_pattern(ritmo_obj.level);
        canvas_zone_vcentered.innerHTML='\
            <div id="hinttext">Pulsa PLAY para escuchar secuencia</div>\
            <div id="sound"><button id="playb" class="button">PLAY</button></div> \
            <div style="border:0px dotted #eee;min-height:52px;"><span id="anspan">&nbsp;</span></div>  \
            <button id="pta" class="button button-fat button-hidden" disabled="disabled" onclick="ritmo_obj.play_ta()">.</button>\
            <button id="ptaa" class="button button-fat button-hidden" disabled="disabled" onclick="ritmo_obj.play_taa()">___</button>\
            <br /><br /><button id="ac_check" class="button button-hidden" disabled="disabled">¡Hecho!</button> <button id="borrarb" class="button backgroundRed button-hidden" disabled="disabled">borrar</button>\
         ';//+ritmo_obj.current_key_answer;
        ritmo_obj.add_buttons(canvas_zone_vcentered);
        ritmo_obj.playb=document.getElementById('playb');
        ritmo_obj.hinttext=document.getElementById('hinttext');
        if(session_data.mode=="test" && ritmo_obj.played_times<ritmo_obj.MAX_PLAYED_TIMES_TEST_DRY){
            ritmo_obj.hinttext.innerHTML="[ENTRENA] "+ritmo_obj.hinttext.innerHTML;
        }
        ritmo_obj.anspan=document.getElementById('anspan');
        ritmo_obj.borrarb=document.getElementById('borrarb');
        ritmo_obj.playb.addEventListener(clickOrTouch,function(){ritmo_obj.play_pattern();});
        ritmo_obj.borrarb.addEventListener(clickOrTouch,function(){ritmo_obj.borrar();});
        document.getElementById("ac_check").addEventListener(clickOrTouch,function(){ritmo_obj.check();});
    }
}

ritmo_obj.borrar=function(){
    if(ritmo_obj.current_usr_answer.length==0) return;
    //var item=ritmo_obj.anspan.lastElementChild;
    //ritmo_obj.anspan.removeChild(item);
    ritmo_obj.current_usr_answer=[]; //.pop();
    if(ritmo_obj.current_usr_answer.length==0){
        ritmo_obj.borrarb.classList.add('button-hidden');
        ritmo_obj.borrarb.disabled=true;
    }
}


ritmo_obj.play_pattern=function(){
    ac_in_process=true;
    if(session_data.mode=="test"){
        ritmo_obj.playb.classList.add('button-hidden');
        ritmo_obj.playb.disabled=true;
    }
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
    ac_in_process=false;
    ritmo_obj.borrar();
    document.getElementById("pta").disabled=false;
    document.getElementById("ptaa").disabled=false;
    document.getElementById("ac_check").disabled=false;
    document.getElementById("pta").classList.remove('button-hidden');
    document.getElementById("ptaa").classList.remove('button-hidden');
    document.getElementById("ac_check").classList.remove('button-hidden');
    ritmo_obj.hinttext.innerHTML='¿qué has escuchado?';
    if(session_data.mode=="test" && ritmo_obj.played_times<ritmo_obj.MAX_PLAYED_TIMES_TEST_DRY){
        ritmo_obj.hinttext.innerHTML="[ENTRENA] "+ritmo_obj.hinttext.innerHTML;
    }
    activity_timer.reset();
    activity_timer.start();
}


ritmo_obj.play_ta=function(){
    ritmo_obj.play_sound('ta35.m4a');
    if(!ritmo_obj.both_played_once){
        ritmo_obj.ta_played_once=true;
        //document.getElementById("pta").classList.add('button-hidden');
        //document.getElementById("pta").disabled=true;
    }
}
ritmo_obj.play_taa=function(){
    ritmo_obj.play_sound('ta150.m4a');
    if(!ritmo_obj.both_played_once){
        ritmo_obj.taa_played_once=true;
        //document.getElementById("ptaa").classList.add('button-hidden');
        //document.getElementById("ptaa").disabled=true;
    }
}

ritmo_obj.play_sound=function(s){
    ac_in_process=true;
    if(ritmo_obj.started){
        /*document.getElementById("ac_check").classList.add('button-hidden');
        document.getElementById("pta").classList.add('button-hidden');
        document.getElementById("ptaa").classList.add('button-hidden');*/
        document.getElementById("pta").disabled=true;
        document.getElementById("ptaa").disabled=true;
        document.getElementById("ac_check").disabled=true;
        ritmo_obj.current_usr_answer.push(s);
        var symbol=".";
        if(s=="ta150.m4a") symbol="___";
        //ritmo_obj.anspan.innerHTML+=' <button class="button button-flat">'+symbol+'</div>';
        if(ritmo_obj.current_usr_answer.length>0){
            ritmo_obj.borrarb.disabled=true;
            //ritmo_obj.borrarb.classList.add('button-hidden');
        }
    }
	AudioLib.play_sound_single(s,ritmo_obj.play_sound_end);
}

ritmo_obj.play_sound_end=function(){
    ac_in_process=false;
	if(!ritmo_obj.ta_played_once || !ritmo_obj.taa_played_once){
        return;
	}else if(!ritmo_obj.both_played_once && ritmo_obj.ta_played_once && ritmo_obj.taa_played_once){
        ritmo_obj.both_played_once=true;
        document.getElementById("ac_check").disabled=false;
        document.getElementById("ac_check").classList.remove('button-hidden');
        ritmo_obj.hinttext.innerHTML="Pulsa Empezar";
	}else{
        document.getElementById("pta").disabled=false;
        document.getElementById("ptaa").disabled=false;
        document.getElementById("ac_check").disabled=false;
        /*document.getElementById("pta").classList.remove('button-hidden');
        document.getElementById("ptaa").classList.remove('button-hidden');
        document.getElementById("ac_check").classList.remove('button-hidden');*/
        if(ritmo_obj.current_usr_answer.length>0){
            ritmo_obj.borrarb.disabled=false;
            ritmo_obj.borrarb.classList.remove('button-hidden');
        }
        if(ritmo_obj.current_usr_answer.length>ritmo_obj.MAX_LEVELS) ritmo_obj.check();
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
	ritmo_obj.end(ritmo_obj.details.result);

}




