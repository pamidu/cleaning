<?php
 define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
// require_once (ROOT_PATH . '/include/config.php');
// require_once (ROOT_PATH . "/dwcommon.php");
 require_once (ROOT_PATH .'/include/flight/Flight.php');
 require_once (ROOT_PATH .'/include/config.php');
 require_once ("./models/structs.php");
 require_once ("./helpers/directObjectstore.php");
 require_once ('./helpers/dwcommon.php');
 require_once ('./helpers/objectstoreproxy.php');
 require_once ("./tinyurl.php");
 
  
 new tinyurl();
	
 Flight::start();

 header('Access-Control-Allow-Headers: Content-Type');
 header('Access-Control-Allow-Origin: *');
 header('Access-Control-Allow-Methods: GET, POST');  
?>
