<?php

date_default_timezone_set('Europe/Madrid');

function get_value($name){
	if( !isset($_REQUEST[$name]) ){
		$output['msg']="Error: $name not set. REQUEST: ".$_REQUEST;
		header('Content-type: application/json');
		echo json_encode( $output );
		exit();
	}
	return 	$_REQUEST[$name];
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

}else if ($action == "add_subject"){
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
}else if ($action == "send_session_data"){
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

}else if ($action == "send_session_data_post"){
	/*$output["msg"]="success";
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

	$output['msg'].=get_value("details");*/

	// WRITE A LOG IN A FILE, TEST WITH JQUERY AJAX

	$output["msg"]="hoooola ".get_value("type");
	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "get_results"){
	$user=get_value("user");
	$subject=get_value("subject");

	$sQuery = "SELECT * FROM sessions WHERE user='$user' AND subject='$subject';";
	//echo "query: $sQuery ";
	$output['general'] = array();
	$output['general']['user'] = $user;
	$output['general']['subject'] = $subject;
	$output['sessions'] = array();

	$rResult = mysql_query( $sQuery, $db_connection ) or die(mysql_error());
	$session_count=0;	
	while ( $aRow = mysql_fetch_array( $rResult ) )	{
		$output['sessions'][]=array();
		$output['sessions'][$session_count]['id'] = $aRow['id'];
		$output['sessions'][$session_count]['reference']=$aRow['reference'];
		$output['sessions'][$session_count]['age']=$aRow['age'];
		$output['sessions'][$session_count]['num_answered']=$aRow['num_answered'];
		$output['sessions'][$session_count]['num_correct']=$aRow['num_correct'];
		$output['sessions'][$session_count]['result']=$aRow['result'];
		$output['sessions'][$session_count]['level']=$aRow['level'];
		$output['sessions'][$session_count]['duration']=$aRow['duration'];
		$output['sessions'][$session_count]['timestamp']=$aRow['timestamp'];
		$session_count++;		
	}

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "delete_session"){
	$id=get_value("id");
	$subject=get_value("subject");

	$sQuery = "DELETE FROM sessions WHERE id='$id' AND subject='$subject';";

	$rResult = mysql_query( $sQuery, $db_connection ) or die(mysql_error());
	$rResult = mysql_query( $sQuery, $db_connection );
	if(!$rResult){ $output["msg"]=mysql_error()." -- ".$sQuery; }
	else{ $output["msg"]="Success. Session $id of $subject deleted. --"; }	

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else{
	$output['msg']="unsupported action";
	header('Content-type: application/json');
	echo json_encode( $output );	
}



?>
