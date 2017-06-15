<?php
	require_once("./duoapi/userproxy.php");


	class Common {

		public static function respondSuccess($obj){
			header( "Content-type:  application/json" );
			echo json_encode($obj);
		}

		public static function respondFail($msg){
			header ( "Content-type:  application/json");
			header ("HTTP/1.1 500 Internal Server Error");
			echo '{"Success":false, "Message":"'. $msg .'"}';
			
		}

		public static function checkAccess($token){
			return (new AuthProxy())->GetAccess($token);
		}
	}
?>