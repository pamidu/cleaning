<?php
	
	require_once (ROOT_PATH ."/include/duoapi/authproxy.php");
	require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");
	
	class testClass {
		public $appKey;
		public $functions;
	}

	class FunctionalSegregation {

		public function getAllAppFunctions($appKey)
		{
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"functionalSegregation","123");
			$respond=$client->get()->byKey($appKey);
			//echo $appKey;
			echo json_encode($respond);
		}
		
		public function saveAllAppFunctions()
		{
			$body = Flight::request()->data;
			//var_dump($body);
			$test = new testClass();
			//How to access an attribute within an object
			//var_dump(Flight::request()->data['appKey']);
			
			
			//how to access a array value within an object
			//echo Flight::request()->data['functions'][0]['code'];
			DuoWorldCommon::mapToObject($body,$test);
			//var_dump($test->appKey);
			
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"functionalSegregation","123");
			$respond=$client->store()->byKeyField("appKey")->andStore($test);
			var_dump($respond);
			

		}
		
		public function deleteAllAppFunctions($appKey)
		{

			$body = Flight::request()->data;
			$test = new testClass();
			$test->appKey = $appKey;
			$test->functions = [];

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"functionalSegregation","123");
			$respond=$client->delete()->byKeyField('appKey')->andDelete( $test);
			echo json_encode($respond);
			
		}
		
		
		public function getPermissions($appKey,$userId)
		{
			echo $appKey;
			echo $userId;
		}
		
		public function savePermissions($appkey, $userId)
		{
			$body = Flight::request()->getBody();
			echo $userId;
			echo json_encode($body);
		}
		
		
		
		
		function __construct(){
			
			Flight::route("GET /security/functions/@appKey", function ($appKey){
                try {
                    $this->getAllAppFunctions($appKey);
                }catch(Exception $ex) {
                    echo '{"Success": false, "Message": Error occurred while processing the request.}';
                }
            });
			
			Flight::route('POST /security/functions/@appKey', function($appkey) {
				try{
					$this->saveAllAppFunctions($appkey);
				}catch(Exception $ex){
					echo '{"Success": false, "Message": Error occurred while processing the request.}';
				}
			});
			
			Flight::route('DELETE /security/functions/@appKey', function($appkey) {
				try{
					$this->deleteAllAppFunctions($appkey);
				}catch(Exception $ex){
					echo '{"Success": false, "Message": Error occurred while processing the request.}';
				}
			});
			
			Flight::route("GET /security/functions/@appKey/@userId", function ($appKey,$userId){
                try {
                    $this->getPermissions($appKey,$userId);
                }catch(Exception $ex) {
                    echo '{"Success": false, "Message": Error occurred while processing the request.}';
                }
            });
			
			
			Flight::route('POST /security/functions/@appKey/@userId', function($appkey,$userId) {
				try{
					$this->savePermissions($appkey,$userId);
				}catch(Exception $ex){
					echo '{"Success": false, "Message": Error occurred while processing the request.}';
				}
			});
						
		}
	}
?>
