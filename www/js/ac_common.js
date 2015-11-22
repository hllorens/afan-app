"use strict";


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
    this.level=1;
    this.level_played_times=0;
    this.level_passed_times=0;
    this.played_times=0;
    this.failed_times=0;
    this.help_text="";
	this.details={};
    this.MAX_LEVELS=-1;
    this.MAX_PASSED_PER_LEVEL=-1;
    this.MAX_PLAYS_PER_LEVEL=-1;
    this.MAX_PLAYED_TIMES=-1;
    this.MAX_PLAYED_TIMES_TEST=-1;
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
Activity.prototype.reset=function(){
    this.level=1;
    this.level_played_times=0;
    this.level_passed_times=0;
    this.played_times=0;
    this.failed_times=0;
	this.details={};
	session_data.type=this.type;
	session_data.num_correct=0;
	session_data.num_answered=0;
	session_data.duration=0;
    session_data.details=[];
    activity_timer.reset();
}
Activity.prototype.start=function(){
	remove_modal();
	this.reset();
	session_data.timestamp=Activity.get_timestamp();
	this[this.callback_name]();
}
Activity.prototype.next_activity=function(){
	remove_modal();
	activity_timer.stop();
	this.details.timestamp=Activity.get_timestamp();
	this.details.duration=activity_timer.seconds;
	session_data.details.push(this.details);
	session_data.duration+=activity_timer.seconds;
	activity_timer.reset();
	this[this.callback_name]();
}
Activity.prototype.end=function(res){
	var waiting_time=300;
    var the_content='<h1>...siguiente actividad...</h1>';
    if(session_data.mode!="test"){
		waiting_time=1000; // >soundLength (could be on_sound_end but too short for image show)
		if(res=="correct"){
		    audio_sprite.playSpriteRange("zfx_correct"); 
		    the_content='<div class="js-modal-img"><img src="'+media_objects.images['correct.png'].src+'"/></div>';
		}else if(res="incorrect"){
			audio_sprite.playSpriteRange("zfx_wrong"); // add a callback to move forward after the sound plays...
			the_content='<div class="js-modal-img"><img src="'+media_objects.images['wrong.png'].src+'"/></div>';
		}else{
			throw new Error('ac_check_actions: res is not "correct" or "incorrect"');
		}
    }
    open_js_modal_content(the_content);
	setTimeout(function(){this.next_activity();}.bind(this), waiting_time);

}

Activity.get_timestamp=function(){
	var timestamp=new Date();
	var timestamp_str=timestamp.getFullYear()+"-"+
		pad_string((timestamp.getMonth()+1),2,"0") + "-" + pad_string(timestamp.getDate(),2,"0") + " " +
		 pad_string(timestamp.getHours(),2,"0") + ":"  + pad_string(timestamp.getMinutes(),2,"0") + 
			":"  + pad_string(timestamp.getSeconds(),2,"0");
	return timestamp_str;
}


// find common patterns and abstract here

// e.g., playing patterns, levels handling..., playing vars... avoid repeating var names with "memory" and "speed"
