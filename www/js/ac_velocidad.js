"use strict";


var acVelocidad=function(){
    this.ac=new Activity('Velocidad Lectora','velocidad','start_activity');
    this.ac.help_text='Lee y recuerda. Posteriormente tendrás que escribir la palabra que falta.';

    this.ac.MAX_LEVELS=4; // 3 is the max but 4 will make it play 2 more times
    this.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME=4;
    this.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST=2;
    //this.ac.MAX_FAILED_TIMES_TEST=2;

    this.ac.sec_init=1;
    this.ac.used_sentences=[];
    this.ac.sec_pal=[
        {"min_age":0,"max_age":8,"sec_pal":2},
        {"min_age":8,"max_age":12,"sec_pal":1},
        {"min_age":12,"max_age":99,"sec_pal":0.5}
    ];
    var that=this;





    this.ac.start_activity=function(){
        if(that.ac.level>that.ac.MAX_LEVELS){ //|| (session_data.mode=="test" && !game_mode && that.ac.failed_times>=that.ac.MAX_FAILED_TIMES_TEST)
            that.ac.finish();
        }else{
            if(!that.ac.activities.hasOwnProperty(that.ac.level))
                throw new Error('ac_velocidad_'+session_data.mode+'.json has no activities for level: '+that.ac.level);
            var sentences=that.ac.activities[that.ac.level];
            //that.ac.sentence = random_array(sentences,1)[0];
            //var count=0; // externalize this using the cognitionis utils method
            //while(that.ac.used_sentences.indexOf(that.ac.sentence)!=-1 && count<100){
            //    that.ac.sentence = random_array(sentences,1)[0];
            //    count++;
            //}
            var ac_number=that.ac.level_played_times;
            if(ac_number>=that.ac.activities[that.ac.level].length){
                ac_number=Math.floor(Math.random()*that.ac.activities[that.ac.level].length);
            }
            that.ac.sentence = sentences[ac_number];
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.sentence = sentences[0];
                that.ac.activities[that.ac.level].shift(); // remove element
            }
            // chose one word of more than X letters (depending on the level [only useful for levels >2])
            that.ac.word = that.ac.random_word_longer_than(that.ac.sentence.split(" "), that.ac.level+1);
            if (session_data.mode=="test")
                that.ac.word = that.ac.longest_farest_word(that.ac.sentence.split(" "));
            if(debug) console.log("sentence: "+that.ac.sentence+" word: "+that.ac.word);
            that.ac.velocidad_show_pattern();
        }
    }

    this.ac.random_word_longer_than=function(array, min_word_length){
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

    this.ac.longest_farest_word=function(array){
        var item=array[0];
        for (var i=0;i<array.length;i++){
            if(array[i].length>=item.length)
                item=array[i];
        }
        return item;
    }

    this.ac.velocidad_show_pattern=function(){
        var pattern_representation="";
        canvas_zone_vcentered.innerHTML='\
            <div id="hinttext">Pulsa play y memoriza la frase</div>\
            <div class="text-center montessori-div">\
            <p class="montessori"></p>\
            </div>\
            <input id="velocidad_answer" class="montessori-40 hidden" type="text" value="" />\
            <br /><button id="playb" class="button">PLAY</button>\
        ';
        that.ac.add_buttons(canvas_zone_vcentered);
        document.getElementById("playb").addEventListener(clickOrTouch,function(){that.ac.velocidad_uncover();}.bind(that));
        that.ac.hinttext=document.getElementById('hinttext');
        if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
            that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
        }
    }



    this.ac.velocidad_uncover=function(){
        that.ac.in_process=true;
        canvas_zone_vcentered.innerHTML=' \
        Memoriza\
        <div class="text-center montessori-div">\
        <p class="montessori">'+that.ac.sentence+'</p>\
        </div>\
        <input id="velocidad_answer" class="montessori-40 hidden" type="text" value="" />\
        <br /><button id="check_vel_button" class="button button-long button-hidden" disabled="disabled">¡Hecho!</button>\
        ';
        that.ac.add_buttons(canvas_zone_vcentered);
        var pal_wait_time=1;
        for(var i=0;i<that.ac.sec_pal.length;i++){
            if(that.ac.sec_pal[i].min_age<=session_data.age && that.ac.sec_pal[i].max_age>session_data.age){
                pal_wait_time=that.ac.sec_pal[i].sec_pal*1000*that.ac.sentence.split(" ").length;
                break;
            }
        }
        pal_wait_time+=that.ac.sec_init*1000;
        setTimeout(function(){that.ac.velocidad_find_word();}.bind(that), pal_wait_time);
    }

    this.ac.velocidad_find_word=function(){
        that.ac.in_process=false;
        activity_timer.reset();
        activity_timer.start();
        canvas_zone_vcentered.innerHTML=' \
        Escribe la palabra que falta\
        <div class="text-center montessori-div">\
        <p class="montessori">'+that.ac.hide_word(that.ac.sentence,that.ac.word)+'</p>\
        </div>\
        Palabra escondida: <input id="velocidad_answer" class="montessori-40" type="text" value="" autofocus="autofocus" />\
        <br /><br /><button id="check_vel_button" class="button button-long backgroundRed">No me acuerdo</button>\
        ';
        that.ac.add_buttons(canvas_zone_vcentered);
        document.getElementById("check_vel_button").addEventListener(clickOrTouch,function(){that.ac.check();}.bind(that));
        document.getElementById("velocidad_answer").addEventListener('keyup',function(event){that.ac.check_content(event);}.bind(that));
        document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();}); 
    }

    this.ac.check_content=function(e){
        if(document.getElementById('velocidad_answer').value.trim().length>0){
            //document.getElementById("check_vel_button").disabled=false;
            document.getElementById("check_vel_button").classList.remove('backgroundRed'); // button-hidden
            document.getElementById("check_vel_button").innerHTML='¡Hecho!';
            if(e==undefined) e=window.event;
            if(e.keyCode == 13) that.ac.check();
        }else{
            //document.getElementById("check_vel_button").disabled=true;
            document.getElementById("check_vel_button").classList.add('backgroundRed'); // button-hidden
            document.getElementById("check_vel_button").innerHTML='No me acuerdo';
        }
    }

    this.ac.hide_word=function(sentence,word){
        return sentence.replace(word,'¿_?');
    }

    this.ac.check=function(){
        var correct_answer=Asciify.asciify(that.ac.word.toLowerCase());
        var answer=Asciify.asciify(document.getElementById("velocidad_answer").value.toLowerCase());
        that.ac.details={};
        that.ac.details.activity=correct_answer;
        that.ac.details.choice=answer;
        if(answer==correct_answer){
            that.ac.details.result="correct";
            session_data.num_correct++;
        }else{
            that.ac.details.result="incorrect";
        }
        session_data.num_answered++;
        that.ac.end()
    }
}

var velocidad=function(finish_callback){
    if(!check_if_sounds_loaded(function(){velocidad(finish_callback);})){return;}
    preventBackExit();
    remove_modal();
    var vel_obj=new acVelocidad();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    vel_obj.ac.finish_callback=finish_callback;
    
    vel_obj.ac.activities={};
    if(session_data.mode=="training"){
        vel_obj.ac.activities[1]=media_objects.jsons["ac_velocidad_train.json"][1].slice();
        vel_obj.ac.activities[2]=media_objects.jsons["ac_velocidad_train.json"][2].slice();
        vel_obj.ac.activities[3]=media_objects.jsons["ac_velocidad_train.json"][3].slice();
        vel_obj.ac.activities[4]=media_objects.jsons["ac_velocidad_train.json"][4].slice();
        shuffle_array(vel_obj.ac.activities[1]);
        shuffle_array(vel_obj.ac.activities[2]);
        shuffle_array(vel_obj.ac.activities[3]);
        shuffle_array(vel_obj.ac.activities[4]);
        //shuffle_array(media_objects.jsons["ac_conciencia_train.json"][''+vel_obj.ac.level]);
    }else{
        vel_obj.ac.activities[1]=media_objects.jsons["ac_velocidad_test.json"][1].slice();
        vel_obj.ac.activities[2]=media_objects.jsons["ac_velocidad_test.json"][2].slice();
        vel_obj.ac.activities[3]=media_objects.jsons["ac_velocidad_test.json"][3].slice();
        vel_obj.ac.activities[4]=media_objects.jsons["ac_velocidad_test.json"][4].slice();
        var start=Math.floor(Math.random()*(media_objects.jsons["ac_velocidad_train.json"][1].length-(vel_obj.ac.MAX_PLAYED_TIMES_TEST_DRY+1)));
        var dry_activities=media_objects.jsons["ac_velocidad_train.json"][1].slice(start,start+vel_obj.ac.MAX_PLAYED_TIMES_TEST_DRY);
        vel_obj.ac.activities[1]=dry_activities.concat(vel_obj.ac.activities[1]);
    }

    vel_obj.ac.start(); 
}


