"use strict";

//  Show 16 cells 4x4 (see letters combinations below)
//  Randomly pick one syllable e.g., "por" it has to appear 2 to 8 times
//  The dyslexic alternative ("pro") will appear the same amount of times
//  The rest 16-num*2 will be filled by random values except the picked and the dyslexic

var acDiscrVisual=function(){
    this.ac=new Activity('Discr. Visual','discr_visual','start_activity');
    this.ac.help_text='Encuentra la sílaba.';


    this.ac.MAX_PASSED_TIMES_PER_LEVEL_GAME=16;
    this.ac.MAX_PLAYED_TIMES_PER_LEVEL_TEST=4;

    this.ac.letters1=['b','c','f','p'];
    this.ac.letters1_only_r=['d','t','v']
    this.ac.letters2=['a','e','i','o','u']
    this.ac.letters3=['l','r']
    this.ac.syllables_arr=["bal", "bla", "bar", "bra", "bel", "ble", "ber", "bre", "bil", "bli", "bir", "bri", "bol", "blo", "bor", "bro", "bul", "blu", "bur", "bru", "cal", "cla", "car", "cra", "cel", "cle", "cer", "cre", "cil", "cli", "cir", "cri", "col", "clo", "cor", "cro", "cul", "clu", "cur", "cru", "fal", "fla", "far", "fra", "fel", "fle", "fer", "fre", "fil", "fli", "fir", "fri", "fol", "flo", "for", "fro", "ful", "flu", "fur", "fru", "pal", "pla", "par", "pra", "pel", "ple", "per", "pre", "pil", "pli", "pir", "pri", "pol", "plo", "por", "pro", "pul", "plu", "pur", "pru"];

    var that=this;

    this.ac.initialize_syllables=function(){
        for(var i=0;i<that.ac.letters1.length;i++){
            for(var j=0;j<that.ac.letters2.length;j++){
                for(var k=0;k<that.ac.letters3.length;k++){
                    that.ac.syllables_arr.push(that.ac.letters1[i]+that.ac.letters2[j]+that.ac.letters3[k]);
                    that.ac.syllables_arr.push(that.ac.letters1[i]+that.ac.letters3[k]+that.ac.letters2[j]);
                }
            }
        }
    }

    this.ac.start_activity=function(){
        remove_modal();
        if(that.ac.level>that.ac.MAX_LEVELS){
            that.ac.finish();
        }else{
            activity_timer.reset();
            activity_timer.start();
            that.ac.current_corrections={};
            that.ac.current_matrix=[];
            that.ac.train_feedback=0;
            that.ac.syllable=random_item(that.ac.syllables_arr);
            that.ac.dyslexic=that.ac.syllable;
            var temp = that.ac.dyslexic[1];
            var temp2 = that.ac.dyslexic[2];
            that.ac.dyslexic = that.ac.dyslexic.replace(temp, "_").replace(temp2, temp).replace("_", temp2);

            that.ac.syllable_repetition=4;
            if(session_data.mode!="test"){
                that.ac.syllable_repetition=Math.floor((Math.random()*4)+3); // 3 and 6
            }
            for(var i=0;i<that.ac.syllable_repetition;i++){
                that.ac.current_matrix.push(that.ac.syllable);
                that.ac.current_matrix.push(that.ac.dyslexic);
            }
            while(that.ac.current_matrix.length!=16){
                var other=random_item(that.ac.syllables_arr,that.ac.syllable);
                if(other!=that.ac.syllable && other!=that.ac.dyslexic){
                    that.ac.current_matrix.push(other);
                }
            }
            if(debug) console.log(that.ac.syllable+ "  "+that.ac.current_matrix+"  "+that.ac.syllable_repetition);
            shuffle_array(that.ac.current_matrix);
            
            canvas_zone_vcentered.innerHTML='\
            <div id="hinttext">Encuentra: <span class="text-center montessori-40">'+that.ac.syllable+'</span></div>\
            <table id="discr_visual_table" class="noselect">\
                <tr>\
                    <td>'+that.ac.current_matrix[0]+'</td>\
                    <td>'+that.ac.current_matrix[1]+'</td>\
                    <td>'+that.ac.current_matrix[2]+'</td>\
                    <td>'+that.ac.current_matrix[3]+'</td>\
                </tr>\
                <tr>\
                    <td>'+that.ac.current_matrix[4]+'</td>\
                    <td>'+that.ac.current_matrix[5]+'</td>\
                    <td>'+that.ac.current_matrix[6]+'</td>\
                    <td>'+that.ac.current_matrix[7]+'</td>\
                </tr>\
                <tr>\
                    <td>'+that.ac.current_matrix[8]+'</td>\
                    <td>'+that.ac.current_matrix[9]+'</td>\
                    <td>'+that.ac.current_matrix[10]+'</td>\
                    <td>'+that.ac.current_matrix[11]+'</td>\
                </tr>\
                <tr>\
                    <td>'+that.ac.current_matrix[12]+'</td>\
                    <td>'+that.ac.current_matrix[13]+'</td>\
                    <td>'+that.ac.current_matrix[14]+'</td>\
                    <td>'+that.ac.current_matrix[15]+'</td>\
                </tr>\
             </table>\
             <button id="ac_check" class="button button-long" >¡Hecho!</button>\
            ';
            that.ac.hinttext=document.getElementById('hinttext');
            if(session_data.mode=="test" && that.ac.played_times<that.ac.MAX_PLAYED_TIMES_TEST_DRY){
                that.ac.hinttext.innerHTML="[ENTRENA] "+that.ac.hinttext.innerHTML;
            }
            that.ac.add_buttons(canvas_zone_vcentered);
            document.getElementById("ac_check").addEventListener(clickOrTouch,function(){that.ac.check();});
            that.ac.table = document.getElementById("discr_visual_table");
            for (var i = 0;i<that.ac.table.rows.length; i++) {
               for (var j = 0;j<that.ac.table.rows[i].cells.length; j++) {
                    that.ac.table.rows[i].cells[j].addEventListener(clickOrTouch,function(){
                        that.ac.click_action(this);
                    });
               }  
            }
        }
    }


    this.ac.click_action=function(elem){
        if(elem.className.indexOf('covered')!=-1){ // already covered
            elem.classList.remove('covered');
            if(that.ac.current_corrections.hasOwnProperty(elem.innerHTML)){
                that.ac.current_corrections[elem.innerHTML]++;
            }else{
                that.ac.current_corrections[elem.innerHTML]=1;
            }
        } 
        else{elem.classList.add('covered');}
    }


    this.ac.check=function(){
        // mum_correct syllables, num_answered covered plus the missing
        var elem_to_remove=document.getElementById("js-modal-window-alert");
        if(elem_to_remove!=undefined) elem_to_remove.parentNode.removeChild(elem_to_remove);

        var current_correct=0;
        var current_answered=0;
        var choice_counts={};
        current_answered+=that.ac.syllable_repetition;
        for (var i = 0;i<that.ac.table.rows.length; i++) {
           for (var j = 0;j<that.ac.table.rows[i].cells.length; j++) {
                var elem=that.ac.table.rows[i].cells[j];
                if(elem.className.indexOf('covered')!=-1){
                    if(choice_counts.hasOwnProperty(elem.innerHTML)){
                        choice_counts[elem.innerHTML]++;
                    }else{
                        choice_counts[elem.innerHTML]=1;
                    }
                    if(elem.innerHTML==that.ac.syllable){
                        current_correct++;
                    }else if(elem.innerHTML==that.ac.dyslexic){
                        current_answered++;
                    }else{
                        current_answered++;
                    }
                }
           }  
        }
        //session_data.num_answered+=current_answered;
        //session_data.num_correct+=current_correct;
        session_data.num_answered+=1;
        session_data.num_correct+=(current_correct/current_answered);

        //alert("correct="+session_data.num_correct+" incorrect/missing="+(session_data.num_answered-session_data.num_correct));

        // build activity details ----------------------------------
        that.ac.details={};
        that.ac.details.activity=that.ac.syllable+that.ac.syllable_repetition;
        that.ac.details.choice="";
        var keys=objectProperties(choice_counts);
        keys.sort(); // alphabetically
        for(var i=0;i<keys.length;i++){
            that.ac.details.choice+=keys[i]+choice_counts[keys[i]]+" ";
        }
        keys=objectProperties(that.ac.current_corrections);
        keys.sort(); // alphabetically
        that.ac.details.choice+="(";
        for(var i=0;i<keys.length;i++){
            that.ac.details.choice+=keys[i]+that.ac.current_corrections[keys[i]]+" ";
        }	
        that.ac.details.choice=that.ac.details.choice.trim()+")";
        // ---------------------------------------------------------

        if(current_correct==that.ac.syllable_repetition &&
           current_correct==current_answered ){
            that.ac.details.result="correct";
        }else{
            if(session_data.mode!='test' && that.ac.train_feedback==0){
                that.ac.train_feedback++;
                open_js_modal_alert('¿Estás seguro?','¿Estás seguro que la respuesta es correcta?',that.ac.check,that.ac.i_am_not_sure,'Sí','No');
                return;
            }
            that.ac.details.result="incorrect";
            that.ac.failed_times++;
        }
        that.ac.end();
    }

    this.ac.i_am_not_sure=function(){
        var elem_to_remove=document.getElementById("js-modal-window-alert");
        elem_to_remove.parentNode.removeChild(elem_to_remove);
    }

}

var discr_visual=function(finish_callback){
    if(!check_if_sounds_loaded(function(){discr_visual(finish_callback);})){return;}
    preventBackExit();
    remove_modal();
    var dv_obj=new acDiscrVisual();
    if(typeof(finish_callback)=='undefined') finish_callback=game;
    dv_obj.ac.finish_callback=finish_callback;
    canvas_zone_vcentered.innerHTML='\
        <div class="text-center montessori-div">\
        <p class="montessori">...cargando...</p>\
        </div>\
        ';
    dv_obj.ac.add_buttons(canvas_zone_vcentered);
        
    // ONLY call initialize if something changes, otherwise use precalculated
    //dv_obj.initialize_syllables();console.log(dv_obj.syllables_arr);
    dv_obj.ac.start();
}

