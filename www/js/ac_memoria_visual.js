"use strict";


var acMemVis=function(){
    this.ac=new Activity('Memoria Visual','memoria_visual','start_activity');
    this.ac.help_text='Intenta memorizar estas imágenes. Después tendrás que localizarlas.';

    this.ac.MAX_LEVELS=6;
    this.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME=4;
    this.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST=2;
    //this.ac.MAX_FAILED_TIMES_TEST=2;
    var that=this;




    this.ac.start_activity=function(){
        if(that.ac.level>that.ac.MAX_LEVELS){ //|| (session_data.mode=="test" && !game_mode && that.ac.failed_times>=that.ac.MAX_FAILED_TIMES_TEST) ){
            that.ac.finish();
        }else{
            //if(session_data.mode=="test" && this.played_times==this.MAX_PLAYED_TIMES_TEST_DRY) that.ac.level=1; level is reset in common
            that.ac.current_usr_answer=[];
            that.ac.current_usr_answer_corrected=false;
            var sprite_images=wordimage_image_ref; //['pato','gato','sol','pez','tren','sal','col','reja','oreja','koala','bala','ala'];
            that.ac.options = random_array(sprite_images,9);
            if(debug) console.log(that.ac.options);

            // elegir n imagenes segun el nivel alcanzado (sin repetidos)
            that.ac.current_key_answer = random_array(that.ac.options,that.ac.level);
            that.ac.uncovered=0;
            if(debug) console.log(that.ac.current_key_answer);
            
            var pattern_representation="";
            for(var i=0;i<that.ac.current_key_answer.length;i++){
                pattern_representation+='<div class="membox"><div class="wordimage wordimage-'+that.ac.current_key_answer[i]+' covered"></div></div>';
            }
            canvas_zone_vcentered.innerHTML='\
                    <div id="hinttext">Memoriza los dibujos</div> \
                    <div id="xx">\
                    '+pattern_representation+'\
                    </div>\
                  <button id="playb" class="button">PLAY</button>\
            '; // en orden
            that.ac.add_buttons(canvas_zone_vcentered);
            that.ac.hinttext=document.getElementById('hinttext');
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
            }
            document.getElementById("playb").addEventListener(clickOrTouch,function(){
                document.getElementById('playb').disabled=true;
                document.getElementById('playb').classList.add('button-hidden');
                that.ac.memoria_visual_uncover_next();
            });
        }
    }

    this.ac.memoria_visual_uncover_next=function(){
        that.ac.in_process=true;
        // don't worry about recursion, all functions will end there
        if(that.ac.uncovered==that.ac.current_key_answer.length){
            that.ac.uncovered=0;
            setTimeout(function(){that.ac.memoria_visual_find_pattern();}, 4000);
        }else{	//uncover...
            document.getElementById('xx').children[that.ac.uncovered].children[0].classList.remove('covered');
            that.ac.uncovered++;
            setTimeout(function(){that.ac.memoria_visual_uncover_next();}.bind(that), 2000);
        }
    }

    this.ac.memoria_visual_find_pattern=function(){
        that.ac.in_process=false;
        activity_timer.reset();
        activity_timer.start();
        canvas_zone_vcentered.innerHTML='\
                Pulsa los dibujos\
                <div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[0]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[1]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[2]+'"></div></div>\
                </div>\
                <div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[3]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[4]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[5]+'"></div></div>\
                </div>\
                <div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[6]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[7]+'"></div></div>\
                    <div class="membox"><div class="wordimage wordimage-'+that.ac.options[8]+'"></div></div>\
                </div>\
                <button id="ac_check" class="button button-long" >¡Hecho!</button>\
        '; //  en orden
        that.ac.add_buttons(canvas_zone_vcentered);
        var boxes=document.getElementsByClassName("wordimage");
        for(var i=0;i<boxes.length;i++){
            boxes[i].addEventListener(clickOrTouch,function(){
                that.ac.box_click(this);
                });
        }
        document.getElementById("ac_check").addEventListener(clickOrTouch,function(){that.ac.check();});
    }

    this.ac.box_click=function(element){
        if(element.className.indexOf('covered')!=-1){
            element.classList.remove('covered');
            that.ac.current_usr_answer_corrected=true;
            var temp_elem=element.classList[1].split("-")[1];
            for(var i=0;i<that.ac.current_usr_answer.length;i++){
                    if(that.ac.current_usr_answer[i]==temp_elem){
                        that.ac.current_usr_answer.splice(i,1);
                    }
            }
        }else{
            element.classList.add('covered');
            that.ac.current_usr_answer.push(element.classList[1].split("-")[1]);
        }
    }

    this.ac.check=function (element){
        var boxes=document.getElementsByClassName("covered");
        that.ac.details={};
        // Add .sort() if order does not matter or remove if it matters
        that.ac.details.activity=that.ac.current_key_answer.sort().toString();
        that.ac.details.choice=that.ac.current_usr_answer.sort().toString();
        if(debug) console.log(that.ac.details.choice);
        if(that.ac.details.activity==that.ac.details.choice){
            that.ac.details.result="correct";
            session_data.num_correct++;
        }else{
            that.ac.details.result="incorrect";
        }
        if(that.ac.current_usr_answer_corrected) that.ac.details.choice+="(corr)";
        session_data.num_answered++;
        that.ac.end();
    }
}

var memoria_visual=function(finish_callback){
    if(!check_if_sounds_loaded(function(){memoria_visual(finish_callback);})){return;}
    preventBackExit();
    remove_modal();
    var memvis_obj=new acMemVis();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    memvis_obj.ac.finish_callback=finish_callback;
    memvis_obj.ac.start();
}
