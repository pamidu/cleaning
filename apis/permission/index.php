<?php
	error_reporting (E_ALL);
	ini_set ('display_errors', 1); 
	
	header ('Access-Control-Allow-Origin: *');
	header ("Access-Control-Allow-Credentials: true");

	ini_set ('xdebug.var_display_max_depth', 5);
	ini_set ('xdebug.var_display_max_children', 256);
	ini_set ('xdebug.var_display_max_data', 1024);	

 	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
 	define ("SKIP_AUTH",true);
	require_once (ROOT_PATH . "/dwcommon.php");
	define ("AUTH_FAIL_RESPONSE_JSON",true);
 	require_once (ROOT_PATH .'/include/flight/Flight.php');

	$doc = $_SERVER ['DOCUMENT_ROOT'];
	define ( 'HELPERS', $doc . '/services/helpers/' );
	define ( 'DB_URL', SVC_OS_URL );

	require_once(HELPERS."/ObjectStoreClient.php");
    	require_once(HELPERS."/DbMethods.php");

 	define ("MAIN_DOMAIN", $mainDomain);
	require_once ("./permissionservice.php");
	new PermissionService ();

 	Flight::start();
?>
