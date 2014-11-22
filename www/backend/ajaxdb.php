<?php

date_default_timezone_set('Europe/Madrid');

if( !isset($_GET['action']) ){
	exit("Error: action not set");
}
$action=$_GET['action'];
$timestamp=date("Y-m-d H:i:s");

// access info (if not WordPress)
$db_user="hector";
$db_pass="homohominilopus";
$db_server="mysql.cognitionis.com";
$db="afan_app";

$db_connection =  mysql_pconnect( $db_server, $db_user, $db_pass  ) or die( 'Could not open connection to server' );
mysql_select_db( $db, $db_connection) or die( 'Could not select database '. $db );

/* SET UTF-8 independently of the MySQL and PHP installation */
mysql_query("SET NAMES 'utf8'");	
mysql_query("set time_zone:='Europe/Madrid'");	

$output=array();
	
if ($action == "get_subjects"){
	if( !isset($_GET['user']) ){
		exit("Error: user not set");
	}
	$user=$_GET['user'];

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
?>
