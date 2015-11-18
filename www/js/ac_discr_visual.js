"use strict";

// this can be better encapsulated as a big object with a start() method...

var dv_obj=new Activity('Discr. Visual','discr_visual')
dv_obj.help_text='Encuentra la sílaba.';

dv_obj.letters1=['b','c','f','p'];
dv_obj.letters1_only_r=['d','t','v']
dv_obj.letters2=['a','e','i','o','u']
dv_obj.letters3=['l','r']
dv_obj.syllables_arr=["bal", "bla", "bar", "bra", "bel", "ble", "ber", "bre", "bil", "bli", "bir", "bri", "bol", "blo", "bor", "bro", "bul", "blu", "bur", "bru", "cal", "cla", "car", "cra", "cel", "cle", "cer", "cre", "cil", "cli", "cir", "cri", "col", "clo", "cor", "cro", "cul", "clu", "cur", "cru", "fal", "fla", "far", "fra", "fel", "fle", "fer", "fre", "fil", "fli", "fir", "fri", "fol", "flo", "for", "fro", "ful", "flu", "fur", "fru", "pal", "pla", "par", "pra", "pel", "ple", "per", "pre", "pil", "pli", "pir", "pri", "pol", "plo", "por", "pro", "pul", "plu", "pur", "pru"];

dv_obj.current_matrix=[];

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
    remove_modal();
	session_data.type="discr_visual";
	canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">en construcción</p>\
        </div>\
        ';
    dv_obj.add_buttons(canvas_zone_vcentered);
	// ONLY call initialize if something changes, otherwise use precalculated
	//dv_obj.initialize_syllables();
	//console.log(dv_obj.syllables_arr);
	dv_obj.show_matrix();
}


dv_obj.show_matrix=function(){
	dv_obj.current_matrix=[];
	var syllable=random_item(dv_obj.syllables_arr);
	var dyslexic=syllable;
	var temp = dyslexic[1];
	var temp2 = dyslexic[2];
	//dyslexic[1] = dyslexic[2];
	//dyslexic[2] = temp;
	dyslexic = dyslexic.replace(temp, "_").replace(temp2, temp).replace("_", temp2);

	var repetition=Math.floor((Math.random()*5)+2); // 2 and 6
	for(var i=0;i<repetition;i++){
		dv_obj.current_matrix.push(syllable);
		dv_obj.current_matrix.push(dyslexic);
	}
	while(dv_obj.current_matrix.length!=16){
		var other=random_item(dv_obj.syllables_arr,syllable);
		if(other!=syllable && other!=dyslexic){
			dv_obj.current_matrix.push(other);
		}
	}
	if(debug) console.log(syllable+ "  "+dv_obj.current_matrix+"  "+repetition);
	shuffle_array(dv_obj.current_matrix);
	alert(dv_obj.current_matrix);
}


