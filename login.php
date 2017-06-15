<?php 
session_start();
include ("include/config.php");
include ("include/session.php");
$error='';

//$_POST = json_decode(file_get_contents('php://input'), true);

	// var_dump($_COOKIE['securityToken']);
if (isset($_GET["r"])){

	$_SESSION['r']=$_GET["r"];
}

if(isset($_COOKIE['securityToken']))
{
	if(isset($_SESSION['r']))
	{
		header("Location: ".$_SESSION['r']."?securityToken=".$_COOKIE["securityToken"]);
		session_unset('r');
		exit();
	}
	else
	{
		header("location: /");	
		exit();
	}

}

if (isset($_POST['userName']) && isset($_POST['password'])) {
	if (empty($_POST['userName']) || empty($_POST['password'])) {
		echo '{"Status":false,"Message":"Email and Password is missing."}';
		exit();
	}		
	else
	{
		$username=$_POST['userName'];
		$password=$_POST['password'];
		$fullhost=strtolower($_SERVER['HTTP_HOST']);
		$baseUrl=$authURI."/Login/".$username."/".$password."/".$fullhost;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data=curl_exec($ch);
		$authObject = json_decode($data);
		curl_close($ch);

		if(isset($authObject))
		{	
			if(isset($authObject->SecurityToken)){
				setcookie('securityToken',$authObject->SecurityToken,time()+86400);
				setcookie('authData',json_encode($authObject),time()+86400);
				$_SESSION['securityToken']=$authObject->SecurityToken;
				$_SESSION['userObject']=$authObject;

				if(isset($_SESSION['r']))
				{
					header("Location: ".$_SESSION['r']."?securityToken=".$_SESSION["securityToken"]);
					session_unset('r');

					exit();
				}
				else
				{
					header("location: index.php");	
				}
			}
			var_dump($authObject);
			exit();
		}
		else{
			echo '{"Status":false,"Message":"Invalid email or password. Please try again with correct credentials."}';
		
			exit();
		}		
	}
}

if(!isset($_COOKIE['securityToken']))
{

		header("location: /platformentry/#/signin");	
		exit();
}

?>


