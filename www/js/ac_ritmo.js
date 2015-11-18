"use strict";

var ritmo_obj=new Activity('Ritmo','ritmo')
ritmo_obj.help_text='Escucha la secuencia. Después tendrás que reproducirla.';


/*
Like in memory
It starts with a pattern of 1 and goes up to 6
The user first hears the sound pattern (buttons dissabled)
Then 2 buttons . short and __ long become enabled and the user can click them n times (the number of reproduced sounds)
Same behaviour as the memory game

*/

ritmo_obj.current_sound="";
ritmo_obj.current_position=0;
ritmo_obj.current_pat="";

var ritmo=function(){
    if(!check_if_sounds_loaded(ritmo)){return;}
	preventBackExit();
    remove_modal();
	session_data.type="ritmo";
    
	canvas_zone_vcentered.innerHTML='\
        <button class="button" onclick="ritmo_obj.play_ta()">.</button>\
		<button class="button" onclick="ritmo_obj.play_taa()">___</button>\
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
    ritmo_obj.add_buttons(canvas_zone_vcentered);

	ritmo_obj.current_pat=ritmo_obj.generate_pattern(3);
	ritmo_obj.play_pattern();	
}

ritmo_obj.generate_pattern=function(length){
	var pat=[];
	for(var i=0;i<length;i++){
		pat.push((Math.random() <0.5 ? "ta35.m4a" : "ta150.m4a"));
	}
	if(debug) console.log(pat);
	return pat;
}

ritmo_obj.play_pattern=function(){
	if(ritmo_obj.current_position<ritmo_obj.current_pat.length){
		ritmo_obj.current_sound=ritmo_obj.current_pat[ritmo_obj.current_position];
	    media_objects.sounds[ritmo_obj.current_pat[ritmo_obj.current_position]].play();
		setTimeout(function(){ritmo_obj.check_sound_finished()}, 500);
	}else{
		 // ready for answer, re activate answer buttons.
		ritmo_obj.current_sound="";
		ritmo_obj.current_pat="";
		ritmo_obj.current_position=0;

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
}

ritmo_obj.play_ta=function(){
    media_objects.sounds['ta35.m4a'].play();
}
ritmo_obj.play_taa=function(){
    media_objects.sounds['ta150.m4a'].play();
}

