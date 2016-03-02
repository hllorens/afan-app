<?php

session_start(); 

date_default_timezone_set('Europe/Madrid');

function get_value($name){
	if( !isset($_REQUEST[$name]) ){
		$output['msg']="Error: $name not set. REQUEST: ".implode(',',$_REQUEST);
		header('Content-type: application/json');
		echo json_encode( $output );
		exit();
	}
	return 	$_REQUEST[$name];
}

$action=get_value("action");
$timestamp_seconds=date("Y-m-d H:i:s");

// access info (if not WordPress)
$db_credentials = json_decode(file_get_contents("../../../../secrets/db_credentials_afan-app.json"));
$gclient_secret = json_decode(file_get_contents("../../../../secrets/gclient_secret_afan-app.json"));

$db_connection =  mysqli_connect( $db_credentials->db_server, $db_credentials->user, $db_credentials->pass  ) or die( 'Could not open connection to server' );
mysqli_select_db( $db_connection, $db_credentials->db_name) or die( 'Could not select database' );

/* SET UTF-8 independently of the MySQL and PHP installation */
mysqli_query($db_connection, "SET NAMES 'utf8'");	
mysqli_query($db_connection, "set time_zone:='Europe/Madrid'");	

$output=array();
	
if ($action == "get_users"){
	if($_SESSION['access_level']!='admin'){echo "ERROR: no admin";return;}
	$sQuery = "SELECT * FROM users";
	//echo "query: $sQuery ";
	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	while ( $aRow = mysqli_fetch_array( $rResult ) )	{
		$output[$aRow['email']] = array();
		$output[$aRow['email']]['email'] = $aRow['email'];
		$output[$aRow['email']]['access_level'] = $aRow['access_level'];
	}
	header('Content-type: application/json');
	echo json_encode( $output );
}else if ($action == "gen_session_state"){
	$state = md5(rand());
	$_SESSION["state"]=$state;
	echo "$state";
}else if ($action == "login_bypass"){
    $output['error']="";
    $output['info']="";
    unset($_SESSION['long_lived_access_token']);
    unset($_SESSION['user_id']);
    unset($_SESSION['username']);
    unset($_SESSION['email']);
    unset($_SESSION['picture']);
    if ( (get_value("state")) != ($_SESSION["state"]) ) {
        $output['error']="FAILURE: Forgery attack? Invalid state parameter ".get_value("state");
    }else{
        $user = $_REQUEST['user'];
        $sQuery = "SELECT * FROM users WHERE email='".$user."'";
        $rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
        if ( $aRow = mysqli_fetch_array( $rResult ) ){ //existing user
            $_SESSION['access_level'] = $aRow['access_level'];
			$_SESSION['user_id'] = $user;
			$_SESSION['display_name'] = $aRow['display_name'];
			$_SESSION['picture'] = $aRow['picture'];
			$_SESSION['email'] = $user;

            $sQuery = "UPDATE users  SET last_login='$timestamp_seconds',last_provider='bypass' WHERE email='".$_SESSION['email']."';";
            $rResult = mysqli_query( $db_connection, $sQuery );
            if(!$rResult){$output['error']="Error: ".mysqli_error( $db_connection )." -- ".$sQuery;}
        }else{
            $output['error']="Error: empty user? no user info with the token?";
        }
    }
    $output['user_id']=$_SESSION['user_id'];
    $output['display_name']=$_SESSION['display_name'];
    $output['picture']=$_SESSION['picture'];
    $output['email']=$_SESSION['email'];
    $output['access_level']=$_SESSION['access_level'];
    $output['toksum']=substr($_SESSION['long_lived_access_token']->access_token,0,5);    
    header('Content-type: application/json');
    echo json_encode( $output );
}else if ($action == "gconnect"){
    $CLIENT_ID = $gclient_secret->client_id;
    $CLIENT_SECRET = $gclient_secret->client_secret;
    $output['error']="";
    $output['info']="";
// if gconnect is called automatically with a code request saved in cookies the session access token might have expired already
// I need to study this better... maybe have a job in the server that renews the token periodically... and in any case always try to use the token before login,
// if it expired, obtain a new one...
//    if (empty($_SESSION['long_lived_access_token'])) { 
        unset($_SESSION['long_lived_access_token']);
        unset($_SESSION['user_id']);
        unset($_SESSION['username']);
        unset($_SESSION['email']);
        unset($_SESSION['picture']);
        if ( (get_value("state")) != ($_SESSION["state"]) ) {
            $output['error']="FAILURE: Forgery attack? Invalid state parameter ".get_value("state"); //." - ".$_SESSION["state"].". "; do not return this... to much information for a thief
        }else{
            $code = $_REQUEST['code'];
            $url = 'https://accounts.google.com/o/oauth2/token';
            $params = array(
                "code" => $code,
                "client_id" => $CLIENT_ID,
                "client_secret" => $CLIENT_SECRET,
                "redirect_uri" => "postmessage",
                "grant_type" => "authorization_code"
            ); 
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $params);
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            $response = curl_exec($curl);
            curl_close($curl);
            $_SESSION['long_lived_access_token'] = json_decode($response);
            // Verify the token (OPTIONAL)
            $url = 'https://www.googleapis.com/oauth2/v2/tokeninfo?access_token='.
                $_SESSION['long_lived_access_token']->access_token;
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_URL => $url
            ));
            $response = curl_exec($curl);
            curl_close($curl);
            $tokenInfo = json_decode($response);
            if ($tokenInfo->error) {
                unset($_SESSION['long_lived_access_token']);
                $output['error']="ERROR in the token: ".$tokenInfo->error;
            }else if ($tokenInfo->audience != $CLIENT_ID) {
                $output['error']="ERROR: Token's client ID does not match app's."; //, 401);
            }else{
                // Get user info
                $url = 'https://www.googleapis.com/oauth2/v2/userinfo?access_token='.
                    $_SESSION['long_lived_access_token']->access_token.'&alt=json';
                $curl = curl_init();
                curl_setopt_array($curl, array(
                    CURLOPT_RETURNTRANSFER => 1,
                    CURLOPT_URL => $url
                ));
                $response = curl_exec($curl);
                curl_close($curl); //echo $response;
                $userInfo = json_decode($response);
                $_SESSION['user_id'] = $userInfo->id;
                $_SESSION['display_name'] = $userInfo->name;
                $_SESSION['picture'] = $userInfo->picture;
                $_SESSION['email'] = $userInfo->email;
                $sQuery = "SELECT * FROM users WHERE email='".$userInfo->email."'"; //echo "query: $sQuery ";
                $rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
                if ( $aRow = mysqli_fetch_array( $rResult ) ){ //existing user
                    $_SESSION['access_level'] = $aRow['access_level'];
                    // update the user last_login and last_provider
                    $sQuery = "UPDATE users  SET last_login='$timestamp_seconds',last_provider='google' WHERE email='".$_SESSION['email']."';";
                    $rResult = mysqli_query( $db_connection, $sQuery );
                    if(!$rResult){$output['error']="Error: ".mysqli_error( $db_connection )." -- ".$sQuery;}
                }else if(!empty($_SESSION['email'])){ //new user
                    $_SESSION['access_level'] = 'normal'; //invitee
                    mail("hectorlm1983@gmail.com","New afan-app user","NEW USER: ".$_SESSION['email'].". Change from 'invitee' to something else or DELETE");
                    $sQuery = "INSERT INTO users (email, display_name, access_level, picture, last_login, last_provider, creation_timestamp) VALUES ('".$_SESSION['email']."', '".$_SESSION['display_name']."', '".$_SESSION['access_level']."', '".$_SESSION['picture']."', '$timestamp_seconds', 'google', '$timestamp_seconds');";
                    $rResult = mysqli_query( $db_connection, $sQuery );
                    if(!$rResult){$output['error']="Error: Exists. ".mysqli_error( $db_connection )." -- ".$sQuery;}
                    $output['info']="new user";
                }else{
                    $output['error']="Error: empty user? no user info with the token?";
                }
            }
        }
//    }
    $output['user_id']=$_SESSION['user_id'];
    $output['display_name']=$_SESSION['display_name'];
    $output['picture']=$_SESSION['picture'];
    $output['email']=$_SESSION['email'];
    $output['access_level']=$_SESSION['access_level'];
    $output['toksum']=substr($_SESSION['long_lived_access_token']->access_token,0,5);    
    header('Content-type: application/json');
    echo json_encode( $output );
}else if ($action == "gdisconnect"){
	if (empty($_SESSION['long_lived_access_token'])){
           $output['error']="No one is logged";
	}else{
		$url = 'https://accounts.google.com/o/oauth2/revoke?token='.
				$_SESSION['long_lived_access_token']->access_token;
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url
		));
		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if ($httpcode == 200){
			unset($_SESSION['long_lived_access_token']);
			unset($_SESSION['user_id']);
			unset($_SESSION['username']);
			unset($_SESSION['email']);
			unset($_SESSION['picture']);
			$output['success']="Succesfully disconnected";
		}else{
            $output['error']="Failed to revoke token for given user ($httpcode - $response - token=".substr($_SESSION['long_lived_access_token']->access_token,0,5)."... user: ".$_SESSION['username'];
			unset($_SESSION['long_lived_access_token']);
			unset($_SESSION['user_id']);
			unset($_SESSION['username']);
			unset($_SESSION['email']);
			unset($_SESSION['picture']);
		}
	}
	header('Content-type: application/json');
	echo json_encode( $output );
}else if ($action == "get_subjects"){
	$user=get_value("user");
	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$sQuery = "SELECT * FROM subjects WHERE user='$user';";
	//echo "query: $sQuery ";
	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	while ( $aRow = mysqli_fetch_array( $rResult ) )	{
		$output[$aRow['alias']] = array();
		$output[$aRow['alias']]['id'] = $aRow['id'];
		$output[$aRow['alias']]['user'] = $aRow['user'];
		$output[$aRow['alias']]['name'] = $aRow['name'];
		$output[$aRow['alias']]['alias'] = $aRow['alias'];
		$output[$aRow['alias']]['birthdate'] = $aRow['birthdate'];
		$output[$aRow['alias']]['comments'] = $aRow['comments'];
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

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$sQuery = "INSERT INTO subjects (user, alias, name, birthdate,comments) VALUES ('$user', '$alias', '$name', '$birthdate', '$comments');";
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){
        //header('HTTP/1.1 500 Internal Server Error');die("Error: Exists. ".mysqli_error( $db_connection )." -- ".$sQuery);
        $output["error"]="El sujeto $user ya existe, elija otro nombre.";
    }else{
        $sQuery = "SELECT LAST_INSERT_ID() as lid;";
        $rResult = mysqli_query( $db_connection, $sQuery );
        if(!$rResult){header('HTTP/1.1 500 Internal Server Error');die("Error: ".mysqli_error( $db_connection )." -- ".$sQuery);}
        $aRow = mysqli_fetch_array( $rResult );
        header('Content-type: application/json');
        $output["success"]=$alias;
        $output["data"]=array();
        $output["data"]["id"]=$aRow['lid'];
        $output["data"]["user"]=$user;
        $output["data"]["alias"]=$alias;
        $output["data"]["name"]=$name;
        $output["data"]["birthdate"]=$birthdate;
        $output["data"]["comments"]=$comments;
    }
    echo json_encode( $output );
}else if ($action == "update_subject"){
	$lid=get_value('lid');
	$user=get_value('user');
	$alias=get_value('alias');
	$name=get_value('name');
	$birthdate=get_value('birthdate');
	$comments=get_value('comments');

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	
	$sQuery = "UPDATE subjects  SET name='$name', birthdate='$birthdate',comments='$comments' WHERE id=$lid;";
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){header('HTTP/1.1 500 Internal Server Error');die("Error: Exists. ".mysqli_error( $db_connection )." -- ".$sQuery);}
	header('Content-type: application/json');
	$output["success"]=$alias;
	$output["data"]=array();
	$output["data"]["id"]=$lid;
	$output["data"]["user"]=$user;
	$output["data"]["alias"]=$alias;
	$output["data"]["name"]=$name;
	$output["data"]["birthdate"]=$birthdate;
	$output["data"]["comments"]=$comments;
	echo json_encode( $output );
}else if ($action == "send_session_data"){
	$output["msg"]="success";
	$reference=get_value("reference");
	$user=get_value("user");
	$subject=get_value("subject");
	$age=get_value("age");
	$num_answered=get_value("num_answered");
	$num_correct=get_value("num_correct");
	$result=0;
	if(((int) $num_answered)!=0) $result= ((int) $num_correct) / ((int) $num_answered);
	$level=get_value("level");
	$duration=get_value("duration");
	$timestamp=get_value("timestamp");

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$sQuery = "INSERT INTO sessions(reference,user,subject,age,num_answered,num_correct,result,level,duration,timestamp)  VALUES ('$reference','$user','$subject','$age','$num_answered','$num_correct','$result','$level','$duration','$timestamp');"; 
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){ $output["msg"]=mysqli_error( $db_connection )." -- ".$sQuery; }
	else{ $output["msg"]="Success. Data session stored in the server. --"; }
	//else{$output='{"msg":"Success. Data session stored in the server. -- '.$sQuery.'"}';}	

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "send_session_data_post"){
	$str_json=json_decode($_POST['json_string'],true);
	$output["msg"]="success";
	$type=$str_json["type"];
	$mode=$str_json["mode"];
	$user=$str_json["user"];
	$subject=$str_json["subject"];
	$age=$str_json["age"];
	$num_answered=$str_json["num_answered"];
	$num_correct=$str_json["num_correct"];
	$result=0;
	if(((int) $num_answered)!=0) $result= ((int) $num_correct) / ((int) $num_answered);
	$level=$str_json["level"];
	$duration=$str_json["duration"];
	$timestamp=$str_json["timestamp"];

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$error=0;
	
	$sQuery = "INSERT INTO sessions(type,mode,user,subject,age,num_answered,num_correct,result,level,duration,timestamp)  VALUES ('$type','$mode','$user','$subject','$age','$num_answered','$num_correct','$result','$level','$duration','$timestamp');"; 
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){ $output["msg"]=mysqli_error( $db_connection )." -- ".$sQuery; $error=1;}
	else{ 
		$session_id=mysqli_insert_id($db_connection);
		foreach ($str_json["details"] as $detail){
			$sQuery = "INSERT INTO session_activities(type,mode,user,subject,session,activity,choice,result,level,duration,timestamp)  VALUES ('$type','$mode','$user','$subject','$session_id','".$detail["activity"]."','".$detail["choice"]."','".$detail["result"]."','$level','".$detail["duration"]."','".$detail["timestamp"]."')"; 
			$rResult = mysqli_query( $db_connection, $sQuery );
			if(!$rResult){ $output["msg"]=mysqli_error( $db_connection )." -- ".$sQuery; $error=1; break;}
		}
		if($error==0) $output["msg"]="Success. Data session stored in the server. --"; // -- '.$sQuery.'"}';}
	}


	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "get_results_global"){
	$user=get_value("user");
	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}
	$sQuery = "SELECT subject,type,num_correct,num_answered,result,timestamp FROM (SELECT * FROM `sessions` s WHERE user='$user' ORDER BY s.timestamp DESC) as z  GROUP BY subject, type ORDER BY subject ASC";
	//echo "query: $sQuery ";
	$output['general'] = array();
	$output['general']['user'] = $user;
	$output['elements'] = array();
    $num_elems=0;


	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	while ( $aRow = mysqli_fetch_array( $rResult ) ){
        //!in_array($aRow['subject'],$output['elements'])){
        if (count($output['elements'])==0 || $output['elements'][(count($output['elements'])-1)]['subject']!=$aRow['subject']){
            /*if(count($output['elements'])!=0){
                echo $output['elements'][(count($output['elements'])-1)]['subject']."    ".$aRow['subject']."    ".count($output['elements']);
            }*/
            $output['elements'][]=array();
            $output['elements'][$num_elems]['subject']=$aRow['subject'];
            $output['elements'][$num_elems]['conciencia']="-";
            $output['elements'][$num_elems]['memoria_visual']="-";
            $output['elements'][$num_elems]['ritmo']="-";
            $output['elements'][$num_elems]['velocidad']="-";
            $output['elements'][$num_elems]['discr_visual']="-";
            $output['elements'][$num_elems]['timestamp']="-";
            $num_elems++;
        }
		$output['elements'][($num_elems-1)][$aRow['type']] = $aRow['num_correct']."/".$aRow['num_answered'];
		$output['elements'][($num_elems-1)]['timestamp'] = $aRow['timestamp'];
	}
	header('Content-type: application/json');
	echo json_encode( $output );
}else if ($action == "get_results"){
	$user=get_value("user");
	$subject=get_value("subject");

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$sQuery = "SELECT * FROM sessions WHERE user='$user' AND subject='$subject' ORDER BY timestamp desc;"; // order asc
	//echo "query: $sQuery ";
	$output['general'] = array();
	$output['general']['user'] = $user;
	$output['general']['subject'] = $subject;
	$output['elements'] = array();


	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	$element_count=0;	
	while ( $aRow = mysqli_fetch_array( $rResult ) )	{
		$output['elements'][]=array();
		$output['elements'][$element_count]['id'] = $aRow['id'];
		$output['elements'][$element_count]['type']=$aRow['type'];
		$output['elements'][$element_count]['mode']=$aRow['mode'];
		$output['elements'][$element_count]['age']=$aRow['age'];
		$output['elements'][$element_count]['num_answered']=$aRow['num_answered'];
		$output['elements'][$element_count]['num_correct']=$aRow['num_correct'];
		$output['elements'][$element_count]['result']=$aRow['result'];
		$output['elements'][$element_count]['level']=$aRow['level'];
		$output['elements'][$element_count]['duration']=$aRow['duration'];
		$output['elements'][$element_count]['timestamp']=$aRow['timestamp'];
		$element_count++;		
	}

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "get_result_detail"){
	$session=get_value("session");
	$user=get_value("user");

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject ($user!=".$_SESSION['email'].")";return;}

	$sQuery = "SELECT * FROM session_activities WHERE session='$session' AND user='$user';";
	//echo "query: $sQuery ";
	$output['general'] = array();
	$output['general']['session'] = $session;
	$output['elements'] = array();

	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	$element_count=0;	
	while ( $aRow = mysqli_fetch_array( $rResult ) )	{
		$output['elements'][]=array();
		$output['elements'][$element_count]['id'] = $aRow['id'];
		$output['elements'][$element_count]['type']=$aRow['type'];
		$output['elements'][$element_count]['mode']=$aRow['mode'];
		$output['elements'][$element_count]['user']=$aRow['user'];
		$output['elements'][$element_count]['subject']=$aRow['subject'];
		$output['elements'][$element_count]['activity']=$aRow['activity'];
		$output['elements'][$element_count]['choice']=$aRow['choice'];
		$output['elements'][$element_count]['result']=$aRow['result'];
		$output['elements'][$element_count]['level']=$aRow['level'];
		$output['elements'][$element_count]['duration']=$aRow['duration'];
		$output['elements'][$element_count]['timestamp']=$aRow['timestamp'];
		$element_count++;
	}

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);

}else if ($action == "delete_session"){
	$id=get_value("id");
	$user=get_value("user");
	$subject=get_value("subject");
	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	// create a detailed acction log db so that we can recover actions, authors, dates and previous states
	$sQuery = "DELETE FROM sessions WHERE id='$id' AND subject='$subject' AND user='$user';";

	$rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){ $output["msg"]=mysqli_error( $db_connection )." -- ".$sQuery; }
	else{ $output["msg"]="Success. Session $id of $subject deleted. --"; }	

	header('Content-type: application/json');
	echo json_encode( $output );
	//print_r($output);
}else{
	$output['msg']="unsupported action";
	header('Content-type: application/json');
	echo json_encode( $output );
}

session_write_close(); // OPTIONAL: makes sure session is stored, may be add it as soon as vars are written..., should happen at the end of the script

?>

