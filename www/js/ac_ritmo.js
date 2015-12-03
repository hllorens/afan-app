"use strict";


var ritmo_obj=new Activity('Ritmo','ritmo','ritmo_main');
ritmo_obj.help_text='Escucha la secuencia. Después tendrás que reproducirla.';


/*
Like in memory
It starts with a pattern of 1 and goes up to 6
The user first hears the sound pattern (buttons dissabled)
Then 2 buttons . short and __ long become enabled and the user can click them n times (the number of reproduced sounds)
Same behaviour as the memory game

*/

//ritmo_obj.current_sound="";
//ritmo_obj.current_position=0;
ritmo_obj.current_pat="";
ritmo_obj.answer_arr=[];

var ritmo=function(){
    if(!check_if_sounds_loaded(ritmo)){return;}
	AudioLib.init(media_objects.sounds,debug);
	preventBackExit();
	ritmo_obj.start();
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
	ritmo_obj.answer_arr=[];
	document.getElementById("pta").disabled=false;
	document.getElementById("ptaa").disabled=false;
}

ritmo_obj.ritmo_main=function(){
	canvas_zone_vcentered.innerHTML='\
        <button id="pta" class="button" disabled="disabled" onclick="ritmo_obj.play_ta()">.</button>\
		<button id="ptaa" class="button" disabled="disabled" onclick="ritmo_obj.play_taa()">___</button>\
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
    ritmo_obj.add_buttons(canvas_zone_vcentered);
	ritmo_obj.current_pat=ritmo_obj.generate_pattern(3); // auto-reset
	AudioLib.play_sound_arr(ritmo_obj.current_pat,ritmo_obj.play_pattern_ended);
}


/*ritmo_obj.play_pattern=function(){
	if(ritmo_obj.current_position<ritmo_obj.current_pat.length){
		ritmo_obj.current_sound=ritmo_obj.current_pat[ritmo_obj.current_position];
	    media_objects.sounds[ritmo_obj.current_pat[ritmo_obj.current_position]].play();
		setTimeout(function(){ritmo_obj.check_sound_finished()}, 500);
	}else{
		 // ready for answer, re activate answer buttons.
		ritmo_obj.current_sound="";
		ritmo_obj.current_position=0;
		ritmo_obj.answer_arr=[];
		document.getElementById("pta").disabled=false;
		document.getElementById("ptaa").disabled=false;
	}
}

ritmo_obj.check_sound_finished=function(){
	if(media_objects.sounds[ritmo_obj.current_pat[ritmo_obj.current_position]].ended){
		console.log("ended: "+ritmo_obj.current_pat[ritmo_obj.current_position]+" time: "+media_objects.sounds[ritmo_obj.current_pat[ritmo_obj.current_position]].currentTime);
		ritmo_obj.current_position++;
		ritmo_obj.play_pattern();
	}else{
		console.log("waiting..."+ritmo_obj.current_pat[ritmo_obj.current_position]+" time: "+media_objects.sounds[ritmo_obj.current_pat[ritmo_obj.current_position]].currentTime);
		setTimeout(function(){ritmo_obj.check_sound_finished()}, 500);
	}
}*/

ritmo_obj.play_ta=function(){
    ritmo_obj.play_sound('ta35.m4a');
}
ritmo_obj.play_taa=function(){
    ritmo_obj.play_sound('ta150.m4a');
}

ritmo_obj.play_sound=function(s){
	ritmo_obj.answer_arr.push(s);
	AudioLib.play_sound_single(s,ritmo_obj.play_sound_end);
    //media_objects.sounds[s].play();
}

ritmo_obj.play_sound_end=function(){
	if(ritmo_obj.answer_arr.length>=ritmo_obj.current_pat.length){
		ritmo_obj.check();
	}
}

ritmo_obj.check=function(){
	console.log(ritmo_obj.current_pat+" vs  "+ritmo_obj.answer_arr);
	if(ritmo_obj.current_pat==ritmo_obj.answer_arr){
		ritmo_obj.details.result="correct";
	}else{
		ritmo_obj.details.result="incorrect";
		ritmo_obj.failed_times++;
	}
	ritmo_obj.end(ritmo_obj.details.result);

}




