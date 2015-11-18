"use strict";

var Activity= function (name,type){
    this.name=name;
    this.name=type;
    this.level=1;
    this.level_played_times=0;
    this.level_passed_times=0;
    this.played_times=0;
    this.help_text="";
    this.MAX_LEVELS=-1;
    this.MAX_PASSED_PER_LEVEL=-1;
    this.MAX_PLAYS_PER_LEVEL=-1;
    this.MAX_PLAYED_TIMES=-1;
    this.MAX_FAILURES=-1;
    this.MAX_FAILURES_IN_A_LEVEL=-1;
}
Activity.prototype.show_help=function(){
    open_js_modal_alert(this.name,this.help_text);
}
Activity.prototype.add_buttons=function(elem){
    elem.innerHTML+='\
    <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
    <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
    ';
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){this.show_help();}.bind(this));
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();});
}
Activity.prototype.reset_vars=function(){
    this.level=1;
    this.level_played_times=0;
    this.level_passed_times=0;
    this.played_times=0;
}
Activity.prototype.send_data=function(){

}
Activity.prototype.correct_answer_actions=function(){
    if(session_data.mode!="test"){
        audio_sprite.playSpriteRange("zfx_correct");
        the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
    }
    session_data.num_correct++;
    this.level_passed_times++;
    if(this.MAX_PASSED_PER_LEVEL!=-1 && this.level_passed_times>=this.MAX_PASSED_PER_LEVEL){
        this.level_passed_times=0;
        this.level++;
        this.played_times=0;
    }
}
Activity.prototype.incorrect_answer_actions=function(){
    
}

// Activity.prototype.start; // to be defined by each activity

// find common patterns and abstract here

// e.g., playing patterns, levels handling..., playing vars... avoid repeating var names with "memory" and "speed"
