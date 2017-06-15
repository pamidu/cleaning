<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");
	class TestService {
		public function test(){
			echo "Works!!!22";
		}

		function __construct(){
			Flight::route("GET /test", function (){$this->test();});
		}
	}
?>
