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
        console.log('NOTE: Trying to access a subject that still does not have any result...');
        cache_user_subjects[session_data.subject]={"general":{"user":session_data.user,"subject": session_data.subject},"elements":[]};
    }
    show_user_results();
};


var show_user_results=function(){
    if(cache_user_subject_results.hasOwnProperty(session_data.subject) && cache_user_subject_results[session_data.subject].elements.length==0){
        document.getElementById("results-div").innerHTML="<b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
    }else{
        document.getElementById("results-div").innerHTML='\
         <div style=""><span style="font-weight:bold;">'+cache_user_subject_results[session_data.subject].general.subject+'</span><button id="stat" class="stat"></button></div><table id="results-table"  class="results-table"></table>';
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
        document.getElementById("stat").addEventListener(clickOrTouch,analize_subject);
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
    <div class="fixed-top-left"><img src="'+media_objects.images['logo-afan.png'].src+'" /><br /><span class="small-text">Programa CoLE</span></div>\
	<button id="go-back" class="minibutton fixed-top-right no-print">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){
        prevent_scrolling();
        document.getElementById("zone_canvas").style.background=bkgr_canvas;
        document.getElementById("zone_canvas").style.overflow='hidden';
        document.getElementById("page").style.background=bkgr_page;
        document.getElementById("page").style.overflow='hidden';
        document.getElementById("header").style.display="block";
        explore_results();
     }.bind(bkgr_canvas,bkgr_page)); 
    if(!cache_user_subject_results.hasOwnProperty(session_data.subject)){
        console.log('NOTE: Trying to access a subject that still does not have any result...');
        cache_user_subjects[session_data.subject]={"general":{"user":session_data.user,"subject": session_data.subject},"elements":[]};
    }
    show_subject_analysis();
};


var show_subject_analysis=function(){
    if(cache_user_subject_results[session_data.subject].elements.length==0){
        document.getElementById("results-div").innerHTML="<b>"+cache_user_subject_results[session_data.subject].general.subject+"</b><br />No hay resultados";
    }else{
        var analysis=analyze_subject_data(); // per activity type
        // último, media (min,max), tests
        //           <table id="results-table"  class=\"results-table\"></table>\

        document.getElementById("results-div").innerHTML='\
         <br /><br />\
         <b>'+cache_user_subject_results[session_data.subject].general.subject+'</b><br />\
           Edad: '+cache_user_subject_results[session_data.subject].elements[0].age+'<br />\
           <br />Conciencia\
           <div id="chart-conciencia" style="width:80%;margin:0 auto;"></div>\
           <div id="text-conciencia" class="small-text">No hay suficientes datos</div>\
           <br /><br />Memoria Visual\
           <div id="chart-memoria_visual" style="width:80%;margin:0 auto;"></div>\
           <div id="text-memoria_visual" class="small-text">No hay suficientes datos</div>\
           <br /><br />Ritmo\
           <div id="chart-ritmo" style="width:80%;margin:0 auto;"></div>\
           <div id="text-ritmo" class="small-text">No hay suficientes datos</div>\
           <br /><br />Velocidad\
           <div id="chart-velocidad" style="width:80%;margin:0 auto;"></div>\
           <div id="text-velocidad" class="small-text">No hay suficientes datos</div>\
           <br /><br />Discriminación visual\
           <div id="chart-discr_visual" style="width:80%;margin:0 auto;"></div>\
           <div id="text-discr_visual" class="small-text">No hay suficientes datos</div>\
           <br />\
         ';
        // cuando lo guardemos añadir las horas de "juego"
        // conciencia: 5h
        // ritmo: xh
        for (var type in analysis) {
            if (analysis.hasOwnProperty(type) && analysis[type].data.length>1) {
                 new Chartist.Line('#chart-'+type, 
                                    {labels: analysis[type].labels, //
                                    series: [analysis[type].data]}, //
                                    {height: '200px',  
                                    lineSmooth: Chartist.Interpolation.cardinal({fillHoles: true}),
                                    //fullWidth: true, chartPadding: {right: 40}, // could be removed but looks a bit bad if only 2 tests
                                    low: 0, high: 1});
                document.getElementById('text-'+type).innerHTML='min: '+analysis[type].min.toFixed(2)+' - max: '+analysis[type].max.toFixed(2)+' - media: '+analysis[type].mean.toFixed(2);
            }
        }
    }
}

var global2normal_results=function(data){
    var normal_data=[];
    for(var i=0;i<data.length;i++){
        if(data[i].hasOwnProperty('result') && data[i].result['conciencia']!='-') normal_data.push({timestamp:data[i].timestamp,type:'conciencia',result:data[i].result['conciencia']});
        if(data[i].hasOwnProperty('result') && data[i].result['memoria_visual']!='-') normal_data.push({timestamp:data[i].timestamp,type:'memoria_visual',result:data[i].result['memoria_visual']});
        if(data[i].hasOwnProperty('result') && data[i].result['ritmo']!='-') normal_data.push({timestamp:data[i].timestamp,type:'ritmo',result:data[i].result['ritmo']});
        if(data[i].hasOwnProperty('result') && data[i].result['velocidad']!='-') normal_data.push({timestamp:data[i].timestamp,type:'velocidad',result:data[i].result['velocidad']});
        if(data[i].hasOwnProperty('result') && data[i].result['discr_visual']!='-') normal_data.push({timestamp:data[i].timestamp,type:'discr_visual',result:data[i].result['discr_visual']});
    }
    return normal_data;
}


var analyze_subject_data=function(){
    return analyze_data(cache_user_subject_results[session_data.subject].elements);
}

var analyze_data=function(data){
    // inverse for to order by date (earliest first)
    var analysis={};
    // compute labels & data
    for (var i=data.length-1;i>=0;--i){
        var type=data[i].type;
        var result=Number(data[i].result);
        var date=data[i].timestamp.substr(0,10);
        if (!analysis.hasOwnProperty(type)){
            analysis[type]={'min':result,'max':result,'sum':result, 'elems':1, 'labels':[date.substr(8,2).replace(/^0+/, '')+'.'+date.substr(5,2).replace(/^0+/, '')+'.'+date.substr(2,2)], 'data':[result]};
        }else{
            analysis[type].labels.push(date.substr(8,2).replace(/^0+/, '')+'.'+date.substr(5,2).replace(/^0+/, '')+'.'+date.substr(2,2));
            analysis[type].data.push(result);
            if(result>analysis[type].max) analysis[type].max=result;
            if(result<analysis[type].min) analysis[type].min=result;
            analysis[type].sum+=result;
            analysis[type].elems++;
            if(analysis[type].labels.length>2) analysis[type].labels[analysis[type].labels.length-2]=analysis[type].labels.length-1;
        }
    }

    // calculations
    for (var type in analysis) {
        if (analysis.hasOwnProperty(type)) {
            analysis[type].mean=analysis[type].sum/analysis[type].elems;
        }
    }
    
    return analysis;
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
    <div class="fixed-top-left"><img src="'+media_objects.images['logo-afan.png'].src+'" /><br /><span class="small-text">Programa CoLE</span></div>\
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
    
    show_summary_view();
}

var calculate_user_summary_view=function(){
    var ret={'general':{'user':session_data.user},'elements':[]};
    for (var subj in cache_user_subject_results) {
        if (cache_user_subject_results.hasOwnProperty(subj)) {
            if(ret.elements.length==0 || ret.elements[ret.elements.length-1].subject!=subj){
                ret.elements.push({
                                   'subject':subj,'conciencia':'-','memoria_visual':'-','ritmo':'-','velocidad':'-','discr_visual':'-','timestamp':'-',
                                   'result':{'subject':subj,'conciencia':'-','memoria_visual':'-','ritmo':'-','velocidad':'-','discr_visual':'-','timestamp':'-'},
                                   'complete': 'no'
                                   });
            }
        }
        for(var i=0;i<cache_user_subject_results[subj].elements.length;i++){
            if(ret.elements[ret.elements.length-1][cache_user_subject_results[subj].elements[i].type]=='-'){
                ret.elements[ret.elements.length-1][cache_user_subject_results[subj].elements[i].type]=cache_user_subject_results[subj].elements[i].num_correct+'/'+cache_user_subject_results[subj].elements[i].num_answered;
                ret.elements[ret.elements.length-1].timestamp=cache_user_subject_results[subj].elements[i].timestamp;
                ret.elements[ret.elements.length-1].result[cache_user_subject_results[subj].elements[i].type]=cache_user_subject_results[subj].elements[i].result;
                ret.elements[ret.elements.length-1].result.timestamp=cache_user_subject_results[subj].elements[i].timestamp;
            }
        }
    }
    return ret;
}

var show_summary_view=function(){
    var user_summary_view=calculate_user_summary_view();
    if(user_summary_view.length==0){
        document.getElementById("results-div").innerHTML="<br />No hay resultados";
    }else{
        document.getElementById("results-div").innerHTML='<br /><br />';
        var data2=classify_results_by_age(user_summary_view.elements); //data.elements
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
                        { data: 'conciencia', col_header: 'conc'},
                        { data: 'memoria_visual', col_header: 'memvis'},
                        { data: 'ritmo'},
                        { data: 'velocidad', col_header: 'vel'},
                        { data: 'discr_visual', col_header: 'discr'},
                    ]
                } );
                var analysis=analyze_data(global2normal_results(data2[age_generation]));
                var table_analysis=[
                                    {'analysis':'min','conciencia':'-','memoria_visual':'-','ritmo':'-','velocidad':'-','discr_visual':'-'},
                                    {'analysis':'media','conciencia':'-','memoria_visual':'-','ritmo':'-','velocidad':'-','discr_visual':'-'},
                                    {'analysis':'max','conciencia':'-','memoria_visual':'-','ritmo':'-','velocidad':'-','discr_visual':'-'}
                                    ];
                document.getElementById("results-div").innerHTML+='<table id="analysis-table'+age_generation+'" class="results-table"></table>';
                for (var type in {'conciencia':0,'memoria_visual':0,'ritmo':0,'velocidad':0,'discr_visual':0}) {
                    if (analysis.hasOwnProperty(type)) {
                        table_analysis[0][type]=analysis[type].min.toFixed(2);
                        table_analysis[1][type]=analysis[type].mean.toFixed(2);
                        table_analysis[2][type]=analysis[type].max.toFixed(2);
                    }
                }
                var results_table=document.getElementById("analysis-table"+age_generation);
                DataTableSimple.call(results_table, {
                    data: table_analysis,
                    //row_id: 'id',
                    //pagination_date: 30,
                    columns: [
                        //{ data: 'id' },
                        { data: 'analysis', col_header: '-calc-',  format: 'first_12'},
                        { data: 'conciencia', col_header: 'conc'},
                        { data: 'memoria_visual', col_header: 'memvis'},
                        { data: 'ritmo'},
                        { data: 'velocidad', col_header: 'vel'},
                        { data: 'discr_visual', col_header: 'discr'},
                    ]
                } );
                document.getElementById("results-div").innerHTML+='<br />';
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




var explore_result_detail=function(session_id){
	preventBackExit();
	canvas_zone_vcentered.innerHTML=' \
	<div id="results-div">cargando detalle resultado '+session_id+'...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){explore_results();});
	if(!cache_user_subject_result_detail.hasOwnProperty(session_id)){
        console.log('NOTE: Trying to access session details which does not exist!!');
        cache_user_subject_result_detail[session_id]={"general":{"session":session_id},"elements":[]};
    }
    show_user_results_detail(session_id);

};



var show_user_results_detail=function(session_id){
    if(!cache_user_subject_result_detail[session_id].hasOwnProperty('elements') || cache_user_subject_result_detail[session_id].elements.length==0){
        document.getElementById("results-div").innerHTML="Sesión: "+cache_user_subject_result_detail[session_id].general.session+"<br />No hay detalles";
    }else{
        document.getElementById("results-div").innerHTML=""+cache_user_subject_result_detail[session_id].elements[0].subject+" - <span title=\""+session_id+"\">"+cache_user_subject_result_detail[session_id].elements[0].type+"</span><br /><table style=\"border:1px solid black; margin: 0 auto;\" id=\"results-table\"  class=\"results-table\"></table>";
        var results_table=document.getElementById("results-table");
        DataTableSimple.call(results_table, {
            data: cache_user_subject_result_detail[session_id].elements,
            pagination: 8,
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


/*
            for (var type in {'conciencia':0,'memoria_visual':0,'ritmo':0,'velocidad':0,'discr_visual':0}) {
                if (analysis.hasOwnProperty(type)) {
                    document.getElementById("analysis-table'+age_generation").innerHTML+='\
                        <tr><b>'+type+'</b> min:'+analysis[type].min.toFixed(2)+', max:'+analysis[type].max.toFixed(2)+', media:'+analysis[type].mean.toFixed(2)+'</div>\
                      ';
                }else{
                    document.getElementById("analysis-table'+age_generation").innerHTML+='\
                        <div><b>'+type+'</b> min: -, max: -, media: -</div>\
                      ';
                }
            }
*/
/*var analyze_subject_data_merged_types=function(){
    // inverse for to order by date (earliest first), max one per day (the last of that day)
    var analysis={};
    var labels=[];
    var types=[];
    var types_counts={};
    var type_min_count=2;
    
    // compute types
    for (var i=cache_user_subject_results[session_data.subject].elements.length-1;i>=0;--i){
        var type=cache_user_subject_results[session_data.subject].elements[i].type;
        var date=cache_user_subject_results[session_data.subject].elements[i].timestamp.substr(0,10);
        if (!types_counts.hasOwnProperty(type)) types_counts[type]=1;
        else types_counts[type]++;
        if(!analysis.hasOwnProperty(type) && types_counts[type]==type_min_count){
            analysis[type]={'min':999,'max':-1,'sum':0, 'elems':0, 'labels':[], 'data':[]};
            types.push(type);
        } 
    }

    // compute labels & data (one per day, the last one)
    for (var i=cache_user_subject_results[session_data.subject].elements.length-1;i>=0;--i){
        var type=cache_user_subject_results[session_data.subject].elements[i].type;
        var result=cache_user_subject_results[session_data.subject].elements[i].result;
        var date=cache_user_subject_results[session_data.subject].elements[i].timestamp.substr(0,10);
        if (analysis.hasOwnProperty(type)){
            if(labels.indexOf(date)==-1){
                labels.push(date);
                for(var x=0;x<types.length;x++){
                    analysis[types[x]].labels.push(date);
                    analysis[types[x]].data.push(null);
                }
            }
            analysis[type].data[labels.indexOf(date)]=Number(result);
        }
    }
    for (var type in analysis) {
        if (analysis.hasOwnProperty(type)) {
            for(var x=0;x<analysis[type].data.length;x++){
                var elem=analysis[type].data[x];
                if(elem!=null){
                    elem=Number(elem);
                    if(elem>analysis[type].max) analysis[type].max=elem;
                    if(elem<analysis[type].min) analysis[type].min=elem;
                    analysis[type].sum+=elem;
                    analysis[type].elems++;
                }
                analysis[type].labels[x]=x;
            }
        }
    }
    // calculations
    for (var type in analysis) {
        if (analysis.hasOwnProperty(type)) {
            analysis[type].mean=analysis[type].sum/analysis[type].elems;
        }
    }
    
    return analysis;
}*/
