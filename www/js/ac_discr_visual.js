"use strict";

var discr_visual_help_title='Discr. Visual';
var discr_visual_help='Encuentra la sílaba.';


var discr_visual=function(){
    if(!check_if_sounds_loaded(discr_visual)){return;}
	preventBackExit();
    remove_modal();
	session_data.type="discr_visual";
	canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        <button id="help_button" class="minibutton fixed-bottom-left help">?</button> \
        <button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
    document.getElementById("help_button").addEventListener(clickOrTouch,function(){open_js_modal_alert(discr_visual_help_title,discr_visual_help);});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){game();});  
}

