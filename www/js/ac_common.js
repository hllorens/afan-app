"use strict";

var Activity = (function(){
    // better use "options" json instead of parameters
    var Activity=function (name,type,callback_name){
        if(typeof(name)=='undefined')
            throw new Error('Activity name must be defined');
        if(typeof(type)=='undefined')
            throw new Error('Activity type must be defined');
        if(typeof(callback_name)=='undefined')
            throw new Error('Activity callback_name for '+name+' must be defined');
        this.name=name;
        this.type=type;
        this.callback_name=callback_name;
        this.finish_callback="not set";
        this.in_process=false;
        this.MIN_LEVEL=1;
        this.level=this.MIN_LEVEL;
        this.level_played_times=0;
        this.level_passed_times=0;
        this.level_failed_times=0;
        this.played_times=0;
        this.passed_times=0;
        this.failed_times=0;
        this.help_text="";
        this.details={};
        this.MAX_LEVELS=1;
        this.MAX_PASSED_TIMES_PER_LEVEL_GAME=10;
        this.MAX_PLAYED_TIMES_PER_LEVEL_TEST=10;
        this.MAX_PLAYED_TIMES_PER_LEVEL_TEST_DRY=1;
        this.MAX_PLAYED_TIMES_TEST=-1;
        this.MAX_PLAYED_TIMES_TEST_DRY=2;
        this.MAX_FAILURES=-1;
        this.MAX_FAILURES_IN_A_LEVEL=-1;
    }
    Activity.prototype.show_help=function(){
        open_js_modal_alert(this.name,this.help_text);
    }
    Activity.prototype.select_level=function(elem){
        if(this.MAX_LEVELS<=1){
            elem.innerHTML='Seleccionar nivel<br /><br />\
                            Sólo hay un nivel<br /><br />\
                            <span class="level">nivel '+this.level+'</span> \
                            <br /><br /><br /><button id="change_level" class="button">Hecho</button>\
            ';
         
        }else{
            elem.innerHTML='Seleccionar nivel<br /><br /><br />\
                            <button id="decrease" class="minibutton plusminus">-</button>\
                            <span class="level">nivel '+this.level+'</span> \
                            <button id="increase" class="minibutton plusminus">+</button>\
                            <br /><br /><br /><button id="change_level" class="button">Hecho</button>\
            ';
            document.getElementById("decrease").addEventListener(clickOrTouch,function(){
                if(this.level>1){this.level--;} this.select_level(elem);
                }.bind(this));
            document.getElementById("increase").addEventListener(clickOrTouch,function(){
                if(this.level<this.MAX_LEVELS){this.level++;} this.select_level(elem);
            }.bind(this));
        }
        document.getElementById("change_level").addEventListener(clickOrTouch,function(){
            this.played_times=0;
            this.level_played_times=0;
            this.level_passed_times=0;
            this.failed_times=0;
            this[this.callback_name]();
        }.bind(this));
    }
    Activity.prototype.add_buttons=function(elem){
        var sel_level="";
        if(session_data.mode!="test"){
            sel_level='<button id="level_button" class="minibutton fixed-bottom-left2 level">'+this.level+'</button>';
        }
        elem.innerHTML+='\
        <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
        '+sel_level+' \
        <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
        document.getElementById("help_button").addEventListener(clickOrTouch,function(){if(!this.in_process) this.show_help();}.bind(this));
        document.getElementById("go-back").addEventListener(clickOrTouch,function(){if(!this.in_process) game();}.bind(this));
        document.getElementById("header_text").removeEventListener(clickOrTouch,menu_screen); // if comes from menu
        document.getElementById("header_text").innerHTML=this.type;
        if(session_data.mode!="test"){
            document.getElementById("level_button").addEventListener(clickOrTouch,function(){if(!this.in_process) this.select_level(elem);}.bind(this));
        }
    }
    Activity.prototype.reset=function(){
        this.played_times=0;
        this.reset_dry();
    }
    Activity.prototype.reset_dry=function(){
        this.level=this.MIN_LEVEL;
        this.passed_times=0;
        this.reset_level();
        this.reset_dry_soft();
    }
    Activity.prototype.reset_dry_soft=function(){
        this.failed_times=0;
        this.level_failed_times=0;
        this.details={};
        session_data.type=this.type;
        session_data.num_correct=0;
        session_data.num_answered=0;
        session_data.duration=0;
        session_data.details=[];
    }
    Activity.prototype.reset_level=function(){
        this.level_played_times=0;
        this.level_passed_times=0;
        this.level_failed_times=0;
    }    
    Activity.prototype.start=function(){
        remove_modal();
        this.reset();
        session_data.timestamp=get_timestamp_str();
        // Set defaults, the activity must change them if needed
        this.max_passed_times_this_level_game=this.MAX_PASSED_TIMES_PER_LEVEL_GAME;
        this.max_played_times_this_level_test=this.MAX_PLAYED_TIMES_PER_LEVEL_TEST;
        this.max_played_times_this_level_test_dry=this.MAX_PLAYED_TIMES_PER_LEVEL_TEST_DRY;
        this[this.callback_name]();
    }
    Activity.prototype.next_activity=function(){
        remove_modal();
        activity_timer.stop();
        this.details.id=''+(session_data.details.length+1);
        this.details.subject=session_data.subject;
        this.details.type=session_data.type;
        this.details.timestamp=get_timestamp_str();
        this.details.duration=activity_timer.seconds;
        session_data.details.push(this.details);
        session_data.duration+=activity_timer.seconds;
        activity_timer.reset();
        if(session_data.mode=="test" && this.played_times<this.MAX_PLAYED_TIMES_TEST_DRY){
            this.reset_dry_soft();
        }else if(session_data.mode=="test" && this.played_times==this.MAX_PLAYED_TIMES_TEST_DRY){
            this.reset_dry();
        }
        if((session_data.mode!="test" && this.level_passed_times>=this.max_passed_times_this_level_game) || 
           (session_data.mode=="test" && 
                (this.played_times<this.MAX_PLAYED_TIMES_TEST_DRY  && this.level_played_times>=this.max_played_times_this_level_test_dry) ||
                (this.played_times>=this.MAX_PLAYED_TIMES_TEST_DRY && this.level_played_times>=this.max_played_times_this_level_test) 
            )){
            this.reset_level();
            this.level++;
        }
        // Set defaults, the activity must change them if needed
        this.max_passed_times_this_level_game=this.MAX_PASSED_TIMES_PER_LEVEL_GAME;
        this.max_played_times_this_level_test=this.MAX_PLAYED_TIMES_PER_LEVEL_TEST;
        this.max_played_times_this_level_test_dry=this.MAX_PLAYED_TIMES_PER_LEVEL_TEST_DRY;
        this[this.callback_name]();
    }
    Activity.prototype.end=function(){
        this.played_times++;
        this.level_played_times++;
        if(this.details.result=="correct"){
            this.passed_times++;
            this.level_passed_times++;
        }else if(this.details.result="incorrect"){
            this.failed_times++;
            this.level_failed_times++;
        }else{
            throw new Error('ac_check_actions: details.result is not "correct" or "incorrect"');
        }
        var waiting_time=300;
        var the_content='<h1>...siguiente actividad...</h1>';
        if(session_data.mode!="test"){
            waiting_time=1000; // >soundLength (could be on_sound_end but too short for image show)
            if(this.details.result=="correct"){
                audio_sprite.playSpriteRange("zfx_correct"); 
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
            }else if(this.details.result="incorrect"){
                audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';
            }
        }
        open_js_modal_content(the_content);
        setTimeout(function(){this.next_activity();}.bind(this), waiting_time);
    }

    Activity.prototype.finish=function(){
        var the_content='<h1>...fin del juego...</h1>';
        if(session_data.mode!="test" || game_mode){
            var waiting_time=2000; // >soundLength (could be on_sound_end but too short for image show)
            if(this.details.result=="correct"){
                audio_sprite.playSpriteRange("zfx_correct"); // TODO play another sound!!
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['happy.png'].src+'"/></div>';
                open_js_modal_content(the_content);
            }else if(this.details.result="incorrect"){
                waiting_time=100;
                /*audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
                the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';*/
            }else{
                throw new Error('finish: details.result is not "correct" or "incorrect"');
            }
            setTimeout(function(){this.finish_callback();}.bind(this), waiting_time);
            //send_session_data(this.finish_callback); is done in game if duration is not 0
        }else{
            send_session_data(this.finish_callback);
        }
    }
    
    return Activity;
})();



(function(){
    if (typeof define === 'function' && define.amd)
        define('Activity', function () { return Activity; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = Activity;
    else
        window.Activity = Activity;
})();


// END ------------------------------------------------------------------------

/*
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
        var training_extra_fields='';
        if(session_data.mode=="training"){
            training_extra_fields='<div id="current_score">\
            Correctas : <span id="current_score_num">0</span>\
            </div>';
        }
                document.getElementById('remaining_activities_num').innerHTML=""+(conciencia_obj.remaining_rand_activities.length-1);
        dom_score_correct=document.getElementById('current_score_num');
        dom_score_answered=document.getElementById('current_answered_num');
        activity_timer.anchor_to_dom(document.getElementById('activity_timer_span'));
        dom_score_answered.innerHTML=session_data.num_answered;
        document.getElementById('remaining_activities_num').innerHTML=""+(conciencia_obj.remaining_rand_activities.length-1);  


*/


// find common patterns and abstract here

// e.g., playing patterns, levels handling..., playing vars... avoid repeating var names with "memory" and "speed"
