<?php
	error_reporting (E_ALL);
	ini_set ('display_errors', 1); 
	
	header ('Access-Control-Allow-Origin: *');
	header ("Access-Control-Allow-Credentials: true");

	ini_set ('xdebug.var_display_max_depth', 5);
	ini_set ('xdebug.var_display_max_children', 256);
	ini_set ('xdebug.var_display_max_data', 1024);	

 	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
	define ("AUTH_FAIL_RESPONSE_JSON",true);
  	require_once (ROOT_PATH . "/dwcommon.php");
	require_once (ROOT_PATH .'/include/flight/Flight.php');

 	define ("MAIN_DOMAIN", $mainDomain);
	require_once ("./d.php");
	new PlanService();

 	Flight::start();
?>
