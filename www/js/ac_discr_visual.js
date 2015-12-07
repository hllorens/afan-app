"use strict";

// this can be better encapsulated as a big object with a start() method...

var dv_obj=new Activity('Discr. Visual','discr_visual','start_activity');
dv_obj.help_text='Encuentra la sílaba.';
dv_obj.MAX_PLAYED_TIMES_TEST=2;
dv_obj.MAX_PLAYED_TIMES=10;
dv_obj.MAX_FAILURES=5;

dv_obj.letters1=['b','c','f','p'];
dv_obj.letters1_only_r=['d','t','v']
dv_obj.letters2=['a','e','i','o','u']
dv_obj.letters3=['l','r']
dv_obj.syllables_arr=["bal", "bla", "bar", "bra", "bel", "ble", "ber", "bre", "bil", "bli", "bir", "bri", "bol", "blo", "bor", "bro", "bul", "blu", "bur", "bru", "cal", "cla", "car", "cra", "cel", "cle", "cer", "cre", "cil", "cli", "cir", "cri", "col", "clo", "cor", "cro", "cul", "clu", "cur", "cru", "fal", "fla", "far", "fra", "fel", "fle", "fer", "fre", "fil", "fli", "fir", "fri", "fol", "flo", "for", "fro", "ful", "flu", "fur", "fru", "pal", "pla", "par", "pra", "pel", "ple", "per", "pre", "pil", "pli", "pir", "pri", "pol", "plo", "por", "pro", "pul", "plu", "pur", "pru"];



dv_obj.initialize_syllables=function(){
	for(var i=0;i<dv_obj.letters1.length;i++){
		for(var j=0;j<dv_obj.letters2.length;j++){
			for(var k=0;k<dv_obj.letters3.length;k++){
				dv_obj.syllables_arr.push(dv_obj.letters1[i]+dv_obj.letters2[j]+dv_obj.letters3[k]);
				dv_obj.syllables_arr.push(dv_obj.letters1[i]+dv_obj.letters3[k]+dv_obj.letters2[j]);
			}			
		}		
	}
}

/*

Show 16 cells 4x4
use the list:
pal ... pul
par ... pur
bar ... bur
bal ... bul
far ... fur
fal ... ful
tar ... tra
e invertir

first letter:         b c f p
first letter only r:  d t v
second letter: vowels
third letter: l or r

Randomly pick one syllable e.g., "por" it has to appear 2 to 8 times
Randomly pick the times it will appear e.g., 4
Then the dyslexic alternative ("pro") will appear the same amount of times (4)
Finally the rest 16-num*2 will be filled by random values except the picked and the dyslexic

Train: play until the user fails 10 times or has played 20 times
Test: play 6 times and store the result

*/
var discr_visual=function(){
    if(!check_if_sounds_loaded(discr_visual)){return;}
	preventBackExit();
	canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">...cargando...</p>\
        </div>\
        ';
    dv_obj.add_buttons(canvas_zone_vcentered);
        
    // ONLY call initialize if something changes, otherwise use precalculated
    //dv_obj.initialize_syllables();console.log(dv_obj.syllables_arr);
    dv_obj.current_matrix=[];
    dv_obj.train_feedback=0;
    dv_obj.start();
}


dv_obj.start_activity=function(){
    remove_modal();
	if((session_data.mode=='test' && dv_obj.played_times>=dv_obj.MAX_PLAYED_TIMES_TEST) ||
        (session_data.mode!='test' && (dv_obj.played_times>dv_obj.MAX_PLAYED_TIMES || dv_obj.failed_times>dv_obj.MAX_FAILURES))){
		dv_obj.finish();
	}else{
        activity_timer.reset();
        activity_timer.start();
		dv_obj.current_corrections={};
		dv_obj.current_matrix=[];
		dv_obj.syllable=random_item(dv_obj.syllables_arr);
		dv_obj.dyslexic=dv_obj.syllable;
		var temp = dv_obj.dyslexic[1];
		var temp2 = dv_obj.dyslexic[2];
		dv_obj.dyslexic = dv_obj.dyslexic.replace(temp, "_").replace(temp2, temp).replace("_", temp2);

		dv_obj.syllable_repetition=4;
		if(session_data.mode!="test"){
			dv_obj.syllable_repetition=Math.floor((Math.random()*4)+3); // 3 and 6
		}
		for(var i=0;i<dv_obj.syllable_repetition;i++){
			dv_obj.current_matrix.push(dv_obj.syllable);
			dv_obj.current_matrix.push(dv_obj.dyslexic);
		}
		while(dv_obj.current_matrix.length!=16){
			var other=random_item(dv_obj.syllables_arr,dv_obj.syllable);
			if(other!=dv_obj.syllable && other!=dv_obj.dyslexic){
				dv_obj.current_matrix.push(other);
			}
		}
		if(debug) console.log(dv_obj.syllable+ "  "+dv_obj.current_matrix+"  "+dv_obj.syllable_repetition);
		shuffle_array(dv_obj.current_matrix);
		
		canvas_zone_vcentered.innerHTML='\
	    <div class="text-center montessori-40">'+dv_obj.syllable+'</div>\
	    <table id="discr_visual_table" class="noselect">\
	        <tr>\
	            <td>'+dv_obj.current_matrix[0]+'</td>\
	            <td>'+dv_obj.current_matrix[1]+'</td>\
	            <td>'+dv_obj.current_matrix[2]+'</td>\
	            <td>'+dv_obj.current_matrix[3]+'</td>\
	        </tr>\
	        <tr>\
	            <td>'+dv_obj.current_matrix[4]+'</td>\
	            <td>'+dv_obj.current_matrix[5]+'</td>\
	            <td>'+dv_obj.current_matrix[6]+'</td>\
	            <td>'+dv_obj.current_matrix[7]+'</td>\
	        </tr>\
	        <tr>\
	            <td>'+dv_obj.current_matrix[8]+'</td>\
	            <td>'+dv_obj.current_matrix[9]+'</td>\
	            <td>'+dv_obj.current_matrix[10]+'</td>\
	            <td>'+dv_obj.current_matrix[11]+'</td>\
	        </tr>\
	        <tr>\
	            <td>'+dv_obj.current_matrix[12]+'</td>\
	            <td>'+dv_obj.current_matrix[13]+'</td>\
	            <td>'+dv_obj.current_matrix[14]+'</td>\
	            <td>'+dv_obj.current_matrix[15]+'</td>\
	        </tr>\
	     </table>\
	     <button id="dv_check" class="button button-long" >Hecho!</button>\
	    ';
		dv_obj.add_buttons(canvas_zone_vcentered);
		document.getElementById("dv_check").addEventListener(clickOrTouch,function(){dv_obj.check();});
		dv_obj.table = document.getElementById("discr_visual_table");
		for (var i = 0;i<dv_obj.table.rows.length; i++) {
		   for (var j = 0;j<dv_obj.table.rows[i].cells.length; j++) {
		        dv_obj.table.rows[i].cells[j].addEventListener(clickOrTouch,function(){
		            dv_obj.click_action(this);
		        });
		   }  
		}
	}
}


dv_obj.click_action=function(elem){
	if(elem.className.indexOf('covered')!=-1){ // already covered
		elem.classList.remove('covered');
		if(dv_obj.current_corrections.hasOwnProperty(elem.innerHTML)){
			dv_obj.current_corrections[elem.innerHTML]++;
		}else{
			dv_obj.current_corrections[elem.innerHTML]=1;
		}
	} 
    else{elem.classList.add('covered');}
}


dv_obj.check=function(){
    /*
        num_correct... num correct syllables through all the session or test
        num_answered counts the covered plus the missing
        Use details:
        activity: syllable          pro4  (syllable + repetition)
        choice: covered syllables:  pro3 por2 ...  (por2 bla1)
        result:                     correct/incorrect
    */
    var elem_to_remove=document.getElementById("js-modal-window-alert");
    if(elem_to_remove!=undefined) elem_to_remove.parentNode.removeChild(elem_to_remove);

	var current_correct=0;
	var current_answered=0;
	var choice_counts={};
    session_data.num_answered+=dv_obj.syllable_repetition;
    current_answered+=dv_obj.syllable_repetition;
    for (var i = 0;i<dv_obj.table.rows.length; i++) {
       for (var j = 0;j<dv_obj.table.rows[i].cells.length; j++) {
            var elem=dv_obj.table.rows[i].cells[j];
            if(elem.className.indexOf('covered')!=-1){
				if(choice_counts.hasOwnProperty(elem.innerHTML)){
					choice_counts[elem.innerHTML]++;
				}else{
					choice_counts[elem.innerHTML]=1;
				}
                if(elem.innerHTML==dv_obj.syllable){
                    session_data.num_correct++;
					current_correct++;
                }else if(elem.innerHTML==dv_obj.dyslexic){
                    session_data.num_answered++;
                    current_answered++;
                }else{
                    session_data.num_answered++;
					current_answered++;
                }
            }
       }  
    }
	//alert("correct="+session_data.num_correct+" incorrect/missing="+(session_data.num_answered-session_data.num_correct));

	// build activity details ----------------------------------
	dv_obj.details={};
	dv_obj.details.activity=dv_obj.syllable+dv_obj.syllable_repetition;
	dv_obj.details.choice="";
	var keys=objectProperties(choice_counts);
	keys.sort(); // alphabetically
	for(var i=0;i<keys.length;i++){
		dv_obj.details.choice+=keys[i]+choice_counts[keys[i]]+" ";
	}
	keys=objectProperties(dv_obj.current_corrections);
	keys.sort(); // alphabetically
	dv_obj.details.choice+="(";
	for(var i=0;i<keys.length;i++){
		dv_obj.details.choice+=keys[i]+dv_obj.current_corrections[keys[i]]+" ";
	}	
	dv_obj.details.choice=dv_obj.details.choice.trim()+")";
	// ---------------------------------------------------------

	if(current_correct==dv_obj.syllable_repetition &&
       current_correct==current_answered ){
		dv_obj.details.result="correct";
	}else{
        if(session_data.mode!='test' && dv_obj.train_feedback==0){
            dv_obj.train_feedback++;
            open_js_modal_alert('¿Estás seguro?','¿Estás seguro que la respuesta es correcta?',dv_obj.check,dv_obj.i_am_not_sure,'Sí','No');
            return;
        }
		dv_obj.details.result="incorrect";
		dv_obj.failed_times++;
	}
    dv_obj.train_feedback=0;
	dv_obj.played_times++;
	dv_obj.end(dv_obj.details.result);

}

dv_obj.i_am_not_sure=function(){
    var elem_to_remove=document.getElementById("js-modal-window-alert");
    elem_to_remove.parentNode.removeChild(elem_to_remove);
}



