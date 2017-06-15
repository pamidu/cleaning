<?php
	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
	define("MAIN_DOMAIN", $GLOBALS["mainDomain"]);

	class AppInstaller {
		public function Install($appCode, $tenant){
			$url = "http://localhost/apps/$appCode?install=" . $tenant;
		    	$ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: ". MAIN_DOMAIN, "AppKey: $appCode")); 
			curl_setopt($ch, CURLOPT_COOKIE, "securityToken=" . $_COOKIE["securityToken"] . "; authData=". $_COOKIE["authData"]);
		    curl_setopt($ch, CURLOPT_URL, $url);
		    $data = curl_exec($ch);
		    curl_close($ch);
		}
	}
?>
