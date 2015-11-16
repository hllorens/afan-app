<?php

date_default_timezone_set('Europe/Madrid');

$timestamp=date("Y-m-d H:i:s");



$activity_arr=array();
$tsvfile="ac_velocidad_data.tsv";
if( isset($_GET['file']) ){
	$tsvfile=$_GET['file'];
}

$data_arr=array();

$file = fopen($tsvfile,"r");
if($file!=false){
	while(! feof($file)){
	  $linearr=fgetcsv($file,0,"\t");
	  #print_r($linearr);
	  for($level=0;$level<=count($linearr);$level++){
	  	$elem=trim($linearr[$level]);
		if($elem!=""){
			if (!array_key_exists("".($level+1), $data_arr)){
				$data_arr["".($level+1)]=array();
			}
			$data_arr["".($level+1)][]=$elem;
		}
	  }
	}
	fclose($file);
}else{
	echo "file not found";exit();
}

header('Content-type: text/plain');
print_r($data_arr);

$fp = fopen(str_replace(".tsv","",$tsvfile).'.json', 'w');
fwrite($fp, json_encode($data_arr));
fclose($fp);



?>



