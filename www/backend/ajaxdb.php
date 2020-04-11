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

// ---- IMPORTANT: UPDATE WITH THE REAL PATH TO SECRETS ---------------
$db_credentials = json_decode(file_get_contents("../../../secrets/db_credentials_afan-app.json"));
$gclient_secret = json_decode(file_get_contents("../../../secrets/gclient_secret_afan-app.json"));
// --------------------------------------------------------------------
$default_error['error']='db credentials issue. Bad path in ajaxdb.php?';
$db_connection =  mysqli_connect( $db_credentials->db_server, $db_credentials->user, $db_credentials->pass  ) or die(submit_data($default_error));
mysqli_select_db( $db_connection, $db_credentials->db_name) or die(submit_data($default_error));

/* SET UTF-8 independently of the MySQL and PHP installation */
mysqli_query($db_connection, "SET NAMES 'utf8'");	
mysqli_query($db_connection, "set time_zone:='Europe/Madrid'");	


function submit_data($output){
    if(!isset($_REQUEST['jsoncallback'])){
        // to solve CORS
        if(isset($_REQUEST['allow_null_CORS'])){header("Access-Control-Allow-Origin: null");}
        else{header("Access-Control-Allow-Origin: *");}
        // allow cookie passing in CORS (session maintenance)
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST"); // might want to add , PUT, DELETE, OPTIONS
        header("Access-Control-Allow-Headers: *"); // Important X-Requested-With
        header('Content-type: application/json');
        echo json_encode( $output );
    }else{
        echo $_REQUEST['jsoncallback']."(JSON.parse('".json_encode( $output )."'))";
    }
}


function get_user_dump($user){
    $ret=array();
    // get all subjects
    $ret['subjects']=array();
	$sQuery = "SELECT * FROM subjects WHERE user='$user';";
	$rResult = mysqli_query( $GLOBALS['db_connection'], $sQuery ) or die(mysqli_error( $GLOBALS['db_connection'] ));
	while ( $aRow = mysqli_fetch_array( $rResult ) )	{
		$ret['subjects'][$aRow['alias']] = array();
		$ret['subjects'][$aRow['alias']]['id'] = $aRow['id'];
		$ret['subjects'][$aRow['alias']]['user'] = $aRow['user'];
		$ret['subjects'][$aRow['alias']]['name'] = $aRow['name'];
		$ret['subjects'][$aRow['alias']]['alias'] = $aRow['alias'];
		$ret['subjects'][$aRow['alias']]['birthdate'] = $aRow['birthdate'];
		$ret['subjects'][$aRow['alias']]['genre'] = $aRow['genre'];
		$ret['subjects'][$aRow['alias']]['comments'] = $aRow['comments'];
	}

    // get all results (sessions)
    $ret['subject_results']=array();
	$sQuery = "SELECT * FROM `sessions` WHERE user='$user' ORDER BY timestamp DESC";
	$rResult = mysqli_query( $GLOBALS['db_connection'], $sQuery ) or die(mysqli_error( $GLOBALS['db_connection'] ));
	while ( $aRow = mysqli_fetch_array( $rResult ) ){
        if (!array_key_exists ( $aRow['subject'] , $ret['subject_results'] )){
            $ret['subject_results'][$aRow['subject']]=array();
            $ret['subject_results'][$aRow['subject']]['general']=array();
            $ret['subject_results'][$aRow['subject']]['general']['user']=$user;
            $ret['subject_results'][$aRow['subject']]['general']['subject']=$aRow['subject'];
            $ret['subject_results'][$aRow['subject']]['elements']=array();
        }
        $new_element=array();
		$new_element['id'] = $aRow['id'];
		$new_element['type']=$aRow['type'];
		$new_element['mode']=$aRow['mode'];
		$new_element['age']=$aRow['age'];
		$new_element['num_answered']=$aRow['num_answered'];
		$new_element['num_correct']=$aRow['num_correct'];
		$new_element['result']=$aRow['result'];
		$new_element['level']=$aRow['level'];
		$new_element['duration']=$aRow['duration'];
		$new_element['timestamp']=$aRow['timestamp'];
        $ret['subject_results'][$aRow['subject']]['elements'][]=$new_element;
    }

    // get all details
    $ret['subject_result_details']=array();
	$sQuery = "SELECT * FROM session_activities WHERE user='$user';";
	$rResult = mysqli_query( $GLOBALS['db_connection'], $sQuery ) or die(mysqli_error( $GLOBALS['db_connection'] ));
	$element_count=0;
	while ( $aRow = mysqli_fetch_array( $rResult ) ) {
        if (!array_key_exists ( $aRow['session'] , $ret['subject_result_details'] )){
            $ret['subject_result_details'][$aRow['session']]=array();
            $ret['subject_result_details'][$aRow['session']]['general']=array();
            $ret['subject_result_details'][$aRow['session']]['general']['session']=$aRow['session'];
            $ret['subject_result_details'][$aRow['session']]['elements']=array();
        }
        $new_element=array();
		$new_element['id'] = $aRow['id'];
		$new_element['type']=$aRow['type'];
		$new_element['mode']=$aRow['mode'];
		$new_element['user']=$aRow['user'];
		$new_element['subject']=$aRow['subject'];
		$new_element['activity']=$aRow['activity'];
		$new_element['choice']=$aRow['choice'];
		$new_element['result']=$aRow['result'];
		$new_element['level']=$aRow['level'];
		$new_element['duration']=$aRow['duration'];
		$new_element['timestamp']=$aRow['timestamp'];
        $ret['subject_result_details'][$aRow['session']]['elements'][]=$new_element;
	}

    return $ret;
}

$output=array();
	
if ($action == "get_users"){
	if($_SESSION['access_level']!='admin'){$output['error']="ERROR: no admin";}
    else{
        $sQuery = "SELECT * FROM users";
        //echo "query: $sQuery ";
        $rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
        while ( $aRow = mysqli_fetch_array( $rResult ) )	{
            $output[$aRow['email']] = array();
            $output[$aRow['email']]['email'] = $aRow['email'];
            $output[$aRow['email']]['access_level'] = $aRow['access_level'];
        }
    }
    submit_data($output);
}else if ($action == "gen_session_state"){
	$state = md5(rand());
	$_SESSION["state"]=$state;
	$output['state']=$state;
    //$myfile = fopen("app-access.log", "a") or die("Unable to open file!");
    //$txt = $timestamp_seconds." ".$_SERVER['REMOTE_ADDR']." ".$_SERVER['HTTP_USER_AGENT'];
    //fwrite($myfile, $txt);
    //fclose($myfile); --> it is easier to search in server logs $USER/logs/...
    submit_data($output);
}else if ($action == "login_bypass"){
    $output['error']="";
    $output['info']="bypass";
    unset($_SESSION['long_lived_access_token']);
    unset($_SESSION['user_id']);
    unset($_SESSION['username']);
    unset($_SESSION['email']);
    unset($_SESSION['picture']);
    if ( (get_value("state")) != ($_SESSION["state"]) && get_value("state")!='offline') {
        $output['error']="FAILURE: Forgery attack? Invalid state parameter ".get_value("state")." expected: ".$_SESSION["state"];
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
            $output=get_user_dump($_SESSION['email']);
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
    submit_data($output);
}else if ($action == "login_act_as"){
    $output['error']="";
    $output['info']="act_as";
    unset($_SESSION['long_lived_access_token']);
    unset($_SESSION['user_id']);
    unset($_SESSION['username']);
    unset($_SESSION['email']);
    unset($_SESSION['picture']);
    if ( (get_value("state")) != ($_SESSION["state"]) && get_value("state")!='offline') {
        $output['error']="FAILURE: Forgery attack? Invalid state parameter ".get_value("state")." expected: ".$_SESSION["state"];
    }else{
        $user = $_REQUEST['user'];
        $sQuery = "SELECT * FROM users WHERE email='".$user."'";
        $rResult = mysqli_query( $db_connection, $sQuery ) or die(mysqli_error( $db_connection ));
        if ( $aRow = mysqli_fetch_array( $rResult ) ){ //existing user
            //$_SESSION['access_level'] = $aRow['access_level']; do not update this or won't be able to get back
			$_SESSION['user_id'] = $user;
			$_SESSION['display_name'] = "acting as ".$aRow['display_name'];
			$_SESSION['picture'] = $aRow['picture'];
			$_SESSION['email'] = $user;
            $sQuery = "UPDATE users  SET last_login='$timestamp_seconds',last_provider='act_as' WHERE email='".$_SESSION['email']."';";
            $rResult = mysqli_query( $db_connection, $sQuery );
            if(!$rResult){$output['error']="Error: ".mysqli_error( $db_connection )." -- ".$sQuery;}
            $output=get_user_dump($_SESSION['email']);
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
    submit_data($output);
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
                    $output=get_user_dump($_SESSION['email']);
                }else if(!empty($_SESSION['email'])){ //new user
                    $_SESSION['access_level'] = 'normal'; //invitee
                    $mail_headers= 'MIME-Version: 1.0' . "\r\n" . 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                    //$mail_headers.= 'From: CoLE <montsedeayala@gmail.com>' . "\r\n";
                    mail("hectorlm1983@gmail.com","New CoLE user","NEW USER: ".$_SESSION['email'].". DELETE if needed",$mail_headers);
                    mail($_SESSION['email'],"Bienvenido a CoLE!","Estimad@ ".$_SESSION['email'].",<br /><br />Ya puede usar la aplicación CoLE con todas sus funcionalidades.<br /><br />Atentamente,<br />Equipo de CoLE",$mail_headers);
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
    submit_data($output);
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
    submit_data($output);
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
		$output[$aRow['alias']]['genre'] = $aRow['genre'];
		$output[$aRow['alias']]['comments'] = $aRow['comments'];
	}

    submit_data($output);
	//print_r($output);

}else if ($action == "add_subject"){
	$user=get_value('user');
	$alias=get_value('alias');
	$name=get_value('name');
	$birthdate=get_value('birthdate');
	$genre=get_value('genre');
	$comments=get_value('comments');

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	$sQuery = "INSERT INTO subjects (user, alias, name, birthdate, genre, comments) VALUES ('$user', '$alias', '$name', '$birthdate', '$genre', '$comments');";
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){
        //header('HTTP/1.1 500 Internal Server Error');die("Error: Exists. ".mysqli_error( $db_connection )." -- ".$sQuery);
        $output["error"]="El sujeto $user ya existe, elija otro nombre.";
    }else{
        $sQuery = "SELECT LAST_INSERT_ID() as lid;";
        $rResult = mysqli_query( $db_connection, $sQuery );
        if(!$rResult){header('HTTP/1.1 500 Internal Server Error');die("Error: ".mysqli_error( $db_connection )." -- ".$sQuery);}
        $aRow = mysqli_fetch_array( $rResult );
        $output["success"]=$alias;
        $output["data"]=array();
        $output["data"]["id"]=$aRow['lid'];
        $output["data"]["user"]=$user;
        $output["data"]["alias"]=$alias;
        $output["data"]["name"]=$name;
        $output["data"]["birthdate"]=$birthdate;
        $output["data"]["genre"]=$genre;
        $output["data"]["comments"]=$comments;
    }
    submit_data($output);
}else if ($action == "update_subject"){
	$lid=get_value('lid');
	$user=get_value('user');
	$alias=get_value('alias');
	$name=get_value('name');
	$birthdate=get_value('birthdate');
	$genre=get_value('genre');
	$comments=get_value('comments');

	if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

	
	$sQuery = "UPDATE subjects  SET name='$name', birthdate='$birthdate', genre='$genre',comments='$comments' WHERE id=$lid;";
	$rResult = mysqli_query( $db_connection, $sQuery );
	if(!$rResult){header('HTTP/1.1 500 Internal Server Error');die("Error: Exists. ".mysqli_error( $db_connection )." -- ".$sQuery);}
	$output["success"]=$alias;
	$output["data"]=array();
	$output["data"]["id"]=$lid;
	$output["data"]["user"]=$user;
	$output["data"]["alias"]=$alias;
	$output["data"]["name"]=$name;
	$output["data"]["birthdate"]=$birthdate;
	$output["data"]["genre"]=$genre;
	$output["data"]["comments"]=$comments;
    submit_data($output);
}else if ($action == "send_sessions_data_post"){
	$str_json_arr=json_decode($_POST['json_string'],true);
	$output["msg"]="success";
    foreach ($str_json_arr as $str_json) {
        $type=$str_json["type"];
        $mode=$str_json["mode"];
        $user=$str_json["user"];
        $subject=$str_json["subject"];
        $age=$str_json["age"];
        $num_answered=$str_json["num_answered"];
        $num_correct=round((double) $str_json["num_correct"],2);
        $result=0;
        if(((int) $num_answered)!=0) $result= round(((int) $num_correct) / ((int) $num_answered), 2);
        $level=$str_json["level"];
        $duration=$str_json["duration"];
        $timestamp=$str_json["timestamp"];

        if($_SESSION['access_level']!='admin' && $user!=$_SESSION['email']){echo "ERROR: no admin or owner of subject";return;}

        $error=0;
        
        if($mode=="test"){
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
        }else{
            $sQuery = "INSERT INTO sessions_train(type,mode,user,subject,age,num_answered,num_correct,result,level,duration,timestamp)  VALUES ('$type','$mode','$user','$subject','$age','$num_answered','$num_correct','$result','$level','$duration','$timestamp');"; 
            $rResult = mysqli_query( $db_connection, $sQuery );
            if(!$rResult){ $output["msg"]=mysqli_error( $db_connection )." -- ".$sQuery; $error=1;}
        }
        if($error==1) break;
    }
    if($error==0) $output["msg"]="Success. ".count($str_json_arr)." sessions stored in the server. --";
    submit_data($output);
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

    submit_data($output);
	//print_r($output);
}else{
	$output['msg']="unsupported action";
    submit_data($output);
}

session_write_close(); // OPTIONAL: makes sure session is stored, may be add it as soon as vars are written..., should happen at the end of the script

?>

