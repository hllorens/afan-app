<?php

date_default_timezone_set('Europe/Madrid');

function get_value($name){
	if( !isset($_GET[$name]) ) exit("Error: $name not set");
	return 	$_GET[$name];
}

$action=get_value("action");
$timestamp=date("Y-m-d H:i:s");

// access info (if not WordPress)
$db_user="hector";
$db_pass="homohominilopus";
$db_server="mysql.centroafan.com";
$db="afan_app";

$db_connection =  mysql_pconnect( $db_server, $db_user, $db_pass  ) or die( 'Could not open connection to server' );
mysql_select_db( $db, $db_connection) or die( 'Could not select database '. $db );

/* SET UTF-8 independently of the MySQL and PHP installation */
mysql_query("SET NAMES 'utf8'");	
mysql_query("set time_zone:='Europe/Madrid'");	

$output=array();
	
if ($action == "get_subjects"){
	$user=get_value("user");

	$sQuery = "SELECT * FROM subjects WHERE user='$user';";
	//echo "query: $sQuery ";
	$rResult = mysql_query( $sQuery, $db_connection ) or die(mysql_error());
	while ( $aRow = mysql_fetch_array( $rResult ) )	{
		$output[$aRow['alias']] = $aRow['birthdate'];
	}

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}


if ($action == "add_subject"){
	$user=get_value('user');
	$alias=get_value('alias');
	$name=get_value('name');
	$birthdate=get_value('birthdate');
	$comments=get_value('comments');

	$sQuery = "INSERT INTO subjects (user, alias, name, birthdate,comments) VALUES ('$user', '$alias', '$name', '$birthdate', '$comments');";
	$rResult = mysql_query( $sQuery, $db_connection );
	if(!$rResult){header('HTTP/1.1 500 Internal Server Error');die("Error: Exists. ".mysql_error()." -- ".$sQuery);}		
	header('Content-type: application/json');
	echo json_encode( '{"success":"$user"}' );
}

if ($action == "send_session_data"){
	$output["msg"]="success";
	$reference=get_value("reference");
	$user=get_value("user");
	$subject=get_value("subject");
	$age=get_value("age");
	$num_answered=get_value("num_answered");
	$num_correct=get_value("num_correct");
	$result= ((int) $num_correct) / ((int) $num_answered);
	$level=get_value("level");
	$duration=get_value("duration");
	$timestamp=get_value("timestamp");

	$sQuery = "INSERT INTO sessions(reference,user,subject,age,num_answered,num_correct,result,level,duration,timestamp)  VALUES ('$reference','$user','$subject','$age','$num_answered','$num_correct','$result','$level','$duration','$timestamp');"; 
	$rResult = mysql_query( $sQuery, $db_connection );
	if(!$rResult){ $output["msg"]=mysql_error()." -- ".$sQuery; }
	else{ $output["msg"]="Success. Data session stored in the server. --"; }	
	//else{$output='{"msg":"Success. Data session stored in the server. -- '.$sQuery.'"}';}	

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}

if ($action == "get_results"){
	$user=get_value("user");
	$subject=get_value("subject");

	$sQuery = "SELECT * FROM sessions WHERE user='$user' AND subject='$subject';";
	//echo "query: $sQuery ";
	$output['general'] = array();
	$output['general']['user'] = $user;
	$output['general']['subject'] = $subject;

	$rResult = mysql_query( $sQuery, $db_connection ) or die(mysql_error());
	while ( $aRow = mysql_fetch_array( $rResult ) )	{
		$output[$aRow['id']] = array();
		$output[$aRow['id']]['reference']=$aRow['reference'];
		$output[$aRow['id']]['age']=$aRow['age'];
		$output[$aRow['id']]['num_answered']=$aRow['num_answered'];
		$output[$aRow['id']]['num_correct']=$aRow['num_correct'];
		$output[$aRow['id']]['result']=$aRow['result'];
		$output[$aRow['id']]['level']=$aRow['level'];
		$output[$aRow['id']]['duration']=$aRow['duration'];
		$output[$aRow['id']]['timestamp']=$aRow['timestamp'];
	}

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}

?>
