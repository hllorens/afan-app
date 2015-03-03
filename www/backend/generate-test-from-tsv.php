<?php

date_default_timezone_set('Europe/Madrid');

$timestamp=date("Y-m-d H:i:s");



$vowels_arr = array('a','e','i','o','u');
$trabadas_arr = array('r','l');
$table = array('à'=>'a', 'á'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'í'=>'i', 'ï'=>'i', 'ñ'=>'ny', 'ò'=>'o', 'ó'=>'o', 'ú'=>'u' );

$activity_arr=array();
$level=1;
$tsvfile="test.tsv";
if( isset($_GET['file']) ){
	$tsvfile=$_GET['file'];
}
if( isset($_GET['level']) ){
	$level=$_GET['level'];
}



$file = fopen($tsvfile,"r");
$num_words=0;

if($file!=false){
	while(! feof($file)){
	  $linearr=fgetcsv($file,0,"\t");
	  if(count($linearr)<3) continue;
	  $word=trim($linearr[0]);
	  $sounds_arr=preg_split("/[\s]+/",trim($linearr[1]));
	  $alternatives_arr=preg_split("/,[\s]*/", trim($linearr[2]));
	  if(strlen($word)==0 || count($sounds_arr)==0 || count($alternatives_arr)<2){echo "omit "+print_r($linearr); continue;}
	  ++$num_words;
	  $activity=array(
	  		"type" => "sounds",
	  		"sounds" => $sounds_arr,
	  		"answers" => array_merge(array($word),$alternatives_arr),
	  		"level" => $level
	  	);
	  $activity_arr[]=$activity;    
	}
	fclose($file);
}else{
	echo "file not found";exit();
}

/*$JSON_UNESCAPED_SLASHES=64;
$JSON_PRETTY_PRINT=128;
$JSON_UNESCAPED_UNICODE=256;*/

header('Content-type: text/plain');
#echo "word\tsounds\talternatives\n";

//echo json_encode( $activity_arr, $JSON_UNESCAPED_SLASHES );

$fp = fopen($tsvfile.'.json', 'w');
fwrite($fp, json_encode($activity_arr));
fclose($fp);

/*$output=array();
//if ($action == "get_subjects"){
header('Content-type: application/json');
echo json_encode( $output ); //, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE  );
//print_r($output);*/


?>



