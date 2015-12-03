"use strict";

var conciencia_obj=new Activity('Conciencia Auditiva','conciencia','start_activity');
conciencia_obj.help_text='\
    Intenta unir mentalmente los sonidos que vas escuchando. ¿Qué palabra se forma? \
';
conciencia_obj.remaining_rand_activities=null;
conciencia_obj.MAX_TRAINING_ACTIVITIES=10;

var conciencia=function(){
    if(!check_if_sounds_loaded(conciencia)){return;}

    // Load activities if needed (TODO, to standardize this could be done at the pure beginning as json files)
    if(session_data.mode=="training" && !JsonLazy.data.hasOwnProperty('conciencia_train')){
        JsonLazy.load("../data/ac_conciencia_train.json", "conciencia_train", conciencia);
    }else if(!JsonLazy.data.hasOwnProperty('conciencia_test')){
            JsonLazy.load("../data/ac_conciencia_test.json", "conciencia_test", conciencia);
    }else{
        preventBackExit();
        var training_extra_fields='';
        if(session_data.mode=="training"){
            training_extra_fields='<div id="current_score">\
            Correctas : <span id="current_score_num">0</span>\
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
                  Actividades restantes: <span id="remaining_activities_num">0</span>\
                </div>\
                <div id="current_answered">\
                  Actividades finalizadas : <span id="current_answered_num">0</span>\
                </div>\
              </div>\
            </div> <!-- /#zone_score -->\
        <div id="answers"></div><br class="clear" />\
        <div id="sound">sound icon</div><br /> \
            ';

        if(session_data.mode=="training"){ 
            var start=Math.floor(Math.random()*(JsonLazy.data.conciencia_train.length-(conciencia_obj.MAX_TRAINING_ACTIVITIES+1)));
            conciencia_obj.remaining_rand_activities=JsonLazy.data.conciencia_train.slice(start,start+conciencia_obj.MAX_TRAINING_ACTIVITIES);
			shuffle_array(conciencia_obj.remaining_rand_activities);
        }else{
            conciencia_obj.remaining_rand_activities=JsonLazy.data.conciencia_test.slice(); // copy by value
        }
        //get elements
        dom_score_correct=document.getElementById('current_score_num');
        dom_score_answered=document.getElementById('current_answered_num');
        activity_timer.anchor_to_dom(document.getElementById('activity_timer_span'));
        dom_score_answered.innerHTML=session_data.num_answered;
        document.getElementById('remaining_activities_num').innerHTML=""+(conciencia_obj.remaining_rand_activities.length-1);  
        conciencia_obj.add_buttons(canvas_zone_vcentered);

        conciencia_obj.start();        
    }
}



conciencia_obj.start_activity=function(){
    if(conciencia_obj.remaining_rand_activities.length==0){
		conciencia_obj.finish();
    }else{
        document.getElementById('remaining_activities_num').innerHTML=""+(conciencia_obj.remaining_rand_activities.length-1);

        activity_timer.reset();
        current_activity_index=0;
        current_activity_played_times=0;
        if(debug) console.log(0+"--"+conciencia_obj.remaining_rand_activities);
        current_activity_data=conciencia_obj.remaining_rand_activities[0]; 
        correct_answer=current_activity_data['answers'][0];

        var answers_div=document.getElementById('answers');
        answers_div.innerHTML="";
        var used_answers=[];
        var used_answers_text=[];
        for(var i=0; i<USE_ANSWERS ; ++i) {
            var use=Math.floor(Math.random() * USE_ANSWERS)
            while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * USE_ANSWERS);

            var answer_i=current_activity_data['answers'][use];
            answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border"  ></div>';
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
        zone_sound.innerHTML='<button id="playb" class="button">PLAY</button> ';
        var playb=document.getElementById('playb');
        toggleClassBlink(playb,'backgroundRed',250,4);

        playb.addEventListener(clickOrTouch,function(){conciencia_play_sound();});
        var boxes=document.getElementsByClassName("hover_red_border");
        for(var i=0;i<boxes.length;i++){
            boxes[i].addEventListener(clickOrTouch,function(){
                conciencia_check_correct(this.firstChild,correct_answer);
                });
        }

    }
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
	conciencia_obj.details={};
	conciencia_obj.details.type=session_data.type;
	conciencia_obj.details.mode=session_data.mode;
	conciencia_obj.details.level=session_data.level;
	conciencia_obj.details.activity=correct_answer;
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

    conciencia_obj.remaining_rand_activities.splice(current_activity_index,1); // remove current activity
    session_data.num_answered++;
    dom_score_answered.innerHTML=session_data.num_answered;
    
    conciencia_obj.details.choice=clicked_answer;
    var the_content='<h1>...siguiente actividad...</h1>';
    if (clicked_answer==correct_answer){
        session_data.num_correct++;
        conciencia_obj.details.result="correct";
    }else{
        conciencia_obj.details.result="incorrect";
    }
    conciencia_obj.end()
}


