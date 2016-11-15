"use strict";

var QueryString=get_query_string();
var game_mode=false;
if(QueryString.hasOwnProperty('game_mode') && QueryString.game_mode=='true') game_mode=true;

var app_name='CoLE';

var internet_access=true;
function check_internet_access(){
    check_internet_access_with_img_url('http://www.centroafan.com/logo-afan.jpg',set_internet_access_true,set_internet_access_false);
}
var set_internet_access_true=function(){
    internet_access=true;
    //jsonp_request(backend_url+'ajaxdb.php?jsoncallback=set_session_state&action=gen_session_state');
    if(is_local()){session_state="offline";menu_screen();}
    else{ajax_CORS_request_json(backend_url+'ajaxdb.php?action=gen_session_state',set_session_state);}
}
var set_internet_access_false=function(){
    internet_access=false;
    session_state="offline";
    menu_screen();
}

var set_session_state=function(result) {
    if(result.hasOwnProperty('error') && result.error!=""){alert("SET SESSION STATE ERROR: "+result.error); return;}
    session_state=result.state; //console.log(session_state);
    menu_screen();
};


var backend_url='backend/' //../backend
if(is_local()){backend_url='http://www.centroafan.com/dev-afan-app/www/backend/';}

// MEDIA
var images = [
//"external-git-ignored/afan-app-media/img/spacer158.png",
//"external-git-ignored/afan-app-media/img/AFAN.png",
"external-git-ignored/afan-app-media/img/logo-afan.png",
"external-git-ignored/afan-app-media/img/happy.png",
"external-git-ignored/afan-app-media/img/wordimg-sprite.png",
"external-git-ignored/afan-app-media/img/correct.png",
"external-git-ignored/afan-app-media/img/stat.png",
"external-git-ignored/afan-app-media/img/wrong.png"
];
var sounds = [
	// it can be dropbox https://dl.dropboxusercontent.com/u/188219/
	//or absolute http://www.centroafan.com/afan-app-media/audio/...m4a"
	// relative is the best to reuse it in the cordova app
	"external-git-ignored/afan-app-media/audio/letters80kbps-extns.m4a"
//	"external-git-ignored/afan-app-media/audio/letters128kbps.m4a"
	//"external-git-ignored/afan-app-media/audio/ta30.m4a",
	//"external-git-ignored/afan-app-media/audio/ta120.m4a"
];
var audio_sprite;
var audio_sprite_name='letters80kbps-extns.m4a';
//var audio_sprite_name='letters128kbps.m4a';

// More efficient for offline scenario to use require or dirctly iclude the data
var jsons= [
//	"external-git-ignored/data/ac_conciencia_train.json",
//	"external-git-ignored/data/ac_conciencia_test.json",
//	"external-git-ignored/data/ac_velocidad_train.json",
//	"external-git-ignored/data/ac_velocidad_test.json"
]

var offline_jsons=[];
offline_jsons["ac_conciencia_train.json"]={"2":[{"type":"sounds","sounds":["s","o","l"],"level":2,"answers":["sol","col","sal","pez","tren"]},{"type":"sounds","sounds":["p","e","z"],"level":2,"answers":["pez","tren","sol","sal","col"]},{"type":"sounds","sounds":["s","a","l"],"level":2,"answers":["sal","sol","col","pez","tren"]},{"type":"sounds","sounds":["k","o","l"],"level":2,"answers":["col","sol","sal","pez","tren"]},{"type":"sounds","sounds":["m","a","r","\/","k","o"],"level":2,"answers":["marco","barco","mano","arco","gato","pato"]},{"type":"sounds","sounds":["k","a","\/","m","i","o","n"],"level":2,"answers":["camion","cama","casa","maiz","rama","canya"]},{"type":"sounds","sounds":["a","r","\/","k","o"],"level":2,"answers":["arco","marco","barco","arbol","brazo","faro"]},{"type":"sounds","sounds":["m","a","\/","i","z"],"level":2,"answers":["maiz","mano","lapiz","casa","rama","cama"]},{"type":"sounds","sounds":["p","u","e","n","\/","t","e"],"level":2,"answers":["puente","pastel","dulce","pato","plato","percha"]},{"type":"sounds","sounds":["rr","a","\/","t","o","n"],"level":2,"answers":["raton","gato","pato","gato","mano","sapo"]},{"type":"sounds","sounds":["bv","a","r","\/","k","o"],"level":2,"answers":["barco","marco","brazo","arco","gato","mano"]},{"type":"sounds","sounds":["p","e","r","\/","ch","a"],"level":2,"answers":["percha","mesa","seta","reja","pinya","leche"]},{"type":"sounds","sounds":["rr","e","\/","l","o","j"],"level":2,"answers":["reloj","perro","rojo","reja","ala","leche"]},{"type":"sounds","sounds":["bv","e","r","\/","d","e"],"level":2,"answers":["verde","leche","percha","mesa","seta","piedra"]},{"type":"sounds","sounds":["l","a","\/","p","i","z"],"level":2,"answers":["lapiz","sapo","maiz","papel","casa","bala"]},{"type":"sounds","sounds":["d","u","l","\/","z","e"],"level":2,"answers":["dulce","puente","leche","verde","pluma","azul"]},{"type":"sounds","sounds":["p","a","\/","p","e","l"],"level":2,"answers":["papel","pastel","pato","sapo","lapiz","casa"]},{"type":"sounds","sounds":["a","\/","z","u","l"],"level":2,"answers":["azul","ala","arbol","maiz","papel","casa"]},{"type":"sounds","sounds":["u","\/","bv","a","s"],"level":2,"answers":["uvas","ala","bala","casa","copa","ropa"]},{"type":"sounds","sounds":["a","\/","bv","e","\/","j","a"],"level":2,"answers":["abeja","oreja","almeja","banyera","ballena","aceite"]},{"type":"sounds","sounds":["k","o","\/","n","e","\/","j","o"],"level":2,"answers":["conejo","oreja","abeja","camino","candado","almeja"]},{"type":"sounds","sounds":["p","a","\/","j","a","\/","r","o"],"level":2,"answers":["pajaro","pantano","platano","camara","patata","candado"]},{"type":"sounds","sounds":["o","\/","r","e","\/","j","a"],"level":2,"answers":["oreja","abeja","almeja","conejo","banyera","naranja"]},{"type":"sounds","sounds":["k","u","\/","ch","a","\/","r","a"],"level":2,"answers":["cuchara","camara","corbata","lampara","pajaro","oreja"]},{"type":"sounds","sounds":["a","\/","z","e","i","\/","t","e"],"level":2,"answers":["aceite","abeja","oreja","almeja","anciana","abrigo"]},{"type":"sounds","sounds":["k","a","\/","m","i","\/","s","a"],"level":2,"answers":["camisa","camino","camara","almeja","cortina","maracas"]},{"type":"sounds","sounds":["k","a","\/","m","a","\/","r","a"],"level":2,"answers":["camara","cuchara","camisa","lampara","maracas","camino"]},{"type":"sounds","sounds":["p","a","\/","t","a","\/","t","a"],"level":2,"answers":["patata","pantano","platano","pajaro","camara","corbata"]},{"type":"sounds","sounds":["bv","a","\/","y","e","\/","n","a"],"level":2,"answers":["ballena","banyera","abeja","almeja","oreja","manzana"]},{"type":"sounds","sounds":["y","u","\/","bv","i","\/","a"],"level":2,"answers":["lluvia","abeja","sandia","cuchara","camisa","camino"]}],"3":[{"type":"sounds","sounds":["t","r","e","n"],"level":3,"answers":["tren","pez","sol","sal","col"]},{"type":"sounds","sounds":["p","i","e","\/","d","r","a"],"level":3,"answers":["piedra","pino","pinya","cabra","noria","percha"]},{"type":"sounds","sounds":["l","i","\/","bv","r","o","s"],"level":3,"answers":["libros","arbol","vino","cabra","pino","pinya"]},{"type":"sounds","sounds":["k","a","\/","bv","r","a"],"level":3,"answers":["cabra","casa","cama","faro","canya","cuatro"]},{"type":"sounds","sounds":["p","a","s","\/","t","e","l"],"level":3,"answers":["pastel","papel","pato","plato","gato","gato"]},{"type":"sounds","sounds":["p","l","a","\/","n","o"],"level":3,"answers":["plano","plato","pino","mano","pato","mono"]},{"type":"sounds","sounds":["bv","r","a","\/","z","o"],"level":3,"answers":["brazo","barco","marco","arco","vino","arbol"]},{"type":"sounds","sounds":["k","o","m","\/","p","r","a","r"],"level":3,"answers":["comprar","copa","cabra","noria","ropa","sopa"]},{"type":"sounds","sounds":["k","u","a","\/","t","r","o"],"level":3,"answers":["cuatro","carta","plato","cabra","casa","libros"]},{"type":"sounds","sounds":["p","l","u","\/","m","a"],"level":3,"answers":["pluma","rama","cama","pinya","goma","plato"]},{"type":"sounds","sounds":["a","r","\/","bv","o","l"],"level":3,"answers":["arbol","arco","brazo","barco","faro","marco"]},{"type":"sounds","sounds":["s","a","n","\/","d","i","\/","a"],"level":3,"answers":["sandia","camisa","candado","lluvia","camino","manzana"]},{"type":"sounds","sounds":["k","o","r","\/","bv","a","\/","t","a"],"level":3,"answers":["corbata","cortina","silbato","cuchara","camara","patata"]},{"type":"sounds","sounds":["a","n","\/","z","i","a","\/","n","a"],"level":3,"answers":["anciana","manzana","camino","cortina","naranja","aceite"]},{"type":"sounds","sounds":["s","o","r","\/","p","r","e","\/","s","a"],"level":3,"answers":["sorpresa","sombrilla","sombrero","corbata","cortina"]},{"type":"sounds","sounds":["k","a","n","\/","d","a","\/","d","o"],"level":3,"answers":["candado","pantano","sandia","pescado","camino","pajaro"]},{"type":"sounds","sounds":["s","i","l","\/","bv","a","\/","t","o"],"level":3,"answers":["silbato","corbata","platano","pescado"]},{"type":"sounds","sounds":["a","\/","bv","r","i","\/","g","o"],"level":3,"answers":["abrigo","pajaro","oreja","aceite"]},{"type":"sounds","sounds":["l","a","m","\/","p","a","\/","r","a"],"level":3,"answers":["lampara","camara","pajaro","patata","manzana","cuchara"]},{"type":"sounds","sounds":["p","l","a","\/","t","a","\/","n","o"],"level":3,"answers":["platano","pantano","silbato","pajaro","pescado","candado"]},{"type":"sounds","sounds":["a","l","\/","m","e","\/","j","a"],"level":3,"answers":["almeja","abeja","oreja","banyera","ballena","camisa"]},{"type":"sounds","sounds":["k","o","r","\/","t","i","\/","n","a"],"level":3,"answers":["cortina","corbata","camino","camisa","anciana","sombrilla"]},{"type":"sounds","sounds":["n","a","\/","r","a","n","\/","j","a"],"level":3,"answers":["naranja","oreja","maracas","camara","patata","manzana"]},{"type":"sounds","sounds":["p","e","s","\/","k","a","\/","d","o"],"level":3,"answers":["pescado","pajaro","candado","platano","pantano","silbato"]},{"type":"sounds","sounds":["t","i","\/","j","e","\/","r","a","s"],"level":3,"answers":["tijeras","oreja","abeja","banyera","almeja"]},{"type":"sounds","sounds":["p","a","n","\/","t","a","\/","n","o"],"level":3,"answers":["pantano","platano","pajaro","candado","patata","manzana"]},{"type":"sounds","sounds":["m","a","\/","r","a","\/","k","a","s"],"level":3,"answers":["maracas","camara","lampara","naranja","manzana","patata"]},{"type":"sounds","sounds":["s","o","m","\/","bv","r","i","\/","y","a"],"level":3,"answers":["sombrilla","sombrero","sorpresa","corbata"]},{"type":"sounds","sounds":["m","a","n","\/","z","a","\/","n","a"],"level":3,"answers":["manzana","anciana","pantano","lampara","maracas","camara"]},{"type":"sounds","sounds":["s","o","m","\/","bv","r","e","\/","r","o"],"level":3,"answers":["sombrero","sombrilla","sorpresa"]}],"1":[{"type":"sounds","sounds":["bv","a","\/","l","a"],"level":1,"answers":["bala","ala","casa","rama","cama","canya"]},{"type":"sounds","sounds":["k","o","\/","p","a"],"level":1,"answers":["copa","ropa","sopa","goma","sofa","casa"]},{"type":"sounds","sounds":["rr","o","\/","p","a"],"level":1,"answers":["ropa","copa","sopa","goma","sofa","rama"]},{"type":"sounds","sounds":["s","o","\/","p","a"],"level":1,"answers":["sopa","copa","ropa","sofa","sapo","goma"]},{"type":"sounds","sounds":["g","a","\/","t","o"],"level":1,"answers":["gato","pato","raton","mano","sapo","faro"]},{"type":"sounds","sounds":["m","a","\/","n","o"],"level":1,"answers":["mano","mono","marco","gato","pato","sapo"]},{"type":"sounds","sounds":["p","a","\/","t","o"],"level":1,"answers":["pato","gato","plato","sapo","raton"]},{"type":"sounds","sounds":["rr","a","\/","m","a"],"level":1,"answers":["rama","cama","casa","bala","ropa","goma"]},{"type":"sounds","sounds":["k","a","\/","m","a"],"level":1,"answers":["cama","casa","rama","canya","calla","carta"]},{"type":"sounds","sounds":["s","a","\/","p","o"],"level":1,"answers":["sapo","pato","sopa","gato","mano","faro"]},{"type":"sounds","sounds":["s","e","\/","t","a"],"level":1,"answers":["seta","mesa","reja","sopa","sofa","ala"]},{"type":"sounds","sounds":["p","i","\/","n","o"],"level":1,"answers":["pino","vino","plano","mano","pato","mono"]},{"type":"sounds","sounds":["m","o","\/","n","o"],"level":1,"answers":["mono","mano","pino","rojo","vino","goma"]},{"type":"sounds","sounds":["p","i","\/","ny","a"],"level":1,"answers":["pinya","pino","canya","ala","piedra","copa"]},{"type":"sounds","sounds":["rr","o","\/","j","o"],"level":1,"answers":["rojo","ropa","mono","reloj","perro","reja"]},{"type":"sounds","sounds":["f","a","\/","r","o"],"level":1,"answers":["faro","gato","mano","pato","sapo","gato"]},{"type":"sounds","sounds":["g","o","\/","m","a"],"level":1,"answers":["goma","copa","ropa","sopa","sofa","rama"]},{"type":"sounds","sounds":["l","e","\/","ch","e"],"level":1,"answers":["leche","percha","verde","mesa","seta","perro"]},{"type":"sounds","sounds":["s","o","\/","f","a"],"level":1,"answers":["sofa","sopa","copa","ropa","goma","seta"]},{"type":"sounds","sounds":["g","a","\/","t","o"],"level":1,"answers":["gato","pato","raton","mano","sapo","faro"]},{"type":"sounds","sounds":["bv","i","\/","n","o"],"level":1,"answers":["vino","pino","mano","mono","plano","barco"]},{"type":"sounds","sounds":["k","a","\/","ny","a"],"level":1,"answers":["canya","casa","cama","calla","carta","bala"]},{"type":"sounds","sounds":["p","e","\/","rr","o"],"level":1,"answers":["perro","pato","pino","reloj","sapo","rojo"]},{"type":"sounds","sounds":["rr","e","\/","j","a"],"level":1,"answers":["reja","mesa","seta","ropa","rama","reloj"]},{"type":"sounds","sounds":["k","a","\/","y","a"],"level":1,"answers":["calla","casa","cama","canya","carta","bala"]},{"type":"sounds","sounds":["n","o","\/","r","i","a"],"level":1,"answers":["noria","mono","copa","ropa","sopa","rojo"]}]};
offline_jsons["ac_conciencia_test.json"]={"1":[],"2":[{"type":"sounds","sounds":["a","\/","l","a"],"answers":["ala","pala","sal"],"level":1},{"type":"sounds","sounds":["m","e","\/","s","a"],"answers":["mesa","casa","seta"],"level":1},{"type":"sounds","sounds":["k","a","\/","s","a"],"answers":["casa","carta","cabra"],"level":1},{"type":"sounds","sounds":["k","a","r","\/","t","a"],"answers":["carta","casa","cabra"],"level":1}],"3":[{"type":"sounds","sounds":["bv","a","\/","ny","e","\/","r","a"],"answers":["banyera","ballena","antena"],"level":1},{"type":"sounds","sounds":["k","a","\/","m","i","\/","n","o"],"level":2,"answers":["camino","camisa","camion"]},{"type":"sounds","sounds":["p","l","a","\/","t","o"],"level":3,"answers":["plato","plano","pato"]},{"type":"sounds","sounds":["j","a","\/","u","\/","l","a"],"answers":["jaula","koala","bala"],"level":3}]};
offline_jsons["ac_velocidad_train.json"]={"1":["el toro","un cono","el lado","la mam\u00e1","mis pap\u00e1s","la bola","el enano","la foca","un gato","tus cosas","el cubo","un dado","la vaca","una cena","el pap\u00e1","un pico","los bolos","el l\u00e1piz","C\u00e1diz"],"2":["el perro","la obra","el puerto","la compra","tu carta","mi amigo","la prenda","los pasos","los platos","se ilumin\u00f3","iba girando","se crey\u00f3","el brillante","los divertidos","las conchas","el delgaducho","el cangrejo","el pueblo","un drag\u00f3n","las croquetas","un plumero","el pleito","la flauta","una trampa","la fruteria","la profesora","el lobo feroz","la voluntad","la magnitud","la longitud","la ciudad de Madrid","un d\u00eda feliz","mi amiga Beatriz","voy a Valladolid","mi comunidad","el abad","la cicatriz","una mitad","la sociedad","su nariz","es incapaz","la densidad","pobre infeliz","la igualdad","una cruz","la juventud","el albornoz","la virtud","la vejez","el cacahuete","la prehistoria","el moho","ahora","la bah\u00eda","ahorrar","el veh\u00edculo","el tirachinas","dif\u00edcil"],"3":["El bot\u00f3n era diminuto","A mi padre le encantan los boquerones","Me divierto inventando canciones","El gato desapareci\u00f3 por el callej\u00f3n","Fue todo un descubrimiento","No contest\u00f3 porque estaba despistado","Estaba temblando de fr\u00edo","El sastrecillo valiente es un cuento que me encanta","Salieron disparados al oir la campana","Contaron historias hasta el anochecer","Mirad por la ventana y ver\u00e9is como llueve","Me encanta jugar al pillapilla","Es un poco olvidadiza","Tengo un perro regordete","Vimos un submarino antiguo","Me encantan los libros de aventuras","Estas un poco despeinado","Hicimos una carrera nadando","Jugamos a los exploradores","Los monstruos no existen","Comenzaron a bailar al oir la m\u00fasica","Fui corriendo hasta mi casa","El barco navegaba por el mar","Explot\u00e9 una burbuja de jab\u00f3n","No debes entrar gritando","Hubo cohetes en la fiesta","Mis primos se disfrazaban a menudo","Lo descubrimos explorando","El cangrejo camina hacia atr\u00e1s","La ni\u00f1a sevillana aprendi\u00f3 a leer pronto","Vamos alegres a casa de mi abuela","La oruga viv\u00eda en un girasol","Mira el campo de cereales","La mujer tiene dos nietecitas","Mi madre tiene tres sobrinas","Fuimos a casa de mi amigo Gustavo","Mi hermana y yo iremos al parque","Por supuesto que me gusta el cine","Vivo cerca de un almac\u00e9n de quesos","Es importante que hagamos esto","Me despisto con la radio","Mi mejor amiga se llama Cleopatra","Hay que clasificar los documentos","El nombre de mi cu\u00f1ada es Cristina","Tu sobrina Claudia viene a las tres","Este ni\u00f1o a\u00fan escribe despacio porque est\u00e1 aprendiendo","Me compr\u00e9 un disfraz","Te dir\u00e9 la verdad","Hazlo con normalidad","No bebo alcohol","Dame la almohada","Hazlo con coherencia","Lleg\u00f3 el deshielo","Lo tuve que deshacer","Se pudo ahogar","No hab\u00eda acceso","Se convirti\u00f3 en un anciano cascarrabias","Se despidi\u00f3 o gran velocidad","En el castillo hab\u00eda una princesa","Me olvid\u00e9 el paraguas","Ma\u00f1ana voy a ir al teatro"],"4":["Alfredo era el notario m\u00e1s noble de Francia","Hab\u00eda all\u00ed doce comensales adem\u00e1s del anfitri\u00f3n","Las golondrinas pasaban r\u00e1pidas en bandadas","Su pintura me conmueve y me intriga","Se levant\u00f3 de madrugada para dar un paseo por el retiro","La casa de Luc\u00eda era la primera de una calle estrecha y larga","La apariencia de la mujer era serena","Carlos era un humilde carpintero de Toledo","Los p\u00e1jaros piaban alegremente en el \u00e1rbol","Tom\u00e9 un tentempi\u00e9 a media ma\u00f1ana","El ep\u00edlogo aclar\u00f3 sus dudas","Finalmente el barco qued\u00f3 inmovilizado","Se movi\u00f3 silenciosamente","Se notaba su profesionalidad","Actu\u00f3 con imparcialidad","Su trabajo consist\u00eda en guiarle y orientarle","Fue preciso y ordenado","Actu\u00f3 como un necio","Pidi\u00f3 una prorroga","Supuso un gran embrollo","Habl\u00f3 sosegado","Fue una negligencia","No quiso insistir en exceso","Estaba atemorizado por la fiera","Lo hizo con perseverancia","La comida fue muy copiosa","Se gener\u00f3 una gran confusi\u00f3n","Significaba que lo hab\u00eda logrado","Era una ardua tarea","Lo esquiv\u00f3 sagazmente","Sus iron\u00edas lo irritaban","Sus expresiones causaron indignaci\u00f3n","Entr\u00f3 sigilosamente a la habitaci\u00f3n","Circulaban numerosos veh\u00edculos","El gerente lo increp\u00f3 por su tardanza","Utiliz\u00f3 un tono despectivo","Actu\u00f3 de forma negligente","Le tach\u00f3 de embustero","Era un hombre severo y mediocre","Intent\u00f3 no ser demasiado cr\u00edtico","No debi\u00f3 creer en un rufi\u00e1n","Es fruto de su esfuerzo constante","Opt\u00f3 por un m\u00e9todo dr\u00e1stico","No pudo evitar sentirse extra\u00f1o","Actu\u00f3 de manera d\u00e9spota","No dej\u00f3 de expresar su opini\u00f3n","Se percib\u00eda su enorme carisma","Era hombre de gran prestigio","No se dej\u00f3 llevar por su influencia","Resolvi\u00f3 el dilema con sabidur\u00eda","No pongas excesivos pretextos","Se crey\u00f3 omnipotente","El obispo habl\u00f3 con el di\u00e1cono","Cuando amanece en la elevada cumbre","Se sinti\u00f3 afortunado por su biling\u00fcismo","Se cre\u00f3 con enorme ambig\u00fcedad","Se convirti\u00f3 en su salvoconducto","La llen\u00f3 de halagos y piropos"]};
offline_jsons["ac_velocidad_test.json"]={"1":["la casa","un d\u00eda"],"2":["la cabra","mi primo"],"3":["Visitamos un pueblecito","En el mar vimos tiburones"],"4":["El aspecto de este edificio es noble","Las campanas sonaban alegres en una atm\u00f3sfera t\u00edbia"]};
offline_jsons["ac_ritmo_test.json"]={"2" : ["..", "_."],"3" : ["._.", ".._"],"4" : ["..__", "._.."],"5" : ["_._..","._.._"],"6" : ["__._..",".___._"]};
var invitado_data={"cache_user_subjects":{"sujeto1":{"id":"1","user":"invitado","name":"sujeto1","alias":"sujeto1","birthdate":"2004-11-13","genre":"m","comments":""},"sujeto2":{"id":"2","user":"invitado","name":"sujeto2","alias":"sujeto2","birthdate":"2006-01-01","genre":"f","comments":""},"aula1o":{"id":"3","user":"invitado","name":"aula1o","alias":"aula1o","birthdate":"2010-01-01","genre":"c","comments":""}},"cache_user_subject_results":{"sujeto1":{"general":{"user":"invitado","subject":"sujeto1"},"elements":[{"id":"1136","type":"discr_visual","mode":"test","age":"11","num_answered":"8","num_correct":"8","result":"1","level":"1","duration":"33","timestamp":"2015-12-26 17:50"},{"id":"1135","type":"velocidad","mode":"test","age":"11","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"37","timestamp":"2015-12-26 17:49"},{"id":"1134","type":"ritmo","mode":"test","age":"11","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"82","timestamp":"2015-12-26 17:46"},{"id":"1133","type":"memoria_visual","mode":"test","age":"11","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"17","timestamp":"2015-12-26 17:45"},{"id":"1132","type":"conciencia","mode":"test","age":"11","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"18","timestamp":"2015-12-26 17:44"},{"id":"136","type":"discr_visual","mode":"test","age":"11","num_answered":"8","num_correct":"7","result":"0.87","level":"1","duration":"33","timestamp":"2015-12-16 17:50"},{"id":"135","type":"velocidad","mode":"test","age":"11","num_answered":"6","num_correct":"2","result":"0.33","level":"1","duration":"37","timestamp":"2015-12-16 17:49"},{"id":"134","type":"ritmo","mode":"test","age":"11","num_answered":"6","num_correct":"5","result":"0.83","level":"1","duration":"82","timestamp":"2015-12-16 17:46"},{"id":"133","type":"memoria_visual","mode":"test","age":"11","num_answered":"6","num_correct":"2","result":"0.33333333","level":"1","duration":"17","timestamp":"2015-12-16 17:45"},{"id":"132","type":"conciencia","mode":"test","age":"11","num_answered":"6","num_correct":"5","result":"0.83","level":"1","duration":"18","timestamp":"2015-12-16 17:44"}]},"sujeto2":{"general":{"user":"invitado","subject":"sujeto2"},"elements":[{"id":"160","type":"discr_visual","mode":"test","age":"9","num_answered":"20","num_correct":"16","result":"0.8","level":"1","duration":"56","timestamp":"2015-12-22 19:01"},{"id":"159","type":"velocidad","mode":"test","age":"9","num_answered":"6","num_correct":"5","result":"0.833","level":"1","duration":"93","timestamp":"2015-12-22 18:59"},{"id":"158","type":"ritmo","mode":"test","age":"9","num_answered":"6","num_correct":"4","result":"0.66666666","level":"1","duration":"109","timestamp":"2015-12-22 18:56"},{"id":"157","type":"memoria_visual","mode":"test","age":"9","num_answered":"6","num_correct":"4","result":"0.66666666","level":"1","duration":"29","timestamp":"2015-12-22 18:46"},{"id":"156","type":"conciencia","mode":"test","age":"9","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"12","timestamp":"2015-12-22 18:45"},{"id":"127","type":"discr_visual","mode":"test","age":"9","num_answered":"8","num_correct":"8","result":"1","level":"1","duration":"35","timestamp":"2015-12-15 18:51"},{"id":"126","type":"velocidad","mode":"test","age":"9","num_answered":"6","num_correct":"4","result":"0.66666666","level":"1","duration":"69","timestamp":"2015-12-15 18:50"},{"id":"125","type":"ritmo","mode":"test","age":"9","num_answered":"6","num_correct":"6","result":"1","level":"1","duration":"146","timestamp":"2015-12-15 18:46"},{"id":"124","type":"memoria_visual","mode":"test","age":"9","num_answered":"6","num_correct":"4","result":"0.66666666","level":"1","duration":"20","timestamp":"2015-12-15 18:44"},{"id":"123","type":"conciencia","mode":"test","age":"9","num_answered":"6","num_correct":"5","result":"0.83333333","level":"1","duration":"9","timestamp":"2015-12-15 18:43"}]},"aula1o":{"general":{"user":"invitado","subject":"aula1o"},"elements":[]}},"cache_user_subject_result_detail":{"123":{"general":{"session":"123"},"elements":[{"id":"404","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"ala","choice":"ala","result":"correct","level":"1","duration":"2","timestamp":"2015-12-15 18:43:49"},{"id":"405","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"mesa","choice":"mesa","result":"correct","level":"1","duration":"0","timestamp":"2015-12-15 18:43:55"},{"id":"406","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"casa","choice":"casa","result":"correct","level":"1","duration":"4","timestamp":"2015-12-15 18:44:05"},{"id":"407","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"carta","choice":"carta","result":"correct","level":"1","duration":"0","timestamp":"2015-12-15 18:44:13"},{"id":"408","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"banyera","choice":"ballena","result":"incorrect","level":"1","duration":"0","timestamp":"2015-12-15 18:44:21"},{"id":"409","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"koala","choice":"koala","result":"correct","level":"1","duration":"3","timestamp":"2015-12-15 18:44:36"}]},"124":{"general":{"session":"124"},"elements":[{"id":"410","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"copa","choice":"copa","result":"correct","level":"1","duration":"2","timestamp":"2015-12-15 18:44:57"},{"id":"411","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"ropa,mesa","choice":"ropa,mesa","result":"correct","level":"1","duration":"1","timestamp":"2015-12-15 18:45:08"},{"id":"412","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"candado,vino,pinya","choice":"candado,vino,pinya","result":"correct","level":"1","duration":"3","timestamp":"2015-12-15 18:45:23"},{"id":"413","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"puente,tijeras,pajaro,cancion","choice":"puente,tijeras,pajaro,cancion","result":"correct","level":"1","duration":"6","timestamp":"2015-12-15 18:45:42"},{"id":"414","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"seta,oruga,pera,conejo,hueso","choice":"oruga,pera,seta,conejo,hueso","result":"incorrect","level":"1","duration":"5","timestamp":"2015-12-15 18:46:03"},{"id":"415","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"avion,camisa,cortinas,rama,almeja","choice":"almeja,camisa,cortinas,rama,avion","result":"incorrect","level":"1","duration":"3","timestamp":"2015-12-15 18:46:22"}]},"125":{"general":{"session":"125"},"elements":[{"id":"416","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta35.m4a","choice":"ta35.m4a","result":"correct","level":"1","duration":"1","timestamp":"2015-12-15 18:47:01"},{"id":"417","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta150.m4a","choice":"ta150.m4a,ta150.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-15 18:47:19"},{"id":"418","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta150.m4a,ta35.m4a","choice":"ta150.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"18","timestamp":"2015-12-15 18:47:44"},{"id":"419","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta35.m4a,ta35.m4a,ta35.m4a,ta150.m4a","choice":"ta35.m4a,ta35.m4a,ta35.m4a,ta150.m4a","result":"correct","level":"1","duration":"22","timestamp":"2015-12-15 18:48:14"},{"id":"420","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","choice":"ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"34","timestamp":"2015-12-15 18:48:55"},{"id":"421","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta150.m4a,ta150.m4a","choice":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta150.m4a,ta150.m4a","result":"correct","level":"1","duration":"59","timestamp":"2015-12-15 18:50:08"}]},"126":{"general":{"session":"126"},"elements":[{"id":"422","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"mis","choice":"mis","result":"correct","level":"1","duration":"13","timestamp":"2015-12-15 18:50:31"},{"id":"423","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"por","choice":"por","result":"correct","level":"1","duration":"6","timestamp":"2015-12-15 18:50:41"},{"id":"424","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"perro","choice":"perro","result":"correct","level":"1","duration":"18","timestamp":"2015-12-15 18:51:03"},{"id":"425","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"cabra","choice":"cabra","result":"correct","level":"1","duration":"9","timestamp":"2015-12-15 18:51:16"},{"id":"426","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"hacia","choice":"acia","result":"incorrect","level":"1","duration":"14","timestamp":"2015-12-15 18:51:38"},{"id":"427","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"cohetes","choice":"coetes","result":"incorrect","level":"1","duration":"9","timestamp":"2015-12-15 18:51:54"}]},"127":{"general":{"session":"127"},"elements":[{"id":"428","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"bru4","choice":"bru4 ()","result":"correct","level":"1","duration":"16","timestamp":"2015-12-15 18:52:14"},{"id":"429","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"cel4","choice":"cel4 (cle1)","result":"correct","level":"1","duration":"19","timestamp":"2015-12-15 18:52:34"}]},"132":{"general":{"session":"132"},"elements":[{"id":"451","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"ala","choice":"ala","result":"correct","level":"1","duration":"5","timestamp":"2015-12-16 17:44:41"},{"id":"452","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"mesa","choice":"mesa","result":"correct","level":"1","duration":"2","timestamp":"2015-12-16 17:44:51"},{"id":"453","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"casa","choice":"casa","result":"correct","level":"1","duration":"1","timestamp":"2015-12-16 17:44:58"},{"id":"454","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"carta","choice":"carta","result":"correct","level":"1","duration":"2","timestamp":"2015-12-16 17:45:09"},{"id":"455","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"banyera","choice":"banyera","result":"correct","level":"1","duration":"7","timestamp":"2015-12-16 17:45:29"},{"id":"456","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"koala","choice":"jaula","result":"incorrect","level":"1","duration":"1","timestamp":"2015-12-16 17:45:37"}]},"133":{"general":{"session":"133"},"elements":[{"id":"457","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"naranja","choice":"naranja","result":"correct","level":"1","duration":"3","timestamp":"2015-12-16 17:45:54"},{"id":"458","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"obrero,copa","choice":"obrero,copa","result":"correct","level":"1","duration":"6","timestamp":"2015-12-16 17:46:09"},{"id":"459","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"diccionario,arco,hoja","choice":"arco,hoja,diccionario","result":"incorrect","level":"1","duration":"4","timestamp":"2015-12-16 17:46:25"},{"id":"460","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"platano,lampara,corazon","choice":"lampara,corazon,platano","result":"incorrect","level":"1","duration":"4","timestamp":"2015-12-16 17:46:39"}]},"134":{"general":{"session":"134"},"elements":[{"id":"461","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a","choice":"ta150.m4a","result":"correct","level":"1","duration":"8","timestamp":"2015-12-16 17:47:05"},{"id":"462","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta150.m4a","choice":"ta35.m4a,ta150.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-16 17:47:24"},{"id":"463","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta150.m4a,ta35.m4a","choice":"ta150.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"9","timestamp":"2015-12-16 17:47:40"},{"id":"464","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta150.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta35.m4a,ta35.m4a,ta150.m4a","result":"incorrect","level":"1","duration":"16","timestamp":"2015-12-16 17:48:03"},{"id":"465","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta35.m4a,ta150.m4a,ta35.m4a","choice":"ta35.m4a,ta35.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"10","timestamp":"2015-12-16 17:48:19"},{"id":"466","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-16 17:49:05"},{"id":"467","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","result":"incorrect","level":"1","duration":"15","timestamp":"2015-12-16 17:49:29"}]},"135":{"general":{"session":"135"},"elements":[{"id":"468","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"al","choice":"al","result":"correct","level":"1","duration":"8","timestamp":"2015-12-16 17:49:46"},{"id":"469","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"que","choice":"","result":"incorrect","level":"1","duration":"1","timestamp":"2015-12-16 17:49:51"},{"id":"470","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"pasos","choice":"pasos","result":"correct","level":"1","duration":"17","timestamp":"2015-12-16 17:50:13"},{"id":"471","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"carta","choice":"","result":"incorrect","level":"1","duration":"1","timestamp":"2015-12-16 17:50:18"},{"id":"472","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"padre","choice":"madre","result":"incorrect","level":"1","duration":"9","timestamp":"2015-12-16 17:50:41"},{"id":"473","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"descubrimos","choice":"","result":"incorrect","level":"1","duration":"1","timestamp":"2015-12-16 17:50:48"}]},"136":{"general":{"session":"136"},"elements":[{"id":"474","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"pli4","choice":"pli3 ()","result":"incorrect","level":"1","duration":"19","timestamp":"2015-12-16 17:51:12"},{"id":"475","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"cla4","choice":"cla4 ()","result":"correct","level":"1","duration":"14","timestamp":"2015-12-16 17:51:27"}]},"1132":{"general":{"session":"1132"},"elements":[{"id":"1451","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"ala","choice":"ala","result":"correct","level":"1","duration":"5","timestamp":"2015-12-26 17:44:41"},{"id":"1452","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"mesa","choice":"mesa","result":"correct","level":"1","duration":"2","timestamp":"2015-12-26 17:44:51"},{"id":"1453","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"casa","choice":"casa","result":"correct","level":"1","duration":"1","timestamp":"2015-12-26 17:44:58"},{"id":"1454","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"carta","choice":"carta","result":"correct","level":"1","duration":"2","timestamp":"2015-12-26 17:45:09"},{"id":"1455","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"banyera","choice":"banyera","result":"correct","level":"1","duration":"7","timestamp":"2015-12-26 17:45:29"},{"id":"1456","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto1","activity":"koala","choice":"koala","result":"correct","level":"1","duration":"1","timestamp":"2015-12-26 17:45:37"}]},"1133":{"general":{"session":"1133"},"elements":[{"id":"1457","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"naranja","choice":"naranja","result":"correct","level":"1","duration":"3","timestamp":"2015-12-26 17:45:54"},{"id":"1458","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"obrero,copa","choice":"obrero,copa","result":"correct","level":"1","duration":"6","timestamp":"2015-12-26 17:46:09"},{"id":"1459","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"diccionario,arco,hoja","choice":"diccionario,arco,hoja","result":"correct","level":"1","duration":"4","timestamp":"2015-12-26 17:46:25"},{"id":"1460","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"platano,lampara,corazon","choice":"platano,lampara,corazon","result":"correct","level":"1","duration":"4","timestamp":"2015-12-26 17:46:39"}]},"1134":{"general":{"session":"1134"},"elements":[{"id":"1461","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a","choice":"ta150.m4a","result":"correct","level":"1","duration":"8","timestamp":"2015-12-26 17:47:05"},{"id":"1462","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta150.m4a","choice":"ta35.m4a,ta150.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-26 17:47:24"},{"id":"1463","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta150.m4a,ta35.m4a","choice":"ta150.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"9","timestamp":"2015-12-26 17:47:40"},{"id":"1464","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta150.m4a,ta35.m4a,ta35.m4a","choice":"ta35.m4a,ta150.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"16","timestamp":"2015-12-26 17:48:03"},{"id":"1465","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta35.m4a,ta35.m4a,ta150.m4a,ta35.m4a","choice":"ta35.m4a,ta35.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"10","timestamp":"2015-12-26 17:48:19"},{"id":"1466","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta150.m4a,ta150.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-26 17:49:05"},{"id":"1467","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto1","activity":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"15","timestamp":"2015-12-26 17:49:29"}]},"1135":{"general":{"session":"1135"},"elements":[{"id":"1468","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"al","choice":"al","result":"correct","level":"1","duration":"8","timestamp":"2015-12-26 17:49:46"},{"id":"1469","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"que","choice":"que","result":"correct","level":"1","duration":"1","timestamp":"2015-12-26 17:49:51"},{"id":"1470","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"pasos","choice":"pasos","result":"correct","level":"1","duration":"17","timestamp":"2015-12-26 17:50:13"},{"id":"1471","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"carta","choice":"","result":"correct","level":"1","duration":"1","timestamp":"2015-12-26 17:50:18"},{"id":"1472","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"padre","choice":"padre","result":"correct","level":"1","duration":"9","timestamp":"2015-12-26 17:50:41"},{"id":"1473","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto1","activity":"descubrimos","choice":"descubrimos","result":"correct","level":"1","duration":"1","timestamp":"2015-12-26 17:50:48"}]},"1136":{"general":{"session":"1136"},"elements":[{"id":"1474","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"pli4","choice":"pli3 ()","result":"incorrect","level":"1","duration":"19","timestamp":"2015-12-26 17:51:12"},{"id":"1475","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto1","activity":"cla4","choice":"cla4 ()","result":"correct","level":"1","duration":"14","timestamp":"2015-12-26 17:51:27"}]},"156":{"general":{"session":"156"},"elements":[{"id":"574","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"ala","choice":"ala","result":"correct","level":"1","duration":"2","timestamp":"2015-12-22 18:46:04"},{"id":"575","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"mesa","choice":"mesa","result":"correct","level":"1","duration":"1","timestamp":"2015-12-22 18:46:11"},{"id":"576","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"casa","choice":"casa","result":"correct","level":"1","duration":"1","timestamp":"2015-12-22 18:46:17"},{"id":"577","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"carta","choice":"carta","result":"correct","level":"1","duration":"5","timestamp":"2015-12-22 18:46:32"},{"id":"578","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"banyera","choice":"banyera","result":"correct","level":"1","duration":"1","timestamp":"2015-12-22 18:46:44"},{"id":"579","type":"conciencia","mode":"test","user":"invitado","subject":"sujeto2","activity":"koala","choice":"koala","result":"correct","level":"1","duration":"2","timestamp":"2015-12-22 18:46:52"}]},"157":{"general":{"session":"157"},"elements":[{"id":"580","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"calcetines","choice":"calcetines","result":"correct","level":"1","duration":"4","timestamp":"2015-12-22 18:47:10"},{"id":"581","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"serpiente,raton","choice":"serpiente,raton","result":"correct","level":"1","duration":"3","timestamp":"2015-12-22 18:47:24"},{"id":"582","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"seta,sofa,tornillo","choice":"sofa,seta,tornillo","result":"incorrect","level":"1","duration":"4","timestamp":"2015-12-22 18:47:39"},{"id":"583","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"carta,oveja,mesa","choice":"carta,oveja,mesa","result":"correct","level":"1","duration":"3","timestamp":"2015-12-22 18:47:54"},{"id":"584","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"cebra,vino,tigre,corbata","choice":"cebra,vino,tigre,corbata(corr)","result":"correct","level":"1","duration":"7","timestamp":"2015-12-22 18:48:16"},{"id":"585","type":"memoria_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"gorro,copa,col,marco,canya","choice":"gorro,col,copa,marco,canya(corr)","result":"incorrect","level":"1","duration":"8","timestamp":"2015-12-22 18:48:40"}]},"158":{"general":{"session":"158"},"elements":[{"id":"586","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a","choice":"ta150.m4a","result":"correct","level":"1","duration":"4","timestamp":"2015-12-22 18:56:52"},{"id":"587","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta35.m4a","choice":"ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"12","timestamp":"2015-12-22 18:57:09"},{"id":"588","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta35.m4a,ta150.m4a,ta35.m4a","choice":"ta35.m4a,ta150.m4a,ta35.m4a","result":"correct","level":"1","duration":"11","timestamp":"2015-12-22 18:57:25"},{"id":"589","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a","choice":"ta150.m4a,ta35.m4a,ta35.m4a,ta35.m4a","result":"correct","level":"1","duration":"20","timestamp":"2015-12-22 18:57:52"},{"id":"590","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta150.m4a,ta35.m4a,ta150.m4a,ta35.m4a,ta150.m4a","choice":"ta150.m4a,ta35.m4a,ta150.m4a,ta35.m4a","result":"incorrect","level":"1","duration":"39","timestamp":"2015-12-22 18:58:41"},{"id":"591","type":"ritmo","mode":"test","user":"invitado","subject":"sujeto2","activity":"ta35.m4a,ta150.m4a,ta35.m4a,ta150.m4a,ta35.m4a","choice":"ta35.m4a,ta150.m4a","result":"incorrect","level":"1","duration":"23","timestamp":"2015-12-22 18:59:15"}]},"159":{"general":{"session":"159"},"elements":[{"id":"592","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"cangrejo","choice":"cangr","result":"incorrect","level":"1","duration":"15","timestamp":"2015-12-22 18:59:43"},{"id":"593","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"brillante","choice":"brillante","result":"correct","level":"1","duration":"19","timestamp":"2015-12-22 19:00:11"},{"id":"594","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"cabra","choice":"cabra","result":"correct","level":"1","duration":"8","timestamp":"2015-12-22 19:00:24"},{"id":"595","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"los","choice":"los","result":"correct","level":"1","duration":"8","timestamp":"2015-12-22 19:00:37"},{"id":"596","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"encantan","choice":"encantan","result":"correct","level":"1","duration":"13","timestamp":"2015-12-22 19:00:59"},{"id":"597","type":"velocidad","mode":"test","user":"invitado","subject":"sujeto2","activity":"historias","choice":"historias","result":"correct","level":"1","duration":"30","timestamp":"2015-12-22 19:01:36"}]},"160":{"general":{"session":"160"},"elements":[{"id":"600","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"cir4","choice":"cir4 (cri1)","result":"correct","level":"1","duration":"16","timestamp":"2015-12-22 19:02:01"},{"id":"601","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"flu4","choice":"flu4 ()","result":"correct","level":"1","duration":"9","timestamp":"2015-12-22 19:02:11"},{"id":"602","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"bil4","choice":"bil4 bli3 ()","result":"incorrect","level":"1","duration":"17","timestamp":"2015-12-22 19:02:28"},{"id":"603","type":"discr_visual","mode":"test","user":"invitado","subject":"sujeto2","activity":"cil4","choice":"cil4 cli1 (cli2)","result":"incorrect","level":"1","duration":"14","timestamp":"2015-12-22 19:02:42"}]}}};



var media_objects;
var session_state="unset";
var header_zone=document.getElementById('header');
var header_text=undefined;
var canvas_zone=document.getElementById('zone_canvas');
var canvas_zone_vcentered=document.getElementById('zone_canvas_vcentered');

if(game_mode){
	canvas_zone.classList.remove("canvas-with-header");
	canvas_zone.classList.add("canvas-full");
}



// already done in php? to match img name (ascii) and answer? Maybe keep "original answer" with the correct letters 
//var letter_equivalence = { 'à':'a', 'á':'a', 'ç':'c', 'è':'e', 'é':'e', 'í':'i', 'ï':'i', 'ñ':'ny', 'ò':'o', 'ó':'o', 'ú':'u' };


// NOTE: to accelerate the sound edited: start+0.2 and end -0.1
var audio_object_sprite_ref={
	a: {id: "a", start: 20.418, end: 21.122}, 
	b: {id: "b", start: 10.897, end: 11.598}, 
	bv: {id: "bv", start: 26.423, end: 27.128}, 
	ch: {id: "ch", start: 1.200, end: 1.597}, 
	d: {id: "d", start: 8.898, end: 9.597}, 
	e: {id: "e", start: 45.947, end: 46.646}, 
	f: {id: "f", start: 2.897, end: 3.594}, 
	g: {id: "g", start: 12.898, end: 13.600}, 
	i: {id: "i", start: 34.433, end: 35.133}, 
	j: {id: "j", start: 24.424, end: 25.123}, 
	k: {id: "k", start: 37.934, end: 38.635}, 
	l: {id: "l", start: 41.938, end: 42.643}, 
	m: {id: "m", start: 43.943, end: 44.647}, 
	n: {id: "n", start: 16.404, end: 17.117}, 
	ny: {id: "ny", start: 30.427, end: 31.130}, 
	o: {id: "o", start: 32.430, end: 33.133}, 
	p: {id: "p", start: 22.422, end: 23.124}, 
	r: {id: "r", start: 39.935, end: 40.638}, 
	rr: {id: "rr", start: 28.428, end: 29.127}, 
	s: {id: "s", start: 18.417, end: 19.118}, 
	t: {id: "t", start: 4.894, end: 5.594}, 
	u: {id: "u", start: 49.951, end: 50.651}, 
	y: {id: "y", start: 6.894, end: 7.598}, 
	z: {id: "z", start: 47.946, end: 48.651}, 
	'ta30.m4a': {id: "ta30.m4a", start: 51.850, end: 52.119}, 
	'ta120.m4a': {id: "ta120.m4a", start: 53.700, end: 54.861}, 
	'ta30.m4al': {id: "ta30l.m4a", start: 51.700, end: 52.500}, 
	'ta120.m4al': {id: "ta120l.m4a", start: 53.500, end: 55.100}, 
	zfx_correct: {id: "zfx_correct50", start: 14.700, end: 15.204}, 
	zfx_wrong: {id: "zfx_wrong50", start: 36.233, end: 36.734}, 
	zsilence_start: {id: "zsilence_start", start: 0.100, end: 0.700}
};

// local copy for chrome on file:// that cannot parse css
var wordimage_image_ref=["lombriz", "abeja", "aceite", "aeroplano", "ala", "almeja", "anciana", "antena", "arbol", "arco", "ardilla", "avion", "azul", "bala", "ballena", "bandera", "banyera", "barco", "bici", "bocadillo", "boca", "brazo", "buho", "cabra", "calcetines", "calla", "cama", "camara", "camello", "camino", "camion", "camisa", "campana", "campo", "cancion", "candado", "canya", "caracol", "carta", "casa", "cebra", "cerdo", "cerezas", "cerilla", "col", "comprar", "conejo", "copa", "corazon", "corbata", "cortina", "cuatro", "cuchara", "dardo", "diana", "diccionario", "dulce", "elefante", "ensalada", "escenario", "faro", "flor", "foca", "fresa", "gallina", "gasolina", "gato", "goma", "gorra", "gorro", "hoja", "hormiga", "hueso", "huevo", "jaula", "jirafa", "koala", "lampara", "lapiz", "leche", "libros", "limon", "lluvia", "abrigo", "madera", "maiz", "mano", "manzana", "maracas", "marco", "mariquita", "martillo", "mesa", "mono", "monte", "morsa", "murcielago", "naranja", "noria", "obrero", "oreja", "oruga", "oso", "oveja", "pajaro", "pala", "pantano", "papel", "paraguas", "pastel", "patata", "pato", "pera", "percha", "perro", "pescado", "pez", "piedra", "pino", "pinya", "pinza", "plancha", "plano", "platano", "plato", "pluma", "preso", "puente", "queso", "rama", "raton", "regadera", "reja", "reloj", "rino", "rojo", "ropa", "sal", "sandia", "sapo", "serpiente", "seta", "silbato", "sofa", "sol", "sombrero", "sombrilla", "sopa", "sorpresa", "television", "tigre", "tijeras", "tomate", "topo", "tornillo", "tortuga", "tostadora", "tranvia", "tren", "tres", "tuerca", "uvas", "vaca", "ventana", "verde", "vino"];
//if(!is_local() || !(/Chrome/.test(navigator.userAgent))){
//    wordimage_image_ref=getAllCSSselectorsMatching("wordimg-sprite.css",new RegExp("wordimage-"));
//for(var i=0;i<wordimage_image_ref.length;i++){
//    wordimage_image_ref[i]=wordimage_image_ref[i].replace('.wordimage-','');
//}
//}



var activity_timer=new ActivityTimer();

var user_data={email:null};
var session_data={
    highest_id:1,
    highest_detail_id:1,
	user: null,
	subject: "invitado",
	subject_age: "5",
	level: "1",
	duration: 0,
	timestamp: "0000-00-00 00:00",
	num_correct: 0,
	num_answered: 0,
	result: 0,
	type: 'conciencia',
	mode: 'training',
    action: 'send_session_data_post',
	details: []
};

var subjects_select_elem="none";
var users_select_elem="none";

// Cache, clear this if user changes, session, or when they are modified...
var cache_user_subjects=null;
var cache_cognitionis_pagination_page=0;
var cache_user_subject_results={};
var cache_user_subject_result_detail={};
var cache_user_subject_training={};

function login_screen(){
	if(debug){alert('login_screen called');}
	if(user_bypass!=undefined){
		login_bypass();
	}else{
		header_zone.innerHTML='<h1>Acceso</h1>';
		canvas_zone_vcentered.innerHTML='\
        <p>¿Cómo acceder?</p>\
		<div id="signinButton" class="button">con Google\
	   <span class="icon"></span>\
		<span class="buttonText"></span>\
		</div>\
		<br /><button class="button" id="invitee_access">sin registrarse</button> \
			'; 
        if(internet_access && !is_local()){
            if(debug) alert('google button ON');
            gapi.signin.render('signinButton', {
              'callback': 'signInCallback',
              'clientid': '125860785862-s07kh0j5tpb2drjkeqsifldn39krhh60.apps.googleusercontent.com',
              'cookiepolicy': 'single_host_origin',
              'redirecturi': 'postmessage',
              'accesstype': 'offline',
              'scope': 'openid email'
            }); //'redirecturi': 'postmessage', --> avoids reloading the page?
            // accesstype="offline" --> ?? isn't implicit?
        }else{
            add_click_fancy("signinButton",login_bypass);
        }
        add_click_fancy("invitee_access",invitee_access);
    }
}



function set_session_highest_ids(){
    var highest_detail_id=1;
    for (var session in cache_user_subject_result_detail) {
        if (cache_user_subject_result_detail.hasOwnProperty(session)) {
            var session_detail=cache_user_subject_result_detail[session].elements;
            for(var i=0;i<session_detail.length;i++){
                if(Number(session_detail[i].id)>highest_detail_id){
                    highest_detail_id=Number(session_detail[i].id);
                }
            }
        }
    }
    session_data.highest_detail_id=highest_detail_id;
    session_data.highest_id=Math.max.apply(null, objectProperties(cache_user_subject_result_detail));
}

function invitee_access(){
	session_data.user='invitado';
	session_data.user_access_level='invitee';
	user_data.email='invitee';
	user_data.display_name='invitado';
	user_data.access_level='invitee';

    cache_user_subjects=invitado_data.cache_user_subjects;
    session_data.subject=objectProperties(cache_user_subjects)[0];
    cache_user_subject_results=invitado_data.cache_user_subject_results;
    cache_user_subject_result_detail=invitado_data.cache_user_subject_result_detail;
    
    set_session_highest_ids();
    menu_screen();
}




var set_login_bypass=function(result) {
    if (result) {
        if(result.hasOwnProperty('error') && result.error!=""){
            alert('LOGIN ERROR: '+user_bypass+' no existe. Server error:'+result.error); user_bypass=undefined; login_screen();
        }else{
            if(debug){
                console.log(result);
                console.log("logged bypass! "+result.email+" level:"+result.access_level);
                alert("logged bypass! "+result.email+" level:"+result.access_level);
            }
            user_data=result;
            session_data.user=user_data.email;
            session_data.user_access_level=user_data.access_level;
            cache_user_subjects=user_data.subjects;
            cache_user_subject_results=user_data.subject_results;
            cache_user_subject_result_detail=user_data.subject_result_details;
            set_session_highest_ids();
            localStorage.setItem("user_data", JSON.stringify(user_data));
            menu_screen();
        }
    } else {
        alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
        login_screen();
    }
};

function login_bypass(){
    canvas_zone_vcentered.innerHTML='...loging in...';
    if(user_bypass==undefined){
        var default_user="";
        if(localStorage.getItem("user_data")!=null){
            user_data = JSON.parse(localStorage.getItem("user_data"));
            if(user_data.hasOwnProperty('email')){
                default_user=user_data.email;
            }
        }
        user_bypass = prompt("email:",default_user);
    }
    
    check_internet_access_with_img_url(
        'http://www.centroafan.com/logo-afan.jpg',
            function(){
                internet_access=true;
                ajax_CORS_request_json(backend_url+'ajaxdb.php?action=login_bypass&state='+session_state+'&user='+user_bypass,set_login_bypass);
            },
            function(){
                internet_access=false;
                user_data = JSON.parse(localStorage.getItem("user_data"));
                if(user_data!=null && user_data.hasOwnProperty('email')){
                    session_data.user=user_data.email;
                    session_data.user_access_level=user_data.access_level;
                    cache_user_subjects=user_data.subjects;
                    cache_user_subject_results=user_data.subject_results;
                    cache_user_subject_result_detail=user_data.subject_result_details;
                    set_session_highest_ids();
                    alert('No tienes acceso a internet. Pero hay datos para: '+user_data.email);
                }else{
                    alert('No tienes acceso a internet. Ni datos locales.');
                    user_bypass=undefined;
                }
                menu_screen();
            }
        );
    
}

function signInCallback(authResult) {
	//console.log(authResult);
	if (authResult['code']) {
		canvas_zone_vcentered.innerHTML='<div class="loader">Loading...</div>';
		// Send one-time-code to server, if responds -> success
		if(debug) console.log(authResult);
		ajax_CORS_request_json(backend_url+'ajaxdb.php?action=gconnect&state='+session_state+'&code='+authResult['code'],set_user_signin);
	}
}

var set_user_signin=function(result) {
    if (result) {
        if(result.hasOwnProperty('error') && result.error!=""){
            alert("LOGIN ERROR: "+result.error); login_screen();
        }else{
            if(result.hasOwnProperty('info') && result.info=="new user"){
                open_js_modal_content_accept('<p>Usuario creado para: '+result.email+' \
                en breve recibirá un email confirmando su registro.</p>');
            }
            if(debug){
                console.log(result);
                console.log("logged google! "+result.email+" level:"+result.access_level);
                alert("logged google! "+result.email+" level:"+result.access_level);
            }
            user_data=result;
            session_data.user=user_data.email;
            session_data.user_access_level=user_data.access_level;
            cache_user_subjects=user_data.subjects;
            cache_user_subject_results=user_data.subject_results;
            cache_user_subject_result_detail=user_data.subject_result_details;
            set_session_highest_ids();
            localStorage.setItem("user_data", JSON.stringify(user_data));
            menu_screen();
        }
    } else if (authResult['error']) {
        alert('There was an error: ' + authResult['error']);
        login_screen();
    } else {
        alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
        login_screen();
    }
}
    


function gdisconnect(){
	hamburger_close();
    if(localStorage.hasOwnProperty('locally_stored_sessions')){
        if (!confirm("Hay datos sin enviar. Si se desconecta se perderan. Desea desconetarse?")) {
            return;
        }
    }
    localStorage.removeItem("locally_stored_sessions"); // avoid cross user interaction
	if(user_data.email=='invitee' || user_bypass!=undefined){
        user_bypass=undefined;
        login_screen();
    }else{
        ajax_CORS_request_json(backend_url+'ajaxdb.php?action=gdisconnect',set_gdisconnect);
    }
}

var set_gdisconnect=function(result) {
    if (result.hasOwnProperty('success')) {
        if(debug) console.log(result.success);
    } else {
        if(!result.hasOwnProperty('error')) result.error="NO JSON RETURNED";
        alert('Failed to disconnect.</br>Result:'+ result.error);
    }
    login_screen();
};

function admin_screen(){
	header_text.innerHTML=' &larr; '+app_name+' menu';
	ajax_CORS_request_json(backend_url+'ajaxdb.php?action=get_users', set_admin_screen);
}

var set_admin_screen=function(data) {
    var users=data; // TODO: protect, if return is not good fail...
    canvas_zone_vcentered.innerHTML=' \
        User:  <select id="users-select"></select> \
        <br /><button id="set_user" class="button">Acceder</button> \
        <br /><button id="check_missing_elements" class="button">Comprobar sonidos/imagenes</button> \
        <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
        ';
    users_select_elem=document.getElementById('users-select');
    select_fill_with_json(users,users_select_elem);
    document.getElementById("set_user").addEventListener(clickOrTouch,function(){set_user();});
    document.getElementById("check_missing_elements").addEventListener(clickOrTouch,function(){check_missing_elements();});
    document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});			
}


var letter_reader=function(){
    if(!check_if_sounds_loaded(letter_reader)){return;}
    canvas_zone_vcentered.innerHTML=' \
        Escribe letras a leer (separadas por espacio)<br /><input id="input_sounds" type="text" /> <br />\
        <button id="read-button" class="button">Leer</button> \
        <br /><br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
        ';
	document.getElementById("read-button").addEventListener(clickOrTouch,function(){read_input_sounds();});
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}

var read_input_sounds=function(){
	document.getElementById("read-button").disabled=true;
	var input_sounds=document.getElementById("input_sounds").value.replace(/[ ]+/g, " ").trim().split(" ");
    SoundChain.play_sound_arr(input_sounds, audio_sprite, letter_reader);
}

var check_missing_elements=function(){
    if(is_local() && /Chrome/.test(navigator.userAgent)){
        alert("ABORTING: images cannot be checked from Chrome in file://");
        return;
    }
	var undefined_sounds={total:0};
	var undefined_images={total:0};
	var msg="";

	if(media_objects.jsons.hasOwnProperty("ac_conciencia_train.json")){
        var level=1;
        do{
            for (var i=0;i<media_objects.jsons["ac_conciencia_train.json"][level].length;i++){
                var act_sounds=media_objects.jsons["ac_conciencia_train.json"][level][i].sounds;
                for (var s=0;s<act_sounds.length;s++){
                    if(act_sounds[s]=="\/") continue;
                    if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
                        undefined_sounds[act_sounds[s]]=true;
                        undefined_sounds.total=undefined_sounds.total+1;
                        msg+="\n sound("+act_sounds[s]+") not found in training ("+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]+").";
                    }
                }
                if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]) 
                    && !undefined_images.hasOwnProperty(media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0])){
                    undefined_images[media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]]=true;
                    undefined_images.total=undefined_images.total+1;
                    msg+="\n image("+media_objects.jsons["ac_conciencia_train.json"][level][i].answers[0]+") not found in training.";
                }
            }
            level++;
        }while(media_objects.jsons["ac_conciencia_train.json"].hasOwnProperty(level));
        level=1;
        do{
            for (var i=0;i<media_objects.jsons["ac_conciencia_test.json"].length;i++){
                var act_sounds=media_objects.jsons["ac_conciencia_test.json"][i].sounds;
                for (var s=0;s<act_sounds.length;s++){
                    if(act_sounds[s]=="\/") continue;
                    if(!audio_object_sprite_ref.hasOwnProperty(act_sounds[s]) && !undefined_sounds.hasOwnProperty(act_sounds[s])){
                        undefined_sounds[act_sounds[s]]=true;
                        undefined_sounds.total=undefined_sounds.total+1;
                        msg+="\n sound("+act_sounds[s]+") not found in test ("+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]+").";
                    }
                }
                if(!selectorExistsInCSS("wordimg-sprite.css",".wordimage-"+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]) 
                    && !undefined_images.hasOwnProperty(media_objects.jsons["ac_conciencia_test.json"][i].answers[0])){
                    undefined_images[media_objects.jsons["ac_conciencia_test.json"][i].answers[0]]=true;
                    undefined_images.total=undefined_images.total+1;
                    msg+="\n image("+media_objects.jsons["ac_conciencia_test.json"][i].answers[0]+") not found in test.";
                }
            }
            level++;
        }while(media_objects.jsons["ac_conciencia_test.json"].hasOwnProperty(level));
	}else{
        msg+="\n ac_conciencia_train.json not found.";
    }
	if(msg==""){
		alert("All elements are defined");
	}else{
		alert(msg+"\nMissing "+undefined_sounds.total+" sounds and "+undefined_images.total+" images")
	}
}

function set_user(){
	if(session_data.user!=users_select_elem.options[users_select_elem.selectedIndex].value){
		session_data.user=users_select_elem.options[users_select_elem.selectedIndex].value;
		cache_user_subjects=null; cache_user_subject_results={};
        cache_user_subject_result_detail={};
	}
    if(user_data.email!=users_select_elem.options[users_select_elem.selectedIndex].value){
        ajax_CORS_request_json(backend_url+'ajaxdb.php?action=login_bypass&state='+session_state+'&user='+session_data.user,set_user_act_as);
    }else{
        ajax_CORS_request_json(backend_url+'ajaxdb.php?action=login_bypass&state='+session_state+'&user='+user_bypass,set_login_bypass);
    }
}

var set_user_act_as=function(result) {
    // NOTE: user_data does not change only session
    if (result) {
        if(result.hasOwnProperty('error') && result.error!=""){
            alert('LOGIN ERROR: '+session_data.user+' no existe. Server error:'+result.error); session_data.user=undefined; login_screen();
        }else{
            if(debug){
                console.log(result);
                console.log("logged bypass! "+result.email+" level:"+result.access_level);
                alert("logged bypass! "+result.email+" level:"+result.access_level);
            }
            session_data.user_access_level=result.access_level;
            cache_user_subjects=result.subjects;
            cache_user_subject_results=result.subject_results;
            cache_user_subject_result_detail=result.subject_result_details;
            set_session_highest_ids();
            menu_screen();
        }
    } else {
        alert('Failed to make a server-side call. Check your configuration and console.</br>Result:'+ result);
        login_screen();
    }
};


function set_subject(){
    if(subjects_select_elem.options[subjects_select_elem.selectedIndex]!=undefined){
        session_data.subject=subjects_select_elem.options[subjects_select_elem.selectedIndex].value;
        session_data.birthdate=cache_user_subjects[session_data.subject]['birthdate'];
        session_data.age=calculateAge(cache_user_subjects[session_data.subject]['birthdate']);
        session_data.genre=calculateAge(cache_user_subjects[session_data.subject]['genre']);
    }
}

function show_profile(){
    header_text.innerHTML=' &larr; '+app_name+' menu';
    canvas_zone_vcentered.innerHTML=' \
        Usuario: '+user_data.email+'  <br />\
        Acceso: '+user_data.access_level+'  <br />\
        <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
        ';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}

function show_about(){
    header_text.innerHTML=' &larr; '+app_name+' menu';
    canvas_zone_vcentered.innerHTML=' \
        <img src="'+media_objects.images['logo-afan.png'].src+'" /><br /><h1>Programa CoLE</h1>Corrección de los errores en Lectura y Escritura<br />\
        &copy; 2015\
        <br /><br />M.de Ayala, H.Llorens<br />\
        Url: <a href="http://www.centroafan.com">www.centroafan.com</a> <br />\
        Contacto: info@centroafan.com  <br />\
        <br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button>\
        ';
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}

function menu_screen(){
	allowBackExit();
	var splash=document.getElementById("splash_screen");
	if(splash!=null && (ResourceLoader.lazy_audio==true || ResourceLoader.not_loaded['sounds'].length==0)){
        splash.parentNode.removeChild(splash); if(debug){alert('load1-complete');}
    }
	if(media_objects===undefined){media_objects=ResourceLoader.ret_media; media_objects.jsons=offline_jsons;} //pointer
	if(debug){
		console.log('userAgent: '+navigator.userAgent+' is_app: '+is_app+' Device info: '+device_info);
		console.log('not_loaded sounds: '+ResourceLoader.not_loaded['sounds'].length);
	}
	cache_cognitionis_pagination_page=0;
	if(debug) console.log('user.email: '+user_data.email);
	if(session_state=="unset"){
        alert('ERROR: session is not set');
	}else if((user_data==null || user_data.email==null) && !game_mode){
        if(debug) alert('still unlogged - going to login');
		login_screen();
	}else if(!game_mode){
		var sign='<li><a href="#" id="show_profile">perfil</a></li>\
				  <li><a href="#" id="gdisconnect">desconectar</a></li>';
		if(user_data.email=='invitee'){
			sign='<li><a href="#" id="login_screen">acceder</a></li>';
		}
		// TODO if admin administrar... lo de sujetos puede ir aquí tb...
		hamburger_menu_content.innerHTML=''+get_reduced_display_name(user_data.display_name)+'<ul>\
		'+sign+'\
		<li><a href="#" id="show_about">acerca de..</a></li>\
		</ul>';
        var name_with_details=app_name;
        if(is_local()){name_with_details+=' [app]';}
        if(!internet_access){name_with_details+=' (offline)';}
		header_zone.innerHTML='<a id="hamburger_icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
		<path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/></svg></a> <span id="header_text">'+name_with_details+'</span>';
        header_text=document.getElementById('header_text');

		var admin_opts='<br /><button id="admin_screen"  class="button">Administrar</button>\
			<br /><button id="letter_reader" disabled="true" class="button">Lector de sonidos</button>';
		var normal_opts='\
		';
        var offline_opts='';
        if(localStorage.hasOwnProperty('locally_stored_sessions')){
            offline_opts='<br />Hay '+JSON.parse(localStorage.getItem('locally_stored_sessions')).length+' <i>datos offline</i> <button id="send_stored_sessions"  class="button">Enviar</button>';
        }
		if(user_data.access_level!='admin') admin_opts="";
		if(user_data.email=='invitee'){ normal_opts="";}
		canvas_zone_vcentered.innerHTML=' \
		<div id="menu-logo-div"></div> \
		Participante:  <select id="subjects-select" onchange="set_subject()"></select> \
		<nav id="responsive_menu">\
		'+admin_opts+'\
		<br /><button id="start-button" class="button" disabled="true">Jugar</button> \
        <button id="start-test-button" class="button" disabled="true">Test</button> \
		'+normal_opts+'\
		<br /><button id="manage-subjects" disabled="true" class="button">Participantes</button> \
        <br /><button id="results" disabled="true" class="button">Resultados</button>\
		'+offline_opts+'\
		</nav>\
		';
		if(user_data.access_level=='admin'){
			document.getElementById("admin_screen").addEventListener(clickOrTouch,function(e) {
                e.stopPropagation();
                check_internet_access_with_img_url(
                    'http://www.centroafan.com/logo-afan.jpg',
                    function(){admin_screen();internet_access=true;},
                    function(){alert('Error: no se puede administrar sin internet');internet_access=false;}
                    );
            });
			document.getElementById("letter_reader").addEventListener(clickOrTouch,letter_reader);
		}
		if(user_data.email!='invitee'){
			document.getElementById("show_profile").addEventListener(clickOrTouch,function(){hamburger_close();show_profile();});
			document.getElementById("gdisconnect").addEventListener(clickOrTouch,function(){hamburger_close();gdisconnect();});
        }else{
            document.getElementById("login_screen").addEventListener(clickOrTouch,function(){hamburger_close();login_screen();});
        }
        if(localStorage.hasOwnProperty('locally_stored_sessions') && user_data.email!='invitee'){
            document.getElementById("send_stored_sessions").addEventListener(clickOrTouch,send_stored_sessions);
        }

		document.getElementById("hamburger_icon").addEventListener(clickOrTouch,hamburger_toggle);
		document.getElementById("header_text").addEventListener(clickOrTouch,menu_screen);
        add_click_fancy("manage-subjects",manage_subjects);
        add_click_fancy("results",show_results);
        document.getElementById("show_about").addEventListener(clickOrTouch,function(){hamburger_close();show_about();});

        prepare_menu_when_subjects_loaded(); // loaded at user login time
	}else{
		game(); // just training
	}
}



var prepare_menu_when_subjects_loaded=function(){
    subjects_select_elem=document.getElementById('subjects-select');
    select_fill_with_json(cache_user_subjects,subjects_select_elem,session_data.subject);
    set_subject();
    add_click_fancy("start-button",function(){session_data.mode="training";game();});
    add_click_fancy("start-test-button",function(){session_data.mode="test";game();});
    document.getElementById("start-button").disabled=false;
    document.getElementById("start-test-button").disabled=false;    
    document.getElementById("results").disabled=false;
    document.getElementById("manage-subjects").disabled=false;
    if(user_data.access_level=='admin'){document.getElementById("letter_reader").disabled=false;}

}


var manage_subjects=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
    var normal_opts='<button id="add-subject" class="button">Añadir</button>';
    if(user_data.email=='invitee'){ normal_opts="";}
	canvas_zone_vcentered.innerHTML=' \
    '+normal_opts+'\
	<div id="results-div">cargando participantes...</div> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
	if(user_data.email!='invitee') {
        document.getElementById("add-subject").addEventListener(clickOrTouch,
            function(e) {
                e.stopPropagation();
                check_internet_access_with_img_url(
                    'http://www.centroafan.com/logo-afan.jpg',
                    function(){add_subject();internet_access=true;},
                    function(){alert('Error: no se puede añadir sujetos sin internet');internet_access=false;}
                    );
            });
    }
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
	var user_subjects_data=[];
	for(var key in cache_user_subjects){
		if (cache_user_subjects.hasOwnProperty(key)) {
			user_subjects_data.push(cache_user_subjects[key]);
		}
	}    
    
	if(user_subjects_data.length==0){
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br />No hay participantes";
	}else{
		document.getElementById("results-div").innerHTML="Resultados user: "+session_data.user+"<br /><table id=\"results-table\"  class=\"results-table\"></table>";
		var results_table=document.getElementById("results-table");
		DataTableSimple.call(results_table, {
			data: user_subjects_data,
			pagination: 5,
			row_id: 'id',
			row_id_prefix: 'row-subj',
			columns: [
				//{ data: 'id' },
				{ data: 'alias', col_header: 'Alias',  format: 'first_12', link_function_id: 'edit_subject'}, // TODO: edit_function: "" --> this will add the edit icon etc...
				{ data: 'birthdate', col_header: 'F.Nac'},
				{ data: 'genre', col_header: 'Gen'},
				{ data: 'comments', col_header: 'Info',  format: 'first_12' }
			]
		} );
	}
};


var add_subject=function(){
    if(!internet_access){alert('Error: no se puede añadir sujetos sin internet');return;}
	var accept_function=function(){
		var myform=document.getElementById('my-form');
		var myformsubmit=document.getElementById('my-form-submit');
		if (!myform.checkValidity()){
			if(debug) console.log("form error");
			// TODO se puede abstraer merjor...
		    myform.removeEventListener("submit", formValidationSafariSupport);
		    myform.addEventListener("submit", formValidationSafariSupport);
		    myformsubmit.removeEventListener("click", showFormAllErrorMessages);
		    myformsubmit.addEventListener("click", showFormAllErrorMessages);
			myformsubmit.click(); // won't submit (invalid), but show errors
		}else{
			open_js_modal_content('<h1>Añadiendo... '+document.getElementById('new-alias').value+'</h1>');
            ajax_CORS_request_json(backend_url+'ajaxdb.php?action=add_subject&user='+user_data.email+'&alias='+document.getElementById('new-alias').value+'&name='+document.getElementById('new-name').value+'&birthdate='+document.getElementById('new-birthdate').value+'&genre='+document.getElementById('new-genre').value+'&comments='+document.getElementById('new-comments').value,set_add_subject);
		}
	};
	var cancel_function=function(){ remove_modal("js-modal-window-alert"); };
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<!--<label for="new-alias">Alias</label>--> <input id="new-alias" type="text" required="required" readonly="readonly" style="visibility:hidden;" /><br /> \
			<label for="new-name">Nombre</label> <input id="new-name" type="text" required="required" onkeyup="update_alias()" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label> <input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  /><br /> \
			<label for="new-genre">Gen</label> <input id="new-genre" type="text" placeholder="m" required="required" pattern="[mfc]"  /><br /> \
			<label>Comentarios</label> <textarea id="new-comments"></textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Añadir Participante",form_html,accept_function,cancel_function);
};

var set_add_subject=function(data) {
    if(data.hasOwnProperty('success')){
        cache_user_subjects[data['success']]=data['data'];
        remove_modal();
        remove_modal("js-modal-window-alert");
        manage_subjects(); // to reload with the new user...
    }else{
        remove_modal();
        remove_modal("js-modal-window-alert");
        manage_subjects(); // to reload with the new user...
        alert("ERROR: "+data['error']);
    }
}



var update_alias=function(){
	var name=document.getElementById('new-name').value;
	document.getElementById('new-alias').value=slugify(name);
}

var edit_subject=function(sid){
    check_internet_access_with_img_url(
        'http://www.centroafan.com/logo-afan.jpg',
        function(){internet_access=true;edit_subject_internet(sid);}.bind(sid),
        function(){internet_access=false;alert('Error: no se puede editar sujetos sin internet');}
        );
};
var edit_subject_internet=function(sid){
    if(!internet_access){alert('Error: no se puede editar sujetos sin internet');return;}
    if(typeof(sid)==='undefined'){alert('Error: subject id (sid) is undefined.');return;}
	var accept_function=function(){
		var myform=document.getElementById('my-form');
		var myformsubmit=document.getElementById('my-form-submit');
		if (!myform.checkValidity()){
			if(debug) console.log("form error");
			// TODO se puede abstraer merjor...
		    myform.removeEventListener("submit", formValidationSafariSupport);
		    myform.addEventListener("submit", formValidationSafariSupport);
		    myformsubmit.removeEventListener("click", showFormAllErrorMessages);
		    myformsubmit.addEventListener("click", showFormAllErrorMessages);
			myformsubmit.click(); // won't submit (invalid), but show errors
		}else{
			open_js_modal_content('<h1>Actualizando... '+document.getElementById('new-alias').value+'</h1>');
            if(user_data.email=='invitee'){
                cache_user_subjects.invitado.name=document.getElementById('new-name').value;
                cache_user_subjects.invitado.birthdate=document.getElementById('new-birthdate').value;
                cache_user_subjects.invitado.genre=document.getElementById('new-genre').value;
                cache_user_subjects.invitado.comments=document.getElementById('new-comments').value;
                remove_modal();
                remove_modal("js-modal-window-alert");
                manage_subjects(); // to reload with the new user...
            }else{
                ajax_CORS_request_json(backend_url+'ajaxdb.php?action=update_subject&lid='+sid+'&user='+user_data.email+'&alias='+document.getElementById('new-alias').value+'&name='+document.getElementById('new-name').value+'&birthdate='+document.getElementById('new-birthdate').value+'&genre='+document.getElementById('new-genre').value+'&comments='+document.getElementById('new-comments').value, set_update_subject);
            }
		}
	};
	var cancel_function=function(){ remove_modal("js-modal-window-alert"); };
	var subj2edit={"id": sid, "alias":"", "name":"", "birthdate":"", "genre":"", "comments":"", "user":user_data.email}
	for(var key in cache_user_subjects){
		if (cache_user_subjects.hasOwnProperty(key) && cache_user_subjects[key]['id']==sid) {
			subj2edit=cache_user_subjects[key];
		}
	}
    if(subj2edit.alias==""){alert("Error: subject id "+sid+" not found.");return;}
	var form_html='<form id="my-form" action="javascript:void(0);"> \
			<ul class="errorMessages"></ul>\
			<!--<label>Usuario</label><input type="text" readonly="readonly" value="'+subj2edit.user+'" /><br />--> \
			<!--<label for="new-alias">Alias</label>--> <input id="new-alias" type="text" required="required" readonly="readonly" style="visibility:hidden;" value="'+subj2edit.alias+'" /><br /> \
			<label for="new-name">Nombre</label> <input id="new-name" type="text" required="required" value="'+subj2edit.name+'" /><br /> \
			<label for="new-birthdate">Fecha Nac.</label> <input id="new-birthdate" type="date" placeholder="yyyy-mm-dd" required="required" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"  value="'+subj2edit.birthdate+'" /><br /> \
			<label for="new-genre">Gen</label> <input id="new-genre" type="text" placeholder="m" required="required" pattern="[mfc]" value="'+subj2edit.genre+'" /><br /> \
			<label>Comentarios</label> <textarea id="new-comments">'+subj2edit.comments+'</textarea><br /> \
			<input id="my-form-submit" type="submit" style="visibility:hidden;display:none" />\
			</form>'; //title="Error: yyyy-mm-dd"		
	open_js_modal_alert("Editar Participante",form_html,accept_function,cancel_function);
};


var set_update_subject=function(data) {
    if(data['success']!='undefined'){
        cache_user_subjects[data['success']]=data['data'];
        remove_modal();
        remove_modal("js-modal-window-alert");
        manage_subjects(); // to reload with the new user...
    }else{
        alert("ERROR: "+JSON.stringify(data));
    }
};

var show_results=function(){
	preventBackExit();
	header_text.innerHTML=' &larr; '+app_name+' menu';
	canvas_zone_vcentered.innerHTML=' \
	    <button id="summary_view" class="button">Todos</button><br /> \
	    <button id="explore_results" class="button">Solo '+session_data.subject+'</button><br /> \
	<br /><button id="go-back" class="minibutton fixed-bottom-right go-back">&larr;</button> \
	';
    document.getElementById("explore_results").addEventListener(clickOrTouch,function(){explore_results();});
    document.getElementById("summary_view").addEventListener(clickOrTouch,function(){summary_view();});
	document.getElementById("go-back").addEventListener(clickOrTouch,function(){menu_screen();});
}



var reset_session=function(){
    session_data.num_correct=0;
    session_data.num_answered=0;
    session_data.result=0;
    session_data.duration=0;
    session_data.details=[];
    activity_timer.reset(); // also stops the timer
}


var game=function(){
    remove_modal(); // for safety...
    if(debug){console.log('game-called - game-mode? '+game_mode);}
    if(objectLength(cache_user_subjects)==0){
        open_js_modal_alert('Info', 'Debe crear al menos un participante.<br/>Participantes -> Añadir');
        return;
    }
    // CANNOT be here, in game-mode no clicks yet---------------------------
    //if(!check_if_sounds_loaded(memoria)){return;}
    // ---------------------------------------------------------------------- 
    // send data if seesion.mode is training and >60 seconds and >5 activities
    if(session_data.mode=="training" && !game_mode && session_data.duration>60 && session_data.num_answered>5){
        send_session_data(game);
    }else{
        //reset game variables --------
        reset_session();
        //-----------------------------
        var extra_options="";
        if(!game_mode){
            extra_options='<br /><button id="go_back_button" class="minibutton fixed-bottom-right go-back">&larr;</button>';
            header_text.innerHTML=' &larr; '+app_name+' menu';
        }
        canvas_zone_vcentered.innerHTML=' \
        <br /><button id="conciencia" class="button">Conciencia</button> \
        <br /><button id="memoria_visual" class="button">Memoria Visual</button> \
        <br /><button id="ritmo" class="button">Ritmo</button> \
        <br /><button id="velocidad" class="button">Velocidad</button> \
        <br /><button id="discr_visual" class="button">Discr. Visual</button> \
        <br /><button id="completo" class="button">COMPLETO</button>\
        '+extra_options+'\
        ';
        
        add_click_fancy("completo",completo);
        add_click_fancy("conciencia",conciencia);
        add_click_fancy("memoria_visual",memoria_visual);
        add_click_fancy("ritmo",ritmo);
        add_click_fancy("velocidad",velocidad);
        add_click_fancy("discr_visual",discr_visual);
        if(!game_mode){
            document.getElementById("go_back_button").addEventListener(clickOrTouch,function(){menu_screen();});
        }
        // reset header link
        //document.getElementById("header_text").removeEventListener(clickOrTouch,game); // if comes from game
        // if comes from menu (in case it is already there)
        document.getElementById("header_text").removeEventListener(clickOrTouch,menu_screen);
        document.getElementById("header_text").addEventListener(clickOrTouch,menu_screen);
    }
}

// IMPORTANT: Has to be called after 1 click so it cannot be game() since
// in game-mode that one is the first function (no click)
var check_if_sounds_loaded=function(callback){
    if(typeof(callback)!=='function'){throw new Error("check_if_sounds_loaded called without a callback.");}
	canvas_zone_vcentered.innerHTML='...pre-cargando sonidos...'; // for the user to notice
	if(ResourceLoader.check_if_lazy_sounds_loaded(callback)){
		if(typeof(audio_sprite)==='undefined'){// load audio in the object 
			var audio_sprite_object=media_objects.sounds[audio_sprite_name];
			audio_sprite=new AudioSprite(audio_sprite_object,audio_object_sprite_ref,debug);
			audio_sprite.playSpriteRange('zsilence_start',callback);
            return false;
		}else{
            return true;
		}
	}
}











function send_session_data(finish_callback){
    remove_modal();
    if(!game_mode){
        if(session_data.num_answered!=0) session_data.result=session_data.num_correct/session_data.num_answered;
        if(debug) console.log(JSON.stringify(session_data));
        // first store locally in cache
        if(!cache_user_subject_results.hasOwnProperty(session_data.subject)){
            cache_user_subject_results[session_data.subject]={"general":{"user":session_data.user,"subject": session_data.subject},"elements":[]};
        }
        session_data.highest_id++; // avoid clashes
        var result_obj={
                id:""+(session_data.highest_id),
                subject: session_data.subject,
                type:session_data.type,
                mode:session_data.mode,
                age: session_data.age,
                num_answered:session_data.num_answered,
                num_correct:session_data.num_correct,
                result:session_data.result,
                level:session_data.level,
                duration:session_data.duration,
                timestamp:session_data.timestamp
            };
        if(session_data.mode=="test"){
            result_obj.details=session_data.details;
            for(var i=0;i<result_obj.details.length;i++){
                session_data.highest_detail_id++; // avoid clashes
                result_obj.details[i].id=""+session_data.highest_detail_id;
            }
            if(!cache_user_subject_results.hasOwnProperty(session_data.subject)) cache_user_subject_results[session_data.subject]={'general':{'user':session_data.user,'subject':session_data.subject},'elements':[]};
            cache_user_subject_results[session_data.subject].elements.unshift(result_obj);
            cache_user_subject_result_detail[result_obj.id]={general: {session: result_obj.id}, elements: result_obj.details};
        }else{
            if(!cache_user_subject_training.hasOwnProperty(session_data.subject)) cache_user_subject_training[session_data.subject]={'general':{'user':session_data.user,'subject':session_data.subject},'elements':[]};;
            cache_user_subject_training[session_data.subject].elements.unshift(result_obj);
        }
        if(user_data.email!='invitee'){
            var locally_stored_sessions=[];
            if(localStorage.hasOwnProperty('locally_stored_sessions')){
                locally_stored_sessions=JSON.parse(localStorage.getItem("locally_stored_sessions"));
            }
            locally_stored_sessions.push(session_data);
            localStorage.setItem("locally_stored_sessions", JSON.stringify(locally_stored_sessions));
            reset_session();
            canvas_zone_vcentered.innerHTML='<br />...Enviando datos offline al servidor...<br /><br />';
            check_internet_access_with_img_url('http://www.centroafan.com/logo-afan.jpg',send_session_data_success,send_session_data_fail,finish_callback);
        }else{
            reset_session();
            if(typeof(finish_callback)!='undefined'){finish_callback();}
            else{game();}
        }
    }
}

function send_session_data_success(finish_callback){
    if(typeof(finish_callback)=='undefined'){finish_callback=menu_screen;}
    if(localStorage.hasOwnProperty('locally_stored_sessions')){
        var locally_stored_sessions=JSON.parse(localStorage.getItem("locally_stored_sessions"));
        ajax_CORS_request(backend_url+'ajaxdb.php',send_session_data_success_callback,"json","POST","action=send_sessions_data_post&json_string="+(JSON.stringify(locally_stored_sessions)),finish_callback);
    }else{
        alert("ERROR: No hay datos para enviar.");
        menu_screen();
    }
}
function send_session_data_success_callback(data){ 
    internet_access=true;
    canvas_zone_vcentered.innerHTML='<br />Datos guardados en el servidor.';
    if(debug) console.log('Storing data. Server message: '+data.msg);
    reset_session();
    localStorage.removeItem("locally_stored_sessions");
    if(data.hasOwnProperty('callback_arg') && typeof(data.callback_arg)=='function'){data.callback_arg();}
    else{menu_screen();}
}
function send_session_data_fail(finish_callback){
    internet_access=false;
    console.log("No hay conexión a internet, guardando en local...");
    if(typeof(finish_callback)!='undefined'){finish_callback();}
    else{menu_screen();}
}
// Function created to make it explicit that this timethe user intendendly clicked on "send data"
// And it was not possible to send it (no internet)
function send_stored_sessions_fail(){
    internet_access=false;
    alert("No hay conexión a internet, pruebe más tarde.");
    if(typeof(finish_callback)!='undefined'){finish_callback();}
    else{menu_screen();}
}

function send_stored_sessions(){
    remove_modal();
    canvas_zone_vcentered.innerHTML='<br />...Enviando datos al servidor...<br /><br />';
    check_internet_access_with_img_url('http://www.centroafan.com/logo-afan.jpg',send_session_data_success,send_stored_sessions_fail);
}



