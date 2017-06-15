<?php 
	$mainDomain="developer.12thdoor.com";
        $authURI="http://localhost:3048/";
        $objURI="http://localhost:3000/";
    	$fullhost=strtolower($_SERVER['HTTP_HOST']);
    	
	define("MAIN_D",$mainDomain );
	define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
	define("APPICON_PATH", "/var/www/html/devportal/appicons");
	define("MEDIA_PATH", "/var/media");
	define ( 'GATEWAYMODE', "Test" ); // Test/Live

	define("STORAGE_PROFILE", "STORAGE-AUTH");
	define("APP_DISABLE_JWT", true);
	
	define("SVC_OS_URL", "http://localhost:3000");
	define("SVC_OS_BULK_URL", "http://localhost:3001/transfer");
	define("SVC_AUTH_URL", "http://localhost:3048");
	define("STRIPE_KEY","");

	define("ENABLE_RATING", true); //rating engine can be enabled or disabled by this line 
 
	define("RATING_ENGINE_REDIS_HOST", "10.128.0.2"); //redls IP address/hostname can be configured in here 

	define ("PAYMENT_GATWAY", "stripe");
	define('CLIENT_ID', 'ca_9pe4HdCJwrmkTZfHXTzOzKewSMurVOJi'); // Client ID of main stripe account
 
	define("SVC_QUEUE_TYPE", "RabbitMQ"); //Queue type can be configured here
	define("SVC_QUEUE_HOST", "172.17.0.8"); //location of the RabbitMQ server can be configured in here
	define("SVC_QUEUE_USERNAME", "guest"); //username for rabbitMQ
	define("SVC_QUEUE_PASSWORD", "guest"); //password for RabbitMQ

?>
