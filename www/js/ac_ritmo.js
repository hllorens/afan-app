"use strict";


// start with 1 pattern and up to 6
var acRitmo=function(){
    this.ac=new Activity('Ritmo','ritmo','start_activity');
    this.ac.help_text='Escucha la secuencia. Después tendrás que reproducirla.';
    this.ac.MAX_LEVELS=6;
    this.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME=4;
    this.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST=2; // all the activities
    //this.ac.MAX_FAILED_TIMES_TEST=2;
    var that=this;



    this.ac.start_activity=function(){
        if(that.ac.level>that.ac.MAX_LEVELS){ //|| (session_data.mode=="test" && !game_mode && that.ac.failed_times>=that.ac.MAX_FAILED_TIMES_TEST)
            that.ac.finish();
        }else{
            that.ac.started=true;
            that.ac.ta_played_once=true;that.ac.taa_played_once=true;that.ac.both_played_once=true; // for safety, if level changed directly
            that.ac.current_usr_answer=[];
            that.ac.current_key_answer=that.ac.generate_pattern(that.ac.level);
            canvas_zone_vcentered.innerHTML='\
                <div id="hinttext">Pulsa PLAY para escuchar secuencia</div>\
                <div id="sound"><button id="playb" class="button">PLAY</button></div> \
                <div style="border:0px dotted #eee;min-height:52px;"><span id="anspan">&nbsp;</span></div>  \
                <button id="pta" class="button button-fat button-hidden" disabled="disabled">.</button>\
                <button id="ptaa" class="button button-fat button-hidden" disabled="disabled">___</button>\
                <br /><br /><button id="ac_check" class="button button-hidden" disabled="disabled">¡Hecho!</button> <button id="borrarb" class="button backgroundRed button-hidden" disabled="disabled">borrar</button>\
             ';//+that.ac.current_key_answer;
            that.ac.add_buttons(canvas_zone_vcentered);
            that.ac.playb=document.getElementById('playb');
            that.ac.hinttext=document.getElementById('hinttext');
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
            }
            that.ac.anspan=document.getElementById('anspan');
            that.ac.borrarb=document.getElementById('borrarb');
            that.ac.playb.addEventListener(clickOrTouch,function(){that.ac.play_pattern();});
            that.ac.borrarb.addEventListener(clickOrTouch,function(){that.ac.borrar();});
            document.getElementById("ac_check").addEventListener(clickOrTouch,function(){that.ac.check();}.bind(that));
            document.getElementById("pta").addEventListener(clickOrTouch,function(){that.ac.play_ta();}.bind(that));
            document.getElementById("ptaa").addEventListener(clickOrTouch,function(){that.ac.play_taa();}.bind(that));
        }
    }

    this.ac.borrar=function(){
        if(that.ac.current_usr_answer.length==0) return;
        //var item=that.ac.anspan.lastElementChild;
        //that.ac.anspan.removeChild(item);
        that.ac.current_usr_answer=[]; //.pop();
        if(that.ac.current_usr_answer.length==0){
            that.ac.borrarb.classList.add('button-hidden');
            that.ac.borrarb.disabled=true;
        }
    }


    this.ac.play_pattern=function(){
        if(that.ac.in_process){alert('disabled: in process');return;}
        else{
            that.ac.in_process=true;
            if(session_data.mode=="test"){
                that.ac.playb.classList.add('button-hidden');
            }
            document.getElementById("pta").disabled=true;
            document.getElementById("ptaa").disabled=true;
            document.getElementById("ac_check").disabled=true;
            that.ac.playb.disabled=true;
            AudioLib.play_sound_arr(that.ac.current_key_answer,that.ac.play_pattern_ended);
        }
    }

    this.ac.generate_pattern=function(length){
        var pat=[];
        for(var i=0;i<length;i++){
            pat.push((Math.random() <0.5 ? "ta35.m4a" : "ta150.m4a"));
        }
        if(debug) console.log(pat);
        return pat;
    }

    this.ac.play_pattern_ended=function(){
        that.ac.in_process=false;
        that.ac.borrar();
        document.getElementById("pta").disabled=false;
        document.getElementById("ptaa").disabled=false;
        document.getElementById("ac_check").disabled=false;
        that.ac.playb.disabled=false;
        document.getElementById("pta").classList.remove('button-hidden');
        document.getElementById("ptaa").classList.remove('button-hidden');
        document.getElementById("ac_check").classList.remove('button-hidden');
        that.ac.hinttext.innerHTML='¿qué has escuchado?';
        if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
            that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
        }
        activity_timer.reset();
        activity_timer.start();
    }


    this.ac.play_ta=function(){
        if(!that.ac.both_played_once){
            that.ac.ta_played_once=true;
        }
        that.ac.play_sound('ta35.m4a');
    }
    this.ac.play_taa=function(){
        if(!that.ac.both_played_once){
            that.ac.taa_played_once=true;
        }
        that.ac.play_sound('ta150.m4a');
    }

    this.ac.play_sound=function(s){
        if(that.ac.in_process){return;}
        else{
            that.ac.in_process=true;
            /*document.getElementById("ac_check").classList.add('button-hidden');
            document.getElementById("pta").classList.add('button-hidden');
            document.getElementById("ptaa").classList.add('button-hidden');*/
            document.getElementById("pta").disabled=true;
            document.getElementById("ptaa").disabled=true;
            document.getElementById("ac_check").disabled=true;
            if(that.ac.started){
                that.ac.playb.disabled=true;
                that.ac.current_usr_answer.push(s);
                var symbol=".";
                if(s=="ta150.m4a") symbol="___";
                //that.ac.anspan.innerHTML+=' <button class="button button-flat">'+symbol+'</div>';
                if(that.ac.current_usr_answer.length>0){
                    that.ac.borrarb.disabled=true;
                    //that.ac.borrarb.classList.add('button-hidden');
                }
            }
            AudioLib.play_sound_single(s,that.ac.play_sound_end);
        }
    }

    this.ac.play_sound_end=function(){
        that.ac.in_process=false;
        document.getElementById("pta").disabled=false;
        document.getElementById("ptaa").disabled=false;
        document.getElementById("ac_check").disabled=false;
        /*document.getElementById("pta").classList.remove('button-hidden');
        document.getElementById("ptaa").classList.remove('button-hidden');
        document.getElementById("ac_check").classList.remove('button-hidden');*/
        if(!that.ac.ta_played_once || !that.ac.taa_played_once){
            return;
        }else if(!that.ac.both_played_once && that.ac.ta_played_once && that.ac.taa_played_once){
            that.ac.both_played_once=true;
            document.getElementById("ac_check").classList.remove('button-hidden');
            that.ac.hinttext.innerHTML="Pulsa Empezar";
        }else{
            that.ac.playb.disabled=false;
            if(that.ac.current_usr_answer.length>0){
                that.ac.borrarb.disabled=false;
                that.ac.borrarb.classList.remove('button-hidden');
            }
            if(that.ac.current_usr_answer.length>that.ac.MAX_LEVELS) that.ac.check();
        }
    }

    this.ac.check=function(){
        that.ac.details={};
        that.ac.details.activity=that.ac.current_key_answer.toString().replace(/ta35.m4a/g,'.').replace(/ta150.m4a/g,'___');
        that.ac.details.choice=that.ac.current_usr_answer.toString().replace(/ta35.m4a/g,'.').replace(/ta150.m4a/g,'___');
        if(debug) console.log(that.ac.details.activity+" vs "+that.ac.details.choice);
        if(that.ac.details.activity==that.ac.details.choice){
            that.ac.details.result="correct";
            session_data.num_correct++;
        }else{
            that.ac.details.result="incorrect";
        }
        session_data.num_answered++;
        that.ac.end();
    }
}


var ritmo=function(finish_callback){
    if(!check_if_sounds_loaded(function(){ritmo(finish_callback);})){return;}
    AudioLib.init(media_objects.sounds,debug); // for non sprite sounds
    preventBackExit();
    remove_modal();
    var ritmo_obj=new acRitmo();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    ritmo_obj.ac.finish_callback=finish_callback;
    ritmo_obj.ac.started=false;
    canvas_zone_vcentered.innerHTML='\
        <div id="hinttext">Pulsa para escuchar los sonidos</div>\
        <div style="min-height:52px;"></div> \
        <div style="min-height:52px;"></div>\
        <button id="pta" class="button button-fat">.</button>\
        <button id="ptaa" class="button button-fat">___</button>\
        <br /><button id="ac_check" class="button button-long button-hidden" disabled="disabled">¡Empezar!</button>\
        ';//+ritmo_obj.current_key_answer;
    ritmo_obj.ac.add_buttons(canvas_zone_vcentered);
    ritmo_obj.ac.hinttext=document.getElementById('hinttext');
    ritmo_obj.ac.ta_played_once=false;
    ritmo_obj.ac.taa_played_once=false;
    ritmo_obj.ac.both_played_once=false;
    document.getElementById("ac_check").addEventListener(clickOrTouch,function(){ritmo_obj.ac.start();}.bind(ritmo_obj));
    document.getElementById("pta").addEventListener(clickOrTouch,function(){ritmo_obj.ac.play_ta();}.bind(ritmo_obj));
    document.getElementById("ptaa").addEventListener(clickOrTouch,function(){ritmo_obj.ac.play_taa();}.bind(ritmo_obj));
}

