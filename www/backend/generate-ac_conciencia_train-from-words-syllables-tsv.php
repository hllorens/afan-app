<?php

date_default_timezone_set('Europe/Madrid');

/// SET MAX SYLLABLES
$MAX_SYLLABLES=3; // up to 4 or 5...
/////////
if( isset($_GET['syllables']) ){
	$MAX_SYLLABLES=$_GET['syllables'];
}

/*if( !isset($_GET['action']) ){
	exit("Error: action not set");
}
$action=$_GET['action'];*/
$timestamp=date("Y-m-d H:i:s");

$vowels_arr = array('a','e','i','o','u');
$trabadas_arr = array('r','l');
$table = array('à'=>'a', 'á'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'í'=>'i', 'ï'=>'i', 'ñ'=>'ny', 'ò'=>'o', 'ó'=>'o', 'ú'=>'u' );

// ccv trabada  ccv con l o r                    3 puntos
// directa cv (normal), inversa vc (+dificil)    2 punts
// diptongo   vv in the same syllable            0 puntos

$file = fopen("words-syllables.tsv","r");

$word_obj_arr=array();
$num_words=0;
$level=1;
header('Content-type: text/plain');
echo "word\tsounds--------------\tnso\tnsy\tinv\tccv\tvcc\tdiptongos\thiatos\tprobl\n";
while(! feof($file)){
  $word_and_sounds=fgetcsv($file,0,"\t");
  if(count($word_and_sounds)<2) continue;
  $word=trim($word_and_sounds[0]);
  $sounds=trim($word_and_sounds[1]);
  if(strlen($word)==0 || strlen($sounds)==0){echo "omit "+print_r($word_and_sounds); continue;}
  ++$num_words;
  $sounds_arr=preg_split("/[\s]+/", $sounds); //explode(" ",$sounds);
  $sounds_arr_count=count($sounds_arr);
  $syllables_arr=array();
  $current_syllable_arr=array();
  
  $num_inversas=0;
  $num_ccv=0;
  $num_ccv_trabadas=0;
  $num_vcc=0;
  $num_diptongos=0;
  $num_hiatos=0;
  $num_sonidos_problematicos=0;
  $vowel_arr=array();
  for($pos=0;$pos<$sounds_arr_count;$pos++){
  	if(in_array($sounds_arr[$pos],$vowels_arr)) $vowel_arr[$pos]="v";
  	else $vowel_arr[$pos]="c";
  	
  	if($sounds_arr[$pos]=="/"){
  		$vowel_arr[$pos]="/";	
  		$syllables_arr[]=$current_syllable_arr;
  		$syllables_vowel_arr[]=$current_syllable_vowel_arr;
		$current_syllable_arr=array();
		$current_syllable_vowel_arr=array();
		continue; // no need to calculate staff
  	}else{
  		$current_syllable_arr[]=$sounds_arr[$pos];
  		$current_syllable_vowel_arr[]=$vowel_arr[$pos];
  	}
  	
  	// other calculations
  	if($pos!=0){
  		if($vowel_arr[$pos-1]=="v" && $vowel_arr[$pos]=="c"){
  			++$num_inversas;
  		}elseif($vowel_arr[$pos-1]=="v" && $vowel_arr[$pos]=="v"){
  			++$num_diptongos;
  		} 		
  		if($pos!=1){
	  		if($vowel_arr[$pos-2]=="c" && $vowel_arr[$pos-1]=="c" && $vowel_arr[$pos]=="v"){
	  			++$num_ccv;
	  			if(in_array($sounds_arr[$pos-1],$trabadas_arr))	++$num_ccv_trabadas;
	  			else echo ">>>>>>>>>>>>>>>>>>>> AAAAAAHHHHH ccv no trabada";
	  		}
	  		if($vowel_arr[$pos-2]=="v" && $vowel_arr[$pos-1]=="c" && $vowel_arr[$pos]=="c"){
	  			++$num_vcc;
	  			if( ! ( (($sounds_arr[$pos-1]=='n' || $sounds_arr[$pos-1]=='b') && $sounds_arr[$pos]=='s' ) )	) 
	  				echo ">>>>>>>>>>>>>>>>>>>> AAAAAAHHHHH vcc no bs ns";
	  		}	  		
	  		if($vowel_arr[$pos-2]=="v" && $vowel_arr[$pos-1]=="/" && $vowel_arr[$pos]=="v"){
	  			++$num_hiatos;
	  		}	  		
  		}
  	}	
  	// prepare next iteration
  	//if($is_vowel) $previous_vowel=true;
  	//else $previous_vowel=false;
  	
  }
  if(count($current_syllable_arr)>0)
	$syllables_arr[]=$current_syllable_arr;	
  #print_r($syllables_arr);
  $syllables_arr_count=count($syllables_arr);
  echo "$word\t".str_pad($sounds, 20)."\t$sounds_arr_count\t$syllables_arr_count\t$num_inversas\t$num_ccv_trabadas\t$num_vcc\t$num_diptongos\t$num_hiatos\t$num_sonidos_problematicos\n";
  $word_obj=array(
  		"word" => $word,
  		"sounds_arr" => $sounds_arr,
  		"sounds_arr_count" => $sounds_arr_count,
  		"vowel_arr" => $vowel_arr,
  		"syllables_arr" => $syllables_arr,
  		"syllables_vowel_arr" => $syllables_vowel_arr,
  		"syllables_arr_count" => $syllables_arr_count,
  		"num_inversas" => $num_inversas,
  		"num_ccv_trabadas" => $num_ccv_trabadas,
  		"num_vcc" => $num_ccv_trabadas,
  		"num_diptongos" => $num_diptongos,
  		"num_hiatos" => $num_hiatos,
  		"num_sonidos_problematicos" => $num_sonidos_problematicos
  	);
  $word_obj_arr[$syllables_arr_count][]=$word_obj;
}

fclose($file);

$file = fopen("words-syllables.tsv","r");

$vowels_arr = array('a','e','i','o','u');
$trabadas_arr = array('r','l');

//-----------------------------------------------
//print_r($word_obj_arr[2]);

$json_activities=array();

$similar_words=null;
for($num_syll=1;$num_syll<=$MAX_SYLLABLES;$num_syll++){
	echo "\n\n--------- $num_syll sílabas --------------\n";
	foreach($word_obj_arr[$num_syll] as $word_obj){
		echo "\n->".$word_obj['word'].": ";
		$similar_words=array();
		foreach($word_obj_arr[$num_syll] as $word_obj2){
			$difference_score=0;
			if($word_obj['word']!=$word_obj2['word']){
				
				for($num_silaba=0;$num_silaba<$word_obj['syllables_arr_count'];$num_silaba++){
					$num_sounds=count($word_obj['syllables_arr'][$num_silaba]);	
					$num_sounds2=count($word_obj2['syllables_arr'][$num_silaba]);
					for($num_sonido=0;$num_sonido<$num_sounds;$num_sonido++){
						if($num_sonido<$num_sounds2){
							if($word_obj['syllables_arr'][$num_silaba][$num_sonido] !=
							    $word_obj2['syllables_arr'][$num_silaba][$num_sonido]){
							    	if($word_obj['syllables_vowel_arr'][$num_silaba][$num_sonido]=="v" 
							    		&& $word_obj2['syllables_vowel_arr'][$num_silaba][$num_sonido]=="v" )
							    			$difference_score+=3;
							    	else
							    		$difference_score+=2;
						    		if(in_array($word_obj['syllables_arr'][$num_silaba][$num_sonido],$word_obj2['syllables_arr'][$num_silaba])){
									if($word_obj['syllables_vowel_arr'][$num_silaba][$num_sonido]=="v" 
							    		|| $word_obj2['syllables_vowel_arr'][$num_silaba][$num_sonido]=="v")
								    		$difference_score-=1;
							    		$difference_score-=1;
							    	}
							    	if(!in_array($word_obj['syllables_arr'][$num_silaba][$num_sonido],$word_obj2['sounds_arr']))
							    		$difference_score+=1;
							}	
						}else break;
					}
					if($num_sounds!=$num_sounds2) $difference_score+=abs($num_sounds-$num_sounds2)*2;
				}
				$similar_words[$difference_score][]=$word_obj2['word'];
			}
		
		}
		//print_r($similar_words); break;
        $difficulty=$num_syll+$word_obj['num_inversas']*2+$word_obj['num_ccv_trabadas']*3;
        $level=1;
        if($difficulty>2){
            $level=2;
        }
        if($difficulty>=5){
            $level=3;
        }
        echo "difficulty $difficulty level $level";
        
		$activity=array(
			"type" => "sounds",
			"sounds" => $word_obj['sounds_arr'],
			"level" => $level,
	  		"answers" => array(strtr($word_obj['word'], $table))
	  		);
		$similar_count=0;
		for($i=1;$i<15;$i++){
			if(array_key_exists($i, $similar_words))
				foreach($similar_words[$i] as $similar_word){
					++$similar_count;
					echo "$similar_word ($i),";
                    if(array_key_exists($similar_word, $activity['answers'])) echo ">>>>>> ERROR: Duplicate??";
					$activity['answers'][]=strtr($similar_word, $table);
					if($similar_count==5) break;
				}
			if($similar_count==5) break;
		}
		$json_activities[$level][]=$activity;
	}
}

/*$JSON_UNESCAPED_SLASHES=64;
$JSON_PRETTY_PRINT=128;
$JSON_UNESCAPED_UNICODE=256;*/
echo json_encode( $json_activities );



?>
