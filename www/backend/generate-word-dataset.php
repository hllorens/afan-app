<?php

date_default_timezone_set('Europe/Madrid');

/*if( !isset($_GET['action']) ){
	exit("Error: action not set");
}
$action=$_GET['action'];*/
$timestamp=date("Y-m-d H:i:s");

$file = fopen("words-syllables.tsv","r");

$num_words=0;
header('Content-type: text/plain');
echo "word\tsounds\tnumsounds\tnumsyllables\n";
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
  for($pos=0;$pos<$sounds_arr_count;$pos++){ 
  	if($sounds_arr[$pos]=="/"){
  		$syllables_arr[]=$current_syllable_arr;
		$current_syllable_arr=array();
  	}else{
  		$current_syllable_arr[]=$sounds_arr[$pos];
  	}
  }
  if(count($current_syllable_arr)>0)
	$syllables_arr[]=$current_syllable_arr;	
  #print_r($syllables_arr);
  $syllables_arr_count=count($syllables_arr);
  echo "$word\t$sounds\t$sounds_arr_count\t$syllables_arr_count\n";
}

fclose($file);


?>
