<?php

date_default_timezone_set('Europe/Madrid');

if( !isset($_GET['action']) ){
	exit("Error: action not set");
}
$action=$_GET['action'];
$timestamp=date("Y-m-d H:i:s");

/*
// access info
$db_user="hector";
$db_pass="homohominilopus";
$db_server="mysql.cognitionis.com";
$db="afan_app";
$db_connection =  mysql_pconnect( $db_server, $db_user, $db_pass  ) or die( 'Could not open connection to server' );
mysql_select_db( $db, $db_connection) or die( 'Could not select database '. $db );
mysql_query("SET NAMES 'utf8'");	
mysql_query("set time_zone:='Europe/Madrid'");	
*/

$output=array();
	
//if ($action == "get_subjects"){
header('Content-type: application/json');
echo json_encode( $output );
//print_r($output);

?>
