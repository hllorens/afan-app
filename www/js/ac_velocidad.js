"use strict";

var vel_obj=new Activity('Velocidad Lectora','velocidad','start_activity');
vel_obj.help_text='\
    Lee y recuerda. Posteriormente tendrás que escribir la palabra que falta.\
';
vel_obj.MAX_LEVELS=4; // 3 is the max but 4 will make it play 2 more times
vel_obj.MAX_PLAYED_TIMES=1000; // game mode 1000=infinity
vel_obj.sec_init=1;
vel_obj.sec_pal=[
    {"min_age":0,"max_age":8,"sec_pal":2},
    {"min_age":8,"max_age":12,"sec_pal":1},
    {"min_age":12,"max_age":99,"sec_pal":0.5}
];

var velocidad=function(finish_callback){
    if(!check_if_sounds_loaded(function(){velocidad(finish_callback);})){return;}
    if(!JsonLazy.data.hasOwnProperty('velocidad_data')){
        JsonLazy.load("../data/ac_velocidad_data.json", "velocidad_data", function(){velocidad(finish_callback);});
    }else{
        preventBackExit();
        if(typeof(finish_callback)=='undefined') finish_callback=game;
        vel_obj.finish_callback=finish_callback;
        vel_obj.played_times=0;
        vel_obj.level_played_times=0;
        vel_obj.level_passed_times=0;
        vel_obj.level=1;
		vel_obj.start(); 
	}
}


vel_obj.start_activity=function(){
	if((session_data.mode!="test" && vel_obj.level_passed_times>=2) || (session_data.mode=="test" && vel_obj.level_played_times>=2)){
        vel_obj.level_passed_times=0;
        vel_obj.level_played_times=0;
        vel_obj.level++;
        vel_obj.played_times=0;
	}
    
    if((session_data.mode=="test" && vel_obj.level>vel_obj.MAX_LEVELS) || 
          (session_data.mode!="test" && vel_obj.played_times>=vel_obj.MAX_PLAYED_TIMES)){
		session_data.num_answered=vel_obj.MAX_LEVELS*2;
		vel_obj.finish();
	}else{
        //if(session_data.mode=="test" && this.played_times==this.MAX_PLAYED_TIMES_TEST_DRY) vel_obj.level=1; auto in common
		if(!JsonLazy.data.velocidad_data.hasOwnProperty(vel_obj.level) || 
		   vel_obj.level>vel_obj.MAX_LEVELS)
			vel_obj.level=vel_obj.MAX_LEVELS;
        var difficulty=vel_obj.level;
        if(difficulty==1) difficulty=2;
		var sentences=JsonLazy.data.velocidad_data[difficulty];
		vel_obj.sentence = random_array(sentences,1)[0];
		// chose one word of more than X letters (depending on the level [only useful for levels >2])
		vel_obj.word = random_word_longer_than(vel_obj.sentence.split(" "), difficulty);
		if(debug) console.log("sentence: "+vel_obj.sentence+" word: "+vel_obj.word);
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
        <div id="hinttext">Pulsa play y memoriza la frase</div>\
        <div class="text-center montessori-div">\
        <p class="montessori"></p>\
        </div>\
        <input id="velocidad_answer" class="montessori-40 hidden" type="text" value="" />\
        <br /><button id="playb" class="button">PLAY</button>\
	';
    vel_obj.add_buttons(canvas_zone_vcentered);
    document.getElementById("playb").addEventListener(clickOrTouch,function(){velocidad_uncover();});
    vel_obj.hinttext=document.getElementById('hinttext');
    if(session_data.mode=="test" && vel_obj.played_times<vel_obj.MAX_PLAYED_TIMES_TEST_DRY){
        vel_obj.hinttext.innerHTML="[ENTRENA] "+vel_obj.hinttext.innerHTML;
    }
}



var velocidad_uncover=function(){
    ac_in_process=true;
	canvas_zone_vcentered.innerHTML=' \
    Memoriza\
	<div class="text-center montessori-div">\
	<p class="montessori">'+vel_obj.sentence+'</p>\
	</div>\
    <input id="velocidad_answer" class="montessori-40 hidden" type="text" value="" />\
	<br /><button id="check_vel_button" class="button button-long button-hidden" disabled="disabled">¡Hecho!</button>\
	';
    vel_obj.add_buttons(canvas_zone_vcentered);
    var pal_wait_time=1;
    for(var i=0;i<vel_obj.sec_pal.length;i++){
        if(vel_obj.sec_pal[i].min_age<=session_data.age && vel_obj.sec_pal[i].max_age>session_data.age){
            pal_wait_time=vel_obj.sec_pal[i].sec_pal*1000*vel_obj.sentence.split(" ").length;
            break;
        }
    }
    pal_wait_time+=vel_obj.sec_init*1000;
	setTimeout(function(){velocidad_find_word();}, pal_wait_time);
}

var velocidad_find_word=function(){
    ac_in_process=false;
    activity_timer.reset();
    activity_timer.start();
	canvas_zone_vcentered.innerHTML=' \
    Escribe la palabra que falta\
	<div class="text-center montessori-div">\
	<p class="montessori">'+vel_obj.hide_word(vel_obj.sentence,vel_obj.word)+'</p>\
	</div>\
	Palabra escondida: <input id="velocidad_answer" class="montessori-40" onkeyup="vel_obj.check_content(event)" type="text" value="" autofocus="autofocus" />\
	<br /><button id="check_vel_button" class="button button-long backgroundRed">No me acuerdo</button>\
	';
    vel_obj.add_buttons(canvas_zone_vcentered);
    document.getElementById("check_vel_button").addEventListener(clickOrTouch,function(){vel_obj.check();});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();}); 
}

vel_obj.check_content=function(e){
    if(document.getElementById('velocidad_answer').value.trim().length>0){
        //document.getElementById("check_vel_button").disabled=false;
        document.getElementById("check_vel_button").classList.remove('backgroundRed'); // button-hidden
        document.getElementById("check_vel_button").innerHTML='¡Hecho!';
        if(e==undefined) e=window.event;
        if(e.keyCode == 13) vel_obj.check();
    }else{
        //document.getElementById("check_vel_button").disabled=true;
        document.getElementById("check_vel_button").classList.add('backgroundRed'); // button-hidden
        document.getElementById("check_vel_button").innerHTML='No me acuerdo';
    }
}

vel_obj.hide_word=function(sentence,word){
	return sentence.replace(word,'¿_?');
}

vel_obj.check=function(){
	var correct_answer=Asciify.asciify(vel_obj.word.toLowerCase());
	var answer=Asciify.asciify(document.getElementById("velocidad_answer").value.toLowerCase());
	vel_obj.details={};
	vel_obj.details.activity=correct_answer;
	vel_obj.details.choice=answer;
	if(answer==correct_answer){
        vel_obj.details.result="correct";
		vel_obj.level_passed_times++;
        session_data.num_correct++;
    }else{
	    vel_obj.details.result="incorrect";
    }
	vel_obj.played_times++;
	vel_obj.level_played_times++;
	vel_obj.end()
}





