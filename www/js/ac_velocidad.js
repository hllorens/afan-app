"use strict";

var current_activity_speed_played_times=0;
var current_activity_speed_level_passed_times=0;
var current_activity_speed_level=1;
var MAX_SPEED_LEVELS=3;
var current_activity_sentence;
var current_activity_word;

var sentence_ref=[
	'En el castillo había una princesa',
	'Me olvidé el paraguas',
	'Mañana voy a ir al teatro'
];

/*
TODO: see kanban
*/

var vel_obj=new Activity('Velocidad Lectora','velocidad','start_activity');
memvis_obj.help_text='\
    Lee y recuerda. Posteriormente tendrás que escribir la palabra que falta.\
';

var velocidad=function(){
    if(!check_if_sounds_loaded(velocidad)){return;}
    if(!JsonLazy.data.hasOwnProperty('velocidad_data')){
        JsonLazy.load("../data/ac_velocidad_data.json", "velocidad_data", velocidad);
    }else{
        preventBackExit();
		session_data.num_answered=MAX_SPEED_LEVELS*2;
		vel_obj.start(); 
	}
}


vel_obj.start_activity=function(){
	if(current_activity_speed_level_passed_times>=2){
        current_activity_speed_level_passed_times=0;
        current_activity_speed_level++;
        current_activity_speed_played_times=0;
	}
    if(current_activity_speed_level>=MAX_MEMORY_LEVELS || (session_data.mode!="test" && current_activity_speed_played_times>=10)){
		vel_obj.finish();
	}else{
		if(!JsonLazy.data.velocidad_data.hasOwnProperty(current_activity_speed_level) || 
		   current_activity_speed_level>MAX_SPEED_LEVELS)
			current_activity_speed_level=MAX_SPEED_LEVELS;
		var sentences=JsonLazy.data.velocidad_data[current_activity_speed_level];
		current_activity_sentence = random_array(sentences,1)[0];
		console.log(current_activity_sentence);

		// chose one word of more than X letters (depending on the level [only useful for levels >2])
		current_activity_word = random_word_longer_than(current_activity_sentence.split(" "), current_activity_speed_level);
		console.log(current_activity_word);

		// show sentence and then hide word
		velocidad_show_pattern();
	}
}

var random_word_longer_than=function(array, min_word_length){
	var item=undefined;
	var mwl=3;
	if(typeof(min_word_length)!=='undefined') mwl=min_word_length;
	var way_out_of_infinite_loop=0;
	do{
		item = array[Math.floor(Math.random()*array.length)];
		way_out_of_infinite_loop++;
	}while(item.length<=mwl && way_out_of_infinite_loop!=1000);
	if(way_out_of_infinite_loop==1000)
		throw new Error("cognitionis random_word_longer_than,  loop>1000, min_word_length="+min_word_length);
	return item;
}

var velocidad_show_pattern=function(){
	var pattern_representation="";
	canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">Pulsa play para ver la frase</p>\
        </div>\
		  <button id="playb" class="button">PLAY</button>\
          <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
          <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    document.getElementById("playb").addEventListener(clickOrTouch,function(){velocidad_uncover();});
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){open_js_modal_alert(velocidad_help_title,velocidad_help);});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();}); 
}



var velocidad_uncover=function(){
	canvas_zone_vcentered.innerHTML=' \
	<div class="text-center montessori-div">\
	<p class="montessori">'+current_activity_sentence+'</p>\
	</div>\
	';
	setTimeout(function(){velocidad_find_word();}, 5000);
}

var velocidad_find_word=function(){
	canvas_zone_vcentered.innerHTML=' \
	<div class="text-center montessori-div">\
	<p class="montessori">'+hide_word(current_activity_sentence,current_activity_word)+'</p>\
	</div>\
	<input id="velocidad_answer" class="montessori-40" type="text" value="" />\
	<br /><button id="check_vel_button" class="button">OK</button>\
    <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    document.getElementById("check_vel_button").addEventListener(clickOrTouch,function(){check_velocidad();});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();}); 
}

function hide_word(sentence,word){
	return sentence.replace(word,'¿_?');
}

function check_velocidad(){
	var correct_answer=Asciify.asciify(current_activity_word.toLowerCase());
	vel_obj.details={};
	vel_obj.details.type=session_data.type;
	vel_obj.details.mode=session_data.mode;
	vel_obj.details.level=session_data.level;
	vel_obj.details.activity=correct_answer;	
	current_activity_speed_played_times++;
	var answer=Asciify.asciify(document.getElementById("velocidad_answer").value.toLowerCase());
	if(answer==correct_answer){
        vel_obj.details.result="correct";
		current_activity_speed_level_passed_times++;
        session_data.num_correct++;
    }else{
	    vel_obj.details.result="incorrect";
    }
	vel_obj.end()
}





