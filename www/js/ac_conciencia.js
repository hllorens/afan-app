"use strict";

var conciencia=function(){
    if(!check_if_sounds_loaded(conciencia)){return;}
    preventBackExit();
    session_data.type="conciencia";
    // TODO CREATE A FUNCTION SHOW LEVEL----------------
    open_js_modal_content('<h1>Nivel 1: '+session_data.mode+'</h1>');
    // ----------------------------------------------
    
    
    // Load activities if needed
    if(session_data.mode=="training"){
        if(JsonLazy.data.hasOwnProperty('conciencia_train')){
            setTimeout(function(){conciencia_start();}, 1000);
        }else{
            JsonLazy.load("../data/train2.json", "conciencia_train", conciencia_start);
        }
    }else{
        if(JsonLazy.data.hasOwnProperty('conciencia_test')){
            setTimeout(function(){conciencia_start();}, 1000);
        }else{
            JsonLazy.load("../data/test1.tsv.json", "conciencia_test", conciencia_start);
        }        
    }
    
}

function conciencia_start(){
	remove_modal();
	session_data.num_correct=0;
	session_data.num_answered=0;
	session_data.details=[];
	var timestamp=new Date();
	session_data.timestamp=timestamp.getFullYear()+"-"+
		pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
		 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0");

	var training_extra_fields='';
	if(session_data.mode=="training"){
		training_extra_fields='<div id="current_score">\
		Correct : <span id="current_score_num">0</span>\
		</div>';
	}
	canvas_zone_vcentered.innerHTML=' \
		<div id="zone_score" class="cf">\
		  <div class="col_left">\
		    <div id="activity_timer_div">\
		      Tiempo : <span id="activity_timer_span">00:00:00</span>\
		    </div>\
			'+training_extra_fields+'\
		  </div>\
		  <div class="col_right">\
		    <div id="remaining_activities">\
		      remaining activs : <span id="remaining_activities_num">0</span>\
		    </div>\
		    <div id="current_answered">\
		      Answered : <span id="current_answered_num">0</span>\
		    </div>\
		  </div>\
		</div> <!-- /#zone_score -->\
	<div id="answers"></div><br class="clear" />\
	<div id="sound">sound icon</div><br /> \
	';
	//get elements
	dom_score_correct=document.getElementById('current_score_num');
	dom_score_answered=document.getElementById('current_answered_num');
	activity_timer.anchor_to_dom(document.getElementById('activity_timer_span'));
	dom_score_answered.innerHTML=session_data.num_answered;
	if(session_data.mode=="training"){ 
		var start=Math.floor(Math.random()*(JsonLazy.data.conciencia_train.length-(MAX_TRAINING_ACTIVITIES+1)));
		remaining_rand_activities=JsonLazy.data.conciencia_train.slice(start,start+MAX_TRAINING_ACTIVITIES);
	}else{
		remaining_rand_activities=JsonLazy.data.conciencia_test.slice(); // copy by value
	}
	document.getElementById('remaining_activities_num').innerHTML=""+(remaining_rand_activities.length-1);
	if(session_data.mode=="training"){
		conciencia_show_activity(Math.floor(Math.random()*remaining_rand_activities.length));
	}else{
		conciencia_show_activity(0);
	}
}

function conciencia_show_activity(i){
	document.getElementById('remaining_activities_num').innerHTML=""+(remaining_rand_activities.length-1);

	activity_timer.reset();
	current_activity_index=i;
	current_activity_played_times=0;
	if(debug) console.log(i+"--"+remaining_rand_activities);
	current_activity_data=remaining_rand_activities[i]; 
	correct_answer=current_activity_data['answers'][0];

	var answers_div=document.getElementById('answers');
	answers_div.innerHTML="";
	var used_answers=[];
	var used_answers_text=[];
	for(var i=0; i<USE_ANSWERS ; ++i) {
		var use=Math.floor(Math.random() * USE_ANSWERS)
		while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * USE_ANSWERS);

		var answer_i=current_activity_data['answers'][use];
		answers_div.innerHTML+='<div id="answer'+i+'" onclick="conciencia_check_correct(this.firstChild,correct_answer)" class="hover_red_border"  ></div>';
		if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+current_activity_data['answers'][use])){
			alert("ERROR: .wordimage-"+current_activity_data['answers'][use]+" not found in wordimg-sprite.css.");
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
        }else if(used_answers_text.hasOwnProperty(current_activity_data['answers'][use])){
			alert("ERROR: "+current_activity_data['answers'][use]+" is already used contact the ADMIN.");
			document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
		}else{
			document.getElementById("answer"+i).innerHTML += '<div class="wordimage wordimage-'+current_activity_data['answers'][use]+'"></div>';
		}
		
		used_answers[used_answers.length]=use;
		used_answers_text[used_answers_text.length]=current_activity_data['answers'][use];
	}
	
	zone_sound=document.getElementById('sound');
	zone_sound.innerHTML='<button id="playb" class="button" onclick="conciencia_play_sound()">PLAY</button> ';
	var playb=document.getElementById('playb');
	toggleClassBlink(playb,'backgroundRed',250,4);
}

var conciencia_play_sound_finished=function(){
	activity_timer.start();
	current_activity_played_times++;
	var playb=document.getElementById('playb');
	if(current_activity_played_times < MAX_PLAYS){
		playb.innerHTML="RE-PLAY"; // use icons (fixed % size) &#11208; &#11118; &#10704;
		playb.disabled=false;
	}else{
		activity_timer.seconds+=2;
		playb.innerHTML="haz click en un dibujo"; // use empty icon (to keep size)
	}
};


var conciencia_play_sound=function(){
	document.getElementById('playb').disabled=true;
	activity_timer.stop();
	SoundChain.play_sound_arr(current_activity_data['sounds'],audio_sprite,conciencia_play_sound_finished);
};


function conciencia_check_correct(clicked_answer,correct_answer){
	// do not allow cliking before or while uttering
	if(current_activity_played_times==0 || SoundChain.audio_chain_waiting){
		open_js_modal_content_timeout('<h1>Haz click en "play" antes que en el dibujo</h1>',2000);
		return;
	} 
	var activity_results={};
	var timestamp=new Date();
	var timestamp_str=timestamp.getFullYear()+"-"+
		pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
		 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0") + 
			":"  + pad_string(timestamp.getSeconds(),2,"0");
	activity_timer.stop();
	activity_results.type=session_data.type;
	activity_results.mode=session_data.mode;
	activity_results.level=session_data.level;
	activity_results.activity=correct_answer;
	activity_results.timestamp=timestamp_str;
	activity_results.duration=activity_timer.seconds;
	session_data.duration+=activity_timer.seconds;
	if(typeof clicked_answer == "string"){ // it is not a sprite but an image
		image_src_start_exists=clicked_answer.lastIndexOf("/")
		if(image_src_start_exists==-1) image_src_start_exists=clicked_answer.indexOf("src=\"")
		if (image_src_start_exists > -1){
			img_src_end=clicked_answer.indexOf(".png\"",image_src_start_exists+1)
			clicked_answer=clicked_answer.substring(image_src_start_exists+1,img_src_end)
		}
	}else{
		clicked_answer=(clicked_answer.className.replace("wordimage wordimage-","")).trim();
	}


	activity_results.choice=clicked_answer;
    var the_content='<h1>...siguiente actividad...</h1>';
	if (clicked_answer==correct_answer){
		session_data.num_correct++;
		activity_results.result="correct";
		if(session_data.mode!="test"){
			audio_sprite.playSpriteRange("zfx_correct");
			dom_score_correct.innerHTML=session_data.num_correct;
			the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
		}
	}else{
		activity_results.result="incorrect";
		if(session_data.mode!="test"){
			audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
			the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';
		}
	}
    open_js_modal_content(the_content);
	session_data.details.push(activity_results);
	session_data.num_answered++;
	dom_score_answered.innerHTML=session_data.num_answered;
	var waiting_time=1000;
	if(session_data.mode!="test") waiting_time=2000; // fire next activity after 2 seconds (time for displaying img and playing the sound)
	setTimeout(function(){conciencia_next_activity()}, waiting_time);
}

function conciencia_next_activity(){
	remaining_rand_activities.splice(current_activity_index,1); // remove current conciencia_show_activity
	remove_modal();
	if(remaining_rand_activities.length==0){
		canvas_zone_vcentered.innerHTML='NO HAY MAS ACTIVIDADES. FIN, sending...';
		if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
		send_session_data();
	}else{
		if(remaining_rand_activities.length==1 || session_data.mode=="test"){
			conciencia_show_activity(0);
		}else{
			conciencia_show_activity(Math.floor(Math.random()*remaining_rand_activities.length));
		}
	}
}