<?php
	
	require_once (ROOT_PATH ."/include/duoapi/authproxy.php");
	require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");

	class UserService {
		function getShareUsers(){
			$proxy = new AuthProxy();
			$mappings = $proxy->GetTenantUsers(DuoWorldCommon::GetHost());
			$users = array();
			foreach ($mappings as $mapping){
				$client = ObjectStoreClient::WithNamespace("com.duosoftware.auth","users","123");
				$res = $client->get()->bySearching("UserID:" . $mapping);
				if (!isset($res["IsSuccess"]))
				if (sizeof($res)>0)
					array_push($users, array("EmailAddress"=> $res[0]["EmailAddress"],"Name"=> $res[0]["Name"],"UserID"=> $res[0]["UserID"]));
				
			}


			if (sizeof($users) ==0 ){
				array_push($users, array("EmailAddress"=> "admin@duoweb.info","Name"=> "Administrator","UserID"=> "0"));
				$authData = json_decode($_COOKIE["authData"]);
				if (strcmp($authData->Email, "admin@duoweb.info") != 0)
					array_push($users, array("EmailAddress"=> $authData->Email,"Name"=> $authData->Name,"UserID"=> $authData->UserID));
			}
			echo json_encode($users);
		}

		function __construct(){
			Flight::route("GET /tenant/users", function (){ $this->getShareUsers(); });
		}
	}
?>
