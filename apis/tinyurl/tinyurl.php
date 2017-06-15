<?php
class tinyurl {
		private function About(){
			$arr = array('Name' => "Twelth Door URL Shortening Service", 'REST Type' => "POST", 'URL' => "/tinyurl/create", 'Body' => '{ URL : Enter_URL_Here }', 'Response Sample' => "{ TinyURL : Converted_URL_Returned }");
			echo json_encode($arr);
		}

		private function Create(){
			$body = Flight::request()->getBody();
			$data = new TinyUrlRequest();
			$data = json_decode($body);

  		 	$client = ObjectStoreClient::WithNamespace("com.tinyurls.com","urlstore","ignore");
  		 	$obj = new TinyUrlData();

  		 	$md5Key = md5($data->URL);
  		 	$obj->UrlID = $md5Key;
  		 	$obj->FullUrl = $data->URL;
  		 	$obj->TinyUrl = $_SERVER['HTTP_HOST']."/tinyurl/".$md5Key;
  	 	 	$resultArray = $client->store ()->byKeyField("UrlID")->andStore($obj);
  	 	 	
  	 	 	if ($resultArray->IsSuccess == TRUE){
  	 	 		$arr = array('TinyURL' => $_SERVER['HTTP_HOST']."/tinyurl/".$md5Key);
				echo json_encode($arr);
  	 	 	}else{
  	 	 		$arr = array('TinyURL' => "ERROR");
				echo json_encode($arr);
  	 	 	}
		}

		private function ExecuteURL($urlKey){
			$client = ObjectStoreClient::WithNamespace("com.tinyurls.com","urlstore","ignore");
  		 	$resultArray = $client->get()->byKey($urlKey);

  		 	if (empty ( $resultArray )) {
  		 		echo('No such URL found in URL Store.');
			}else{
				header("Location: ".$resultArray->FullUrl);
				die();
			}
		}
	
		function __construct(){
			Flight::route("GET /", function (){$this->About();});
			Flight::route("POST /create", function (){$this->Create();});
			 Flight::route("GET /@urlKey", function ($urlKey){
				$this->ExecuteURL($urlKey);
            });
		}
	}
?>
