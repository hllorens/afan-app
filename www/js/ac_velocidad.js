"use strict";

var current_activity_speed_level_passed_times=0;
var current_activity_speed_level=1;
var MAX_SPEED_LEVELS=5;
var current_activity_sentence;
var current_activity_word;

var sentence_ref=[
	'En el castillo había una princesa',
	'Me olvidé el paraguas',
	'Mañana voy a ir al teatro'
]

/*
TODO: see kanban
*/

var velocidad_help_title='Velocidad Lectora';
var velocidad_help='\
    Lee y recuerda. Posteriormente tendrás que escribir la palabra que falta.';


var velocidad=function(){
    if(!check_if_sounds_loaded(velocidad)){return;}
    preventBackExit();
	remove_modal();
	session_data.type="velocidad";
	if(subjects_select_elem.options[subjects_select_elem.selectedIndex]!=undefined)
		session_data.subject=subjects_select_elem.options[subjects_select_elem.selectedIndex].value;

	if(current_activity_speed_level_passed_times==0 && current_activity_memory_level==1){
        activity_timer.reset();
		session_data.num_correct=0;
		session_data.num_answered=MAX_SPEED_LEVELS; // *2
		session_data.duration=0;
		session_data.details=[];
		var timestamp=new Date();
		session_data.timestamp=timestamp.getFullYear()+"-"+
			pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
			 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0");
	}
    

	var sentences=sentence_ref;
	current_activity_sentence = random_array(sentences,1)[0];
	console.log(current_activity_sentence);

	// chose one word of more than 3 letters
	current_activity_word = random_word_longer_than(current_activity_sentence.split(" "), 3);
	console.log(current_activity_word);



	// show sentence and then hide word
	velocidad_show_pattern();

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
	<input id="velocidad_answer" class="montessori" type="text" value="" />\
	<br /><button id="check_vel_button" >OK</button>\
    <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    document.getElementById("check_vel_button").addEventListener(clickOrTouch,function(){check_velocidad();});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();}); 
}

function hide_word(sentence,word){
	return sentence.replace(word,'¿_?');
}

function check_velocidad(){
    var the_content='...';
	var answer=Asciify.asciify(document.getElementById("velocidad_answer").value.toLowerCase());
	if(answer==Asciify.asciify(current_activity_word.toLowerCase())){
            if(session_data.mode!="test"){
                audio_sprite.playSpriteRange("zfx_correct");
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
            }
            open_js_modal_content(the_content);
            session_data.num_correct++;
    }else{
        if(session_data.mode!="test"){
            audio_sprite.playSpriteRange("zfx_wrong");
            the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';
        }
        open_js_modal_content(the_content);
    }
    setTimeout(function(){velocidad();}, 2000);
}


