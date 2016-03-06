"use strict";

var explore_results=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando resultados...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){show_results();});
    if(!cache_user_subject_results.hasOwnProperty(session_data.subject)){
        ajax_request_json(
            backend_url+'ajaxdb.php?action=get_results&user='+session_data.user+'&subject='+session_data.subject, 
            function(data) {
                cache_user_subject_results[session_data.subject]=data;
                show_user_results();
            });
    }else{
        show_user_results();
    }
};

var show_user_results=function(){
    if(cache_user_subject_results[session_data.subject].elements.length==0){
        document.getElementById("results-div").innerHTML="<b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
    }else{
        document.getElementById("results-div").innerHTML='\
         <b>'+cache_user_subject_results[session_data.subject].general.subject+"</b><br /><table id=\"results-table\"  class=\"results-table\"></table>";
        var results_table=document.getElementById("results-table");
        DataTableSimple.call(results_table, {
            data: cache_user_subject_results[session_data.subject].elements,
            row_id: 'id',
            pagination_date: 5,
            columns: [
                //{ data: 'id' },
                { data: 'type', col_header: 'tipo',  format: 'first_12'},
//                    { data: 'mode', col_header: 'Modo',  format: 'first_4'},
                //{ data: 'age', col_header: 'edad' },
//                    { data: 'duration', col_header: 'Tiempo',  format: 'time_from_seconds_up_to_mins'}, 
                { data: 'num_correct', col_header: 'corr' },
                { data: 'num_answered', col_header: 'total' },
                { data: 'ver', col_header: 'detalle', link_function_id_button: 'explore_result_detail' }
            ]
        } );
        if(cache_cognitionis_pagination_page!=0){
            document.getElementById('results-table-nav').children[cache_cognitionis_pagination_page].click();
        }
    }
}

var analize_subject=function(){
	preventBackExit();
    var bkgr_canvas=document.getElementById("zone_canvas").style.background;
    var bkgr_page=document.getElementById("page").style.background;
    document.getElementById("header").style.display="none";
    document.getElementById("page").style.background="#fff";
    document.getElementById("page").style.overflow='auto';
    document.getElementById("zone_canvas").style.background="#fff";
    document.getElementById("zone_canvas").style.overflow='auto';
    allow_scrolling();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando resumen para imprimir...</div> \
	<button id="go-back" class="minibutton fixed-top-right no-print">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){
        prevent_scrolling();
        document.getElementById("zone_canvas").style.background=bkgr_canvas;
        document.getElementById("zone_canvas").style.overflow='hidden';
        document.getElementById("page").style.background=bkgr_page;
        document.getElementById("page").style.overflow='hidden';
        document.getElementById("header").style.display="block";
        show_results();
     }.bind(bkgr_canvas,bkgr_page)); 
    if(!cache_user_subject_results.hasOwnProperty(session_data.subject)){
        ajax_request_json(
            backend_url+'ajaxdb.php?action=get_results&user='+session_data.user+'&subject='+session_data.subject, 
            function(data) {
                cache_user_subject_results[session_data.subject]=data;
                show_subject_analysis();
            });
    }else{
        show_subject_analysis();
    }
};

var show_subject_analysis=function(){
    if(cache_user_subject_results[session_data.subject].elements.length==0){
        document.getElementById("results-div").innerHTML="<b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
    }else{
        var analysis_data={}; // per activity type
        // último, media (min,max), tests
        document.getElementById("results-div").innerHTML='\
         <b>'+cache_user_subject_results[session_data.subject].general.subject+'</b><br />\
           Edad:     Curso(-repetidos): <br />\
           Análisis: <br />\
           <table id="results-table"  class=\"results-table\"></table>\
           <br />\
           Progreso: gráfico de progreso\
         ';
         // cuando lo guardemos añadir las horas de "juego"
         // conciencia: 5h
         // ritmo: xh
    }
}






var summary_view=function(session_id){
	preventBackExit();
    var bkgr_canvas=document.getElementById("zone_canvas").style.background;
    var bkgr_page=document.getElementById("page").style.background;
    document.getElementById("header").style.display="none";
    document.getElementById("page").style.background="#fff";
    document.getElementById("page").style.overflow='auto';
    document.getElementById("zone_canvas").style.background="#fff";
    document.getElementById("zone_canvas").style.overflow='auto';
    allow_scrolling();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando resumen para imprimir...</div> \
	<button id="go-back" class="minibutton fixed-top-right no-print">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){
        prevent_scrolling();
        document.getElementById("zone_canvas").style.background=bkgr_canvas;
        document.getElementById("zone_canvas").style.overflow='hidden';
        document.getElementById("page").style.background=bkgr_page;
        document.getElementById("page").style.overflow='hidden';
        document.getElementById("header").style.display="block";
        show_results();
     }.bind(bkgr_canvas,bkgr_page)); 
    if(!cache_user_summary_view.hasOwnProperty('general')){
        ajax_request_json(
            backend_url+'ajaxdb.php?action=get_results_global&user='+session_data.user,
            function(data) {
                cache_user_summary_view=data;
                show_summary_view();
            }
        );
    }else{
        show_summary_view();        
    }
}

var show_summary_view=function(){
    if(cache_user_summary_view.length==0){
        document.getElementById("results-div").innerHTML="<br />No hay resultados";
    }else{
        document.getElementById("results-div").innerHTML='';
        var data2=classify_results_by_age(cache_user_summary_view.elements); //data.elements
        for(var age_generation in data2) {
            if (data2.hasOwnProperty(age_generation)) {
                document.getElementById("results-div").innerHTML+='\
                 <b>'+age_generation+' años</b><br /><table id="results-table'+age_generation+'" class="results-table"></table>';
                var results_table=document.getElementById("results-table"+age_generation);
                DataTableSimple.call(results_table, {
                    data: data2[age_generation],
                    //row_id: 'id',
                    //pagination_date: 30,
                    columns: [
                        //{ data: 'id' },
                        { data: 'subject', col_header: 'nombre',  format: 'first_12'},
                        { data: 'conciencia'},
                        { data: 'memoria_visual', col_header: 'memvis'},
                        { data: 'ritmo'},
                        { data: 'velocidad', col_header: 'veloc'},
                        { data: 'discr_visual', col_header: 'discr'},
                    ]
                } );
            }
        }
    }
}




var classify_results_by_age=function(data){
    var result={};
    for(var i=0;i<data.length;i++){
        var class_age=calculateAgeGeneration(cache_user_subjects[data[i]['subject']].birthdate,data[i]['timestamp']);
        if(!result.hasOwnProperty(class_age)){
            result[class_age]=[];
        }
        result[class_age].push(data[i]);
    }
    return result;
}


var summary_view2=function(){
    var bkgr_canvas=document.getElementById("zone_canvas").style.background;
    var bkgr_page=document.getElementById("page").style.background;
    document.getElementById("header").style.display="none";
    document.getElementById("page").style.background="#fff";
    document.getElementById("page").style.overflow='auto';
    document.getElementById("zone_canvas").style.background="#fff";
    document.getElementById("zone_canvas").style.overflow='auto';
    allow_scrolling();
	canvas_zone_vcentered.innerHTML=' \
	<button id="go-back" class="minibutton fixed-top-right no-print">&larr;</button> \
	<div id="results-div"><b>Resumen</b><br /><table id="results-table" class="results-table">\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>\
    </table></div> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){
        prevent_scrolling();
        document.getElementById("zone_canvas").style.background=bkgr_canvas;
        document.getElementById("zone_canvas").style.overflow='hidden';
        document.getElementById("page").style.background=bkgr_page;
        document.getElementById("page").style.overflow='hidden';
        document.getElementById("header").style.display="block";
        show_results();
     }.bind(bkgr_canvas,bkgr_page)); 
}


var explore_result_detail=function(session_id){
	preventBackExit();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando detalle resultado '+session_id+'...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){explore_results();});
	if(!cache_user_subject_result_detail.hasOwnProperty(session_id)){
		ajax_request_json(
			backend_url+'ajaxdb.php?action=get_result_detail&session='+session_id+'&user='+session_data.user, 
			function(data) {
				cache_user_subject_result_detail[session_id]=data;
                show_user_results_detail(session_id);
            }
        );
    }else{
        show_user_results_detail(session_id);
    }
};


var show_user_results_detail=function(session_id){
    if(!cache_user_subject_result_detail[session_id].hasOwnProperty('elements') || cache_user_subject_result_detail[session_id].elements.length==0){
        document.getElementById("results-div").innerHTML="Sesión: "+cache_user_subject_result_detail[session_id].general.session+"<br />No hay detalles";
    }else{
        document.getElementById("results-div").innerHTML=""+cache_user_subject_result_detail[session_id].elements[0].subject+" - <span title=\""+session_id+"\">"+cache_user_subject_result_detail[session_id].elements[0].type+"</span><br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"  class=\"results-table\"></table>";
        var results_table=document.getElementById("results-table");
        DataTableSimple.call(results_table, {
            data: cache_user_subject_result_detail[session_id].elements,
            pagination: 6,
            row_id: 'id',
            columns: [
                //{ data: 'id' },
                //{ data: 'id', col_header: 'id', link_function_id: 'explore_result_detail_individual' },
                //{ data: 'activity', format: 'first_12' },
                //{ data: 'choice'  , format: 'first_12'},
                { data: 'result',  col_header: 'resultado',  special: 'red_incorrect' },
                //{ data: 'duration',  format: 'time_from_seconds_up_to_mins'}
                { data: 'ver', col_header: 'detalle', link_function_id_button: 'explore_result_detail_individual' }
            ]
        } );
    }
}



var explore_result_detail_individual=function(session_ac_id){
	preventBackExit();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando detalle resultado '+session_ac_id+'...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    var found=false;
    for(var session_id in cache_user_subject_result_detail) {
        if (cache_user_subject_result_detail.hasOwnProperty(session_id)) {
            for(var i=0;i<cache_user_subject_result_detail[session_id].elements.length;i++){
                if(cache_user_subject_result_detail[session_id].elements[i].id==session_ac_id){
                    found=true;
                    var restext="correcto";
                    var incorrect_style="";
                    if(cache_user_subject_result_detail[session_id].elements[i].result=="incorrect"){
                        restext="incorrecto";
                        incorrect_style="style=\"color: red;\""; //background color
                    }
                    document.getElementById("results-div").innerHTML=""+cache_user_subject_result_detail[session_id].elements[i].subject+" - <span title=\""+session_id+"-detail"+session_ac_id+"\">"+cache_user_subject_result_detail[session_id].elements[i].type+"</span><br />\
                                                                      Resultado: "+restext+" - duración: "+DataTableSimple.formats.time_from_seconds_up_to_mins(cache_user_subject_result_detail[session_id].elements[i].duration)+"<br />\
                                                                      <table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"  class=\"results-table\">\
                                                                      <tr style=\"background: #333 none repeat scroll 0 0;color: #eee;font-weight: bold;\"><td>Respuesta correcta</td></tr>\
                                                                      <tr><td>"+cache_user_subject_result_detail[session_id].elements[i].activity+"</td></tr>\
                                                                      <tr style=\"background: #333 none repeat scroll 0 0;color: #eee;font-weight: bold;\"><td>Respuesta seleccionada</td></tr>\
                                                                      <tr "+incorrect_style+"><td>"+cache_user_subject_result_detail[session_id].elements[i].choice+"</td></tr>\
                                                                      </table>\
                                                                      ";
                    var session_id_copy=session_id;
                    document.getElementById("go-back").addEventListener(clickOrTouch,function(){
                        explore_result_detail(session_id_copy);
                        });
                    break;break;
                }
            }
        }
   }
   if(!found) document.getElementById("go-back").addEventListener(clickOrTouch,function(){explore_results();});

};



