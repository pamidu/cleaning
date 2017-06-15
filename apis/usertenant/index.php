<?php
	ini_set('xdebug.var_display_max_depth', 5);
	ini_set('xdebug.var_display_max_children', 256);
	ini_set('xdebug.var_display_max_data', 1024);	

    if(strpos($_SERVER["REQUEST_URI"], "/request/accept/") !== false) 
        define ("SKIP_AUTH", true);

    //prevent service to be accessed without a security token. the security token must be included with the cookies.
    define("AUTH_FAIL_RESPONSE_JSON", true);

 	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
	require_once(ROOT_PATH . "/dwcommon.php");
 	require_once (ROOT_PATH .'/include/flight/Flight.php');
	require_once ("./tenantservice.php");

	new TenantService();
 	Flight::start();

	header('Access-Control-Allow-Headers: Content-Type');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');  
?>
