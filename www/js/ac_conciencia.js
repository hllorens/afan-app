"use strict";

var conciencia_obj=new Activity('Conciencia Auditiva','conciencia','start_activity');
conciencia_obj.help_text='\
    Intenta unir mentalmente los sonidos que vas escuchando. ¿Qué palabra se forma? \
';
conciencia_obj.remaining_rand_activities=null;
conciencia_obj.MAX_TRAINING_ACTIVITIES=10;
conciencia_obj.MAX_PLAYS=2;
conciencia_obj.USE_ANSWERS=3;

var conciencia=function(){
    if(!check_if_sounds_loaded(conciencia)){return;}
    // Load activities if needed (TODO, to standardize this could be done at the pure beginning as json files)
    if(session_data.mode=="training" && !JsonLazy.data.hasOwnProperty('conciencia_train')){
        JsonLazy.load("../data/ac_conciencia_train.json", "conciencia_train", conciencia);
    }else if(!JsonLazy.data.hasOwnProperty('conciencia_test')){
            JsonLazy.load("../data/ac_conciencia_test.json", "conciencia_test", conciencia);
    }else{
        preventBackExit();
        canvas_zone_vcentered.innerHTML=' \
            <div id="answers"></div><br class="clear" />\
            <div id="sound"><button id="playb" class="button">PLAY</button></div><br /> \
            ';
        if(session_data.mode=="training"){ 
            var start=Math.floor(Math.random()*(JsonLazy.data.conciencia_train.length-(conciencia_obj.MAX_TRAINING_ACTIVITIES+1)));
            conciencia_obj.remaining_rand_activities=JsonLazy.data.conciencia_train.slice(start,start+conciencia_obj.MAX_TRAINING_ACTIVITIES);
			shuffle_array(conciencia_obj.remaining_rand_activities);
        }else{
            conciencia_obj.remaining_rand_activities=JsonLazy.data.conciencia_test.slice(); // copy by value
        }
        //get elements
        conciencia_obj.add_buttons(canvas_zone_vcentered);
        conciencia_obj.playb=document.getElementById('playb');
        conciencia_obj.playb.addEventListener(clickOrTouch,function(){conciencia_play_sound();});
        
        conciencia_obj.start();        
    }
}



conciencia_obj.start_activity=function(){
    if(conciencia_obj.remaining_rand_activities.length==0){
		conciencia_obj.finish();
    }else{
        conciencia_obj.playb.innerHTML='PLAY';
        conciencia_obj.playb.disabled=false;
        activity_timer.reset();
        conciencia_obj.current_index=0;
        conciencia_obj.played_times=0;
        if(debug) console.log(0+"--"+conciencia_obj.remaining_rand_activities);
        conciencia_obj.cur_data=conciencia_obj.remaining_rand_activities[0]; 
        conciencia_obj.correct_answer=conciencia_obj.cur_data['answers'][0];

        var answers_div=document.getElementById('answers');
        answers_div.innerHTML="";
        var used_answers=[];
        var used_answers_text=[];
        for(var i=0; i<conciencia_obj.USE_ANSWERS ; ++i) {
            var use=Math.floor(Math.random() * conciencia_obj.USE_ANSWERS)
            while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * conciencia_obj.USE_ANSWERS);

            var answer_i=conciencia_obj.cur_data['answers'][use];
            answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border"  ></div>';
            if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+conciencia_obj.cur_data['answers'][use])){
                alert("ERROR: .wordimage-"+conciencia_obj.cur_data['answers'][use]+" not found in wordimg-sprite.css.");
                document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
            }else if(used_answers_text.hasOwnProperty(conciencia_obj.cur_data['answers'][use])){
                alert("ERROR: "+conciencia_obj.cur_data['answers'][use]+" is already used contact the ADMIN.");
                document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
            }else{
                document.getElementById("answer"+i).innerHTML += '<div class="wordimage wordimage-'+conciencia_obj.cur_data['answers'][use]+'"></div>';
            }
            
            used_answers[used_answers.length]=use;
            used_answers_text[used_answers_text.length]=conciencia_obj.cur_data['answers'][use];
        }

        toggleClassBlink(conciencia_obj.playb,'backgroundRed',250,4);
        var boxes=document.getElementsByClassName("hover_red_border");
        for(var i=0;i<boxes.length;i++){
            boxes[i].addEventListener(clickOrTouch,function(){
                conciencia_check_correct(this.firstChild);
                });
        }

    }
}


var conciencia_play_sound_finished=function(){
	activity_timer.start();
	conciencia_obj.played_times++;
	
	if(conciencia_obj.played_times < conciencia_obj.MAX_PLAYS){
		conciencia_obj.playb.innerHTML="RE-PLAY"; // use icons (fixed % size) &#11208; &#11118; &#10704;
		conciencia_obj.playb.disabled=false;
	}else{
		activity_timer.seconds+=2;
		conciencia_obj.playb.innerHTML="haz click en un dibujo"; // use empty icon (to keep size)
	}
};


var conciencia_play_sound=function(){
	conciencia_obj.playb.disabled=true;
	activity_timer.stop();
	SoundChain.play_sound_arr(conciencia_obj.cur_data['sounds'],audio_sprite,conciencia_play_sound_finished);
};


function conciencia_check_correct(clicked_answer){
	// do not allow cliking before or while uttering
	if(conciencia_obj.played_times==0 || SoundChain.audio_chain_waiting){
		open_js_modal_content_timeout('<h1>Haz click en "play" antes que en el dibujo</h1>',2000);
		return;
	} 

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

    conciencia_obj.remaining_rand_activities.splice(conciencia_obj.current_index,1); // remove current activity
    session_data.num_answered++;
    
    conciencia_obj.details={};
    conciencia_obj.details.activity=conciencia_obj.correct_answer;    
    conciencia_obj.details.choice=clicked_answer;
    var the_content='<h1>...siguiente actividad...</h1>';
    if (clicked_answer==conciencia_obj.correct_answer){
        session_data.num_correct++;
        conciencia_obj.details.result="correct";
    }else{
        conciencia_obj.details.result="incorrect";
    }
    conciencia_obj.end()
}


