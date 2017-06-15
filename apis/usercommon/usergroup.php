<?php
	
	require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");
	require_once (ROOT_PATH ."/payapi/duoapi/tenantapiproxy.php");
	
	class user{
		public $groupId;
		public $groupname;
		public $users;
		public $parentId;
		public $active;
		
		public function __construct(){
			$this->users = array();
		}
	}

	class Usergroup {

		public function test(){
			echo "Hello World!!!";
		}
		public function addUserGroup(){

			$usergroup=new user();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$usergroup);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$usergroup->active=true;
			$respond=$client->store()->byKeyField("groupId")->andStore($usergroup);
			//var_dump($respond);
			 echo json_encode($respond);

		}
		public function addUserToGroup(){
		$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($post->groupId);
			//var_dump($respond->users);
			if(empty($respond)){
				header('Content-Type: application/json');
				echo json_encode('{"issucces":"false","reason":"please add user group first"}');
			}else{
				foreach ($post->users as $user) {
					// echo "$respond";
					// echo $respond[0];
					array_push($respond->users,$user);
				}
				$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
				echo json_encode($Inrespond);
			}
		}

		public function getUserFromGroup($groupId){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($groupId);
			echo json_encode($respond->users);
			
			
		}

		public function getGroupsFromUser($userId){
			//$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byFiltering($userId);
			echo json_encode($respond);
			
		}

		public function removeUserFromGroup(){
			$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($post->groupId);
			echo json_encode(sizeof($post->users));
			// var_dump($post->users);
			echo json_encode(empty($post->users));
			if(!empty($post->users)){
				foreach ($post->users as $rmUser ) {
					echo json_encode($rmUser);
					if(($key = array_search($rmUser,$respond->users)) !== false) {
    					$k = array_search($rmUser, $respond->users);
    				if($k==0){
    					array_splice($respond->users, $k, 1);
    				}
    				else{
    					array_splice($respond->users, $k, $k);
    				}
    				$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
    				
					}			
					else{
						//echo json_encode("user not  found...");
					}
				}

			}
			echo json_encode($Inrespond);


		}
		public function removeUserGroup($groupId){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($groupId);
			$respond->active=false;
			$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
			echo json_encode($Inrespond);
		
		}
		public function getAllGroups(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->andSearch("active:" . true);
			echo json_encode($respond);

		}

		private function getSharableObjects(){
			$authData = json_decode($_COOKIE["authData"]);
			$proxy = new TenantProxy($authData->SecurityToken);
			$mappings = $proxy->GetTenantUsers(DuoWorldCommon::GetHost());
			
			$users = array();

			$inStr = "";
			$isFirst = true;
			foreach ($mappings as $mapping){
				if ($isFirst) $isFirst = false;
				else $inStr .=",";

				$inStr .= "'$mapping'";
			}

			$client = ObjectStoreClient::WithNamespace("com.duosoftware.auth","users","123");
			$query = "select * from users where UserID in (" . $inStr . ")";
			$allTenantUsers = $client->get()->byFiltering($query);

			if (sizeof($allTenantUsers) ==0){
				array_push($users, array("Id"=> "admin@duoweb.info","Name"=> "Administrator","UserID"=> "0", "Type"=>"User"));
				$authData = json_decode($_COOKIE["authData"]);
				if (strcmp($authData->Email, "admin@duoweb.info") != 0)
					array_push($users, array("Id"=> $authData->Email,"Name"=> $authData->Name,"UserID"=> $authData->UserID, "Type"=>"User"));
			} else {
				foreach ($allTenantUsers as $user)
					array_push($users, array("Id"=> $user["EmailAddress"],"Name"=> $user["Name"],"UserID"=> $user["UserID"], "Type"=>"User"));
			}

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$allGroups = $client->get()->andSearch("active:" . true);

			if (sizeof($allGroups) !=0) {
				foreach ($allGroups as $group)
					if (isset($group["groupId"]) && isset($group["active"]))
						if ($group["active"] === true)
							array_push($users, array("Id"=> $group["groupId"],"Name"=> (isset($group["groupname"])? $group["groupname"] : ""),"UserID"=> $group["groupId"], "Type"=>"Group"));
			}

			echo json_encode($users);
		}

		private function saveUiShareData($appKey){
			$post=json_decode(Flight::request()->getBody());

			$uiState = new stdClass();
			$uiState->appKey = $appKey;
			$uiState->shares = $post;

			$canShare  = false;
			$canUnshare = false;
			
			//"[{"name":"Lasitha Senanayake","email":"lasitha.senanayake@gmail.com","image":"img/user.png","_lowername":"lasitha senanayake","$$hashKey":"object:66"}]"
			
			$addShareUrl;
			$removeShareUrl;
			if (defined("SVC_MEDIA_URL")){
				$addShareUrl = "http://" . SVC_MEDIA_URL . "/apps/$appKey?share=";
				$removeShareUrl = "http://" . SVC_MEDIA_URL . "/apps/$appKey?unshare=";
			}else{
				/*
				$addShareUrl = "http://" . $_SERVER["HTTP_HOST"] . "/apps/$appKey?share=";
				$removeShareUrl = "http://" . $_SERVER["HTTP_HOST"] . "/apps/$appKey?unshare=";				
				*/
				$addShareUrl = "http://localhost/apps/$appKey?share=";
				$removeShareUrl = "http://localhost/apps/$appKey?unshare=";				
			}

			$previousShares = new stdClass();
			$tmpShares = $this->getUserShares($appKey);	
			if (!isset($tmpShares) || !is_array($tmpShares))
				$previousShares->shares = [];
			else 
				$previousShares->shares = $tmpShares;

			$isFirst = true;
			foreach ($uiState->shares as $share)
			{
				$isFound = false;
				foreach ($previousShares->shares as $pShare)
					if (strcmp($pShare->id, $share->id) === 0){
						$isFound = true;
						break;
					}

				if (!$isFound){
					if ($isFirst) $isFirst = false;
					else $addShareUrl .= ",";

					//$addShareUrl .= "$share->type:$share->id";
					$addShareUrl .= "$share->id";
					$canShare = true;
				}
					
			}

			$isFirst = true;
			foreach ($previousShares->shares as $share)
			{
				$isFound = false;
				foreach ($uiState->shares as $pShare)
					if (strcmp($pShare->id, $share->id) === 0){
						$isFound = true;
						break;
					}

				if (!$isFound){
					if ($isFirst) $isFirst = false;
					else $removeShareUrl .= ",";

					//$removeShareUrl .= "$share->type:$share->id";
					$removeShareUrl .= "$share->id";
					$canUnshare = true;
				}
					
			}

			if ($this->callShareUrl($addShareUrl, $canShare)){
				if ($this->callShareUrl($removeShareUrl, $canUnshare)){
					$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"SettingAppShares","123");
					$respond=$client->store()->byKeyField("appKey")->andStore($uiState);

					if (isset($respond->IsSuccess)){
						if ($respond->IsSuccess)
							echo '{"success" : true, "message" : "user/group sharing/unsharing successfule"}';
						else
							echo '{"success" : false, "message" : "error saving ui state in object store"}';	
					}else
						echo '{"success" : false, "message" : "error saving ui state in object store"}';	
				}else{
					echo '{"success" : false, "message" : "error sharing apps to selected groups/users"}';	
				}
			}else{
				echo '{"success" : false, "message" : "error sharing apps to selected groups/users"}';
			}
		}

		private function callShareUrl($url, $isValid){

			if (!isset($isValid))
				return true;

			if (!$isValid)
				return true;

			$cookies = array();
			foreach ($_COOKIE as $key => $value)
			    if ($key != 'Array')
			        $cookies[] = $key . '=' . $value;
	
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_COOKIE, implode(';', $cookies));
			curl_setopt($ch, CURLOPT_HTTPGET,true);
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_HTTPHEADER,  array('Host: '. DuoWorldCommon::GetHost(), 'Content-Type: application/json' ));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$result = curl_exec($ch);
			return json_decode($result);
		}

		private function loadUiShareData($appKey){
			$shares = $this->getUserShares($appKey);
			echo json_encode($shares);
		}		

		private function getUserShares($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"SettingAppShares","123");
			$data=$client->get()->byKey($appKey);
			$shares;

			if (is_object($data)){
				if (isset($data->IsSuccess))
					$shares = new stdClass();
				else
					$shares = $data->shares;
			}
			
			if (!isset($shares))
				$shares = array();

			return $shares;
		}

		private function canSafeDeleteUser($userName){
			$response = $this->scanGroupsAndApps(true,$userName);
			header ("Content-type: application/json");
			echo (json_encode($response));
		}

		private function updateSharedAppsAndGroups($userName){
			$response = $this->scanGroupsAndApps(false,$userName);
			header ("Content-type: application/json");
			echo (json_encode($response));
		}

		private function scanGroupsAndApps($isReportMode,$userName){
			$response = new stdClass();
			$response->success = true;
			$response->message = "";

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"SettingAppShares","123");
			$allApps=$client->get()->all();

			$shareList = array();
			$groupList = array();

			foreach ($allApps as $app){
				if (isset($app["shares"]))
				foreach ($app["shares"] as $share)
				if (strcmp($share["id"],$userName) == 0){
					if ($isReportMode){
						$response->success = false;
						array_push($shareList, $app["appKey"]);
					}else{
						$index;
						for ($i=0;$i<sizeof($app["shares"]);$i++)
						if (strcmp($app["shares"][$i]["id"],$userName)==0){
						$index =$i;
						break;
					}
						if(isset($index)){
							unset($app["shares"][$index]);
							$appObj = new stdClass();
							$appObj->appKey = $app["appKey"];
                            $appObj->shares = array(); 
                            for ($i=0;$i<=sizeof($app["shares"]);$i++)
                            if (isset($app["shares"][$i]))
                                    array_push($appObj->shares, $app["shares"][$i]);
							$client->store()->byKeyField("appKey")->andStore($appObj);
						}
					}
					break;
				}
			}

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$allGroups=$client->get()->andSearch("active:" . true);

			foreach ($allGroups as $group){
				if (isset($group["users"]))
				foreach($group["users"] as $gUser)
				if (strcmp($gUser,$userName) == 0){
					if ($isReportMode){
						$response->success = false;
						array_push($groupList, $group["groupname"]);
					}else{
						$index;
						if (is_array($group["users"]))
						for ($i=0;$i<sizeof($group["users"]);$i++)
						if (isset($group["users"][$i]))
						if (strcmp($group["users"][$i],$userName)==0){
							$index =$i;
							break;
						}
						
						if(isset($index)){
							unset($group["users"][$index]);

							$userObj = new stdClass();
							$userObj->active = $group["active"];
							$userObj->groupId = $group["groupId"];
							$userObj->groupname = $group["groupname"];
							$userObj->parentId = $group["parentId"];        
							$userObj->users = array();
							foreach ($group["users"] as $tUser){array_push($userObj->users,$tUser);}
							$client->store()->byKeyField("groupId")->andStore($userObj);
						}
					}
					break;
				}
			}



			if ($isReportMode){
				if ($response->success)
					$response->message = "User is not in a group or not shared to any app";
				else {
					$response->message = "User is already belongs to a group or shared to an app";
					$response->apps = $shareList;
					$response->groups - $groupList;
				}
			}else{
				$response->message = "Users and groups successfully updated!!!";
			}
			return $response;
		}


		function __construct(){
			Flight::route("GET /", function (){$this->test();});
			Flight::route("POST /addUserGroup", function (){$this->addUserGroup();});
			Flight::route("POST /addUserToGroup", function (){$this->addUserToGroup();});
			Flight::route("GET /getUserFromGroup/@groupId", function ($groupId){$this->getUserFromGroup($groupId);});
			Flight::route("GET /getGroupsFromUser/@userId", function ($userId){$this->getGroupsFromUser($userId);});
			Flight::route("POST /removeUserFromGroup", function (){$this->removeUserFromGroup();});
			Flight::route("GET /removeUserGroup/@groupId", function ($groupId){$this->removeUserGroup($groupId);});
			Flight::route("GET /getAllGroups/", function (){$this->getAllGroups();});

			Flight::route("GET /getSharableObjects/", function (){$this->getSharableObjects();});
			Flight::route("POST /saveUiShareData/@appKey", function ($appKey){$this->saveUiShareData($appKey);});
			Flight::route("GET /loadUiShareData/@appKey", function ($appKey){$this->loadUiShareData($appKey);});

			Flight::route("GET /getSharableObjects/", function (){$this->getSharableObjects();});
			
			Flight::route("GET /canSafeDeleteUser/@userName", function ($userName){$this->canSafeDeleteUser($userName);});
			Flight::route("GET /updateSharedAppsAndGroups/@userName", function ($userName){$this->updateSharedAppsAndGroups($userName);});
		}
	}
?>
