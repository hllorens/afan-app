"use strict";

var acConciencia=function(){
    this.ac=new Activity('Conciencia Auditiva','conciencia','start_activity');
    this.ac.help_text='Intenta unir mentalmente los sonidos que vas escuchando. ¿Qué palabra se forma?';
    //this.ac.remaining_rand_activities=null;
    this.ac.MAX_LEVELS=3;
    this.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME=4;
    this.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST=1000; // all the activities
    this.ac.MAX_PLAY_SOUND=2;
    this.ac.USE_ANSWERS=3;
    var that=this;

    this.ac.start_activity=function(){
        if(that.ac.level<=that.ac.MAX_LEVELS){
            that.ac.max_passed_times_this_level_game=Math.min(that.ac.activities[that.ac.level].length,that.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME);
            that.ac.max_played_times_this_level_test=Math.min(that.ac.activities[that.ac.level].length,that.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST);
            if(that.ac.max_played_times_this_level_test==0){ // then max passed time is 0 too
                that.ac.reset_level();
                that.ac.level++; // dry removed all level activities, or empty level
                if(that.ac.level<=that.ac.MAX_LEVELS){
                    that.ac.max_passed_times_this_level_game=Math.min(that.ac.activities[that.ac.level].length,that.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME);
                    that.ac.max_played_times_this_level_test=Math.min(that.ac.activities[that.ac.level].length,that.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST);
                }
            }
        }
        if(that.ac.level>that.ac.MAX_LEVELS){
            that.ac.finish();
        }else{
            canvas_zone_vcentered.innerHTML=' \
                <div id="hinttext">Pulsa PLAY</div>\
                <div id="answers"></div><br class="clear" />\
                <div id="sound"><button id="playb" class="button">PLAY</button></div><br /> \
                ';
            that.ac.add_buttons(canvas_zone_vcentered);
            that.ac.hinttext=document.getElementById('hinttext');
            that.ac.playb=document.getElementById('playb');
            that.ac.playb.addEventListener(clickOrTouch,function(){that.ac.play_sound();}.bind(that));
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
            }
            that.ac.playb.innerHTML='PLAY';
            that.ac.playb.disabled=false;
            activity_timer.reset();
            that.ac.current_index=0;
            that.ac.playb_pushed_times=0;
            /*if(debug) console.log(0+"--"+that.ac.remaining_rand_activities[that.ac.level][0]);
            that.ac.cur_data=that.ac.remaining_rand_activities[that.ac.level][0]; */
            var ac_number=that.ac.level_played_times;
            if(ac_number>=that.ac.activities[that.ac.level].length){
                ac_number=Math.floor(Math.random()*that.ac.activities[that.ac.level].length);
            }
            if(debug) console.log(0+"--"+that.ac.activities[that.ac.level][ac_number]);
            that.ac.cur_data=that.ac.activities[that.ac.level][ac_number];
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.activities[that.ac.level].shift(); // remove element
            }
            that.ac.correct_answer=that.ac.cur_data['answers'][0];

            var answers_div=document.getElementById('answers');
            answers_div.innerHTML="";
            var used_answers=[];
            var used_answers_text=[];
            for(var i=0; i<that.ac.USE_ANSWERS ; ++i) {
                var use=Math.floor(Math.random() * that.ac.USE_ANSWERS)
                while(used_answers.indexOf(use) != -1) use=Math.floor(Math.random() * that.ac.USE_ANSWERS);

                var answer_i=that.ac.cur_data['answers'][use];
                answers_div.innerHTML+='<div id="answer'+i+'" class="hover_red_border"  ></div>';
                if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+that.ac.cur_data['answers'][use])){
                    alert("ERROR: .wordimage-"+that.ac.cur_data['answers'][use]+" not found in wordimg-sprite.css.");
                    document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
                }else if(used_answers_text.hasOwnProperty(that.ac.cur_data['answers'][use])){
                    alert("ERROR: "+that.ac.cur_data['answers'][use]+" is already used contact the ADMIN.");
                    document.getElementById("answer"+i).appendChild(media_objects.images['wrong.png']);
                }else{
                    document.getElementById("answer"+i).innerHTML += '<div class="wordimage wordimage-'+that.ac.cur_data['answers'][use]+' covered"></div>';
                }
                
                used_answers[used_answers.length]=use;
                used_answers_text[used_answers_text.length]=that.ac.cur_data['answers'][use];
            }

            toggleClassBlink(that.ac.playb,'backgroundRed',250,4);
            var boxes=document.getElementsByClassName("hover_red_border");
            for(var i=0;i<boxes.length;i++){
                boxes[i].addEventListener(clickOrTouch,function(){
                    that.ac.check(this.firstChild);
                    });
            }

        }
    }

    this.ac.play_sound_finished=function(){
        that.ac.in_process=false;
        activity_timer.start();
        that.ac.playb_pushed_times++;

        var boxes=document.getElementsByClassName("hover_red_border");
        for(var i=0;i<boxes.length;i++){
                //console.log(boxes[i]);
                boxes[i].firstChild.classList.remove('covered');
        }
        

        if(that.ac.playb_pushed_times < that.ac.MAX_PLAY_SOUND){
            that.ac.hinttext.innerHTML='Pulsa un dibujo o RE-PLAY';
            that.ac.playb.classList.remove('button-hidden');
            that.ac.playb.innerHTML="RE-PLAY"; // use icons (fixed % size) &#11208; &#11118; &#10704;
            that.ac.playb.disabled=false;
        }else{
            that.ac.hinttext.innerHTML='Pulsa un dibujo';
            activity_timer.seconds+=2;
            that.ac.playb.innerHTML="haz click en un dibujo"; // use empty icon (to keep size)
        }
    };


    this.ac.play_sound=function(){
        if(that.ac.playb_pushed_times > that.ac.MAX_PLAY_SOUND){alert('haz click en un dibujo');return;}
        that.ac.in_process=true;
        that.ac.playb.disabled=true;
        that.ac.playb.classList.add('button-hidden');
        activity_timer.stop();
        SoundChain.play_sound_arr(that.ac.cur_data['sounds'],audio_sprite,that.ac.play_sound_finished);
    };


    this.ac.check=function(clicked_answer){
        // do not allow cliking before or while uttering
        if(that.ac.playb_pushed_times==0){
            open_js_modal_content_timeout('<h1>Haz click en "play" antes que en el dibujo</h1>',2000);
            return;
        }
        if(SoundChain.audio_chain_waiting){ return;}


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

        //that.ac.remaining_rand_activities[that.ac.level].splice(that.ac.current_index,1); // remove current activity
        session_data.num_answered++;
        that.ac.details={};
        that.ac.details.activity=that.ac.correct_answer;
        that.ac.details.choice=clicked_answer;
        var the_content='<h1>...siguiente actividad...</h1>';
        if (clicked_answer==that.ac.correct_answer){
            session_data.num_correct++;
            that.ac.details.result="correct";
        }else{
            that.ac.details.result="incorrect";
        }
        that.ac.end()
    }

}










var conciencia=function(finish_callback){
    if(!check_if_sounds_loaded(function(){conciencia(finish_callback);})){return;}
    preventBackExit();
    var conciencia_obj=new acConciencia();

    // TODO most of this below can be shared (part of ac_common)
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    conciencia_obj.ac.finish_callback=finish_callback;
    if(conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN>media_objects.jsons["ac_conciencia_train.json"][1].length) conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN=media_objects.jsons["ac_conciencia_train.json"][1].length-1;
    //conciencia_obj.ac.remaining_rand_activities={};
    conciencia_obj.ac.activities={};
    if(session_data.mode=="training"){
        conciencia_obj.ac.activities[1]=media_objects.jsons["ac_conciencia_train.json"][1].slice();
        conciencia_obj.ac.activities[2]=media_objects.jsons["ac_conciencia_train.json"][2].slice();
        conciencia_obj.ac.activities[3]=media_objects.jsons["ac_conciencia_train.json"][3].slice();
        shuffle_array(conciencia_obj.ac.activities[1]);
        shuffle_array(conciencia_obj.ac.activities[2]);
        shuffle_array(conciencia_obj.ac.activities[3]);

        //shuffle_array(media_objects.jsons["ac_conciencia_train.json"][''+conciencia_obj.ac.level]);
        /*
        var start=0;
        //for(var i=1;i<conciencia_obj)
        // level 1
        Math.floor(Math.random()*(media_objects.jsons["ac_conciencia_train.json"][1].length-(conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN+1)));
        var l1=media_objects.jsons["ac_conciencia_train.json"][1].slice(start,start+conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN);
        shuffle_array(l1);
        // level 2
        Math.floor(Math.random()*(media_objects.jsons["ac_conciencia_train.json"][2].length-(conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN+1)));
        var l2=media_objects.jsons["ac_conciencia_train.json"][2].slice(start,start+conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN);
        shuffle_array(l2);
        // level 3
        Math.floor(Math.random()*(media_objects.jsons["ac_conciencia_train.json"][3].length-(conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN+1)));
        var l3=media_objects.jsons["ac_conciencia_train.json"][3].slice(start,start+conciencia_obj.ac.MAX_PLAYED_TIMES_PER_LEVEL_TRAIN);
        shuffle_array(l3);
        //concat
        conciencia_obj.ac.remaining_rand_activities=conciencia_obj.ac.remaining_rand_activities.concat(l1,l2,l3);
        conciencia_obj.ac.remaining_rand_activities=media_objects.jsons["ac_conciencia_train.json"].slice();*/
        //conciencia_obj.ac.activities=media_objects.jsons["ac_conciencia_train.json"];
    }else{
        //conciencia_obj.ac.remaining_rand_activities=dry_activities.concat(media_objects.jsons["ac_conciencia_test.json"].slice()); // copy by value
        //conciencia_obj.ac.remaining_rand_activities=media_objects.jsons["ac_conciencia_test.json"].slice(); // copy by value
        conciencia_obj.ac.activities[1]=media_objects.jsons["ac_conciencia_test.json"][1].slice();
        conciencia_obj.ac.activities[2]=media_objects.jsons["ac_conciencia_test.json"][2].slice();
        conciencia_obj.ac.activities[3]=media_objects.jsons["ac_conciencia_test.json"][3].slice();
        var start=Math.floor(Math.random()*(media_objects.jsons["ac_conciencia_train.json"][1].length-(conciencia_obj.ac.MAX_PLAYED_TIMES_TEST_DRY+1)));
        var dry_activities=media_objects.jsons["ac_conciencia_train.json"][1].slice(start,start+conciencia_obj.ac.MAX_PLAYED_TIMES_TEST_DRY);
        conciencia_obj.ac.activities[1]=dry_activities.concat(conciencia_obj.ac.activities[1]);
    }
    conciencia_obj.ac.start();
}



