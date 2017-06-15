<?php


require_once "PHPExcel.php";
	class Template{
		public $TemplateID;
		public $Title;
		public $Owner;
		public $Body;

	}
	class Templatemeta{
		public $TemplateID;
		public $description;
		public $param;


	}
	
	class templateService {

		private function test(){
			echo "Hello from template service V 1.0.0";
		}
		private function setTemplate(){
			$template=new Template();
			DuoWorldCommon::mapToObject(Flight::request()->data,$template);

			$temp=$template->Body;
			$template->Body=str_replace('"','\"',str_replace(">","\u003e" , str_replace("<", "\u003c", $temp)));
			//echo str_replace('"','\"',str_replace(">","\u003e" , str_replace("<", "\u003c", $temp)));
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey($template->TemplateID);
			//echo json_encode($template);
			if(empty($respond)){
				header('Content-Type: application/json');
				echo '{"success":false,"reason":"template meta data not found  "}';

			}else{
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
				$res=$client->get()->bykey($template->TemplateID);
				if(empty($res)){
					$storeRespond=$client->store()->byKeyField("TemplateID")->andStore($template);
					//echo json_encode($storeRespond);
					if($storeRespond->IsSuccess){
						header('Content-Type: application/json');
					 	echo '{"success":true,"reason":"Stored successfully  "}';
					}else{
						header('Content-Type: application/json');
					 	echo '{"success":false,"reason":"Store faile  "}';
					}
				}else{
					header('Content-Type: application/json');
					echo '{"success":false,"reason":"template id Already available"}';

				}

			}


		} 
		private function setTemplaterichtext(){
			$template=new Template();
			DuoWorldCommon::mapToObject(Flight::request()->data,$template);
			$emailbody='<!DOCTYPE html><html><head><title></title><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">body{background- color:ffffff;background-repeat:no-repeat;background-position:top left;background- attachment:fixed;}h1{font-family:Arial;color:000000;background-color:CCFFFF;}p{font- family:Arial;font-size:14px;font-style:normal;font- weight:normal;color:000000;}</style>
				</head><body>
				<h1>'.$template->Title.'</h1><p>'.$template->Body.'<br/>Duo World Team</p></body></html>';
			$temp=$emailbody;
			$template->Body=str_replace('"','\"',str_replace(">","\u003e" , str_replace("<", "\u003c", $temp)));
			//echo str_replace('"','\"',str_replace(">","\u003e" , str_replace("<", "\u003c", $temp)));
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey($template->TemplateID);
			//echo json_encode($template);
			if(empty($respond)){
				header('Content-Type: application/json');
				echo '{"success":false,"reason":"template meta data not found  "}';

			}else{
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
				$res=$client->get()->bykey($template->TemplateID);
				if(empty($res)){
					//echo json_encode($template);
					$storeRespond=$client->store()->byKeyField("TemplateID")->andStore($template);
					//echo json_encode($storeRespond);
					if($storeRespond->IsSuccess){
						header('Content-Type: application/json');
					 	echo '{"success":true,"reason":"Stored successfully  "}';
					}else{
						header('Content-Type: application/json');
					 	echo '{"success":false,"reason":"Store faile  "}';
					}
				}else{
					header('Content-Type: application/json');
					echo '{"success":false,"reason":"template id Already available"}';

				}

			}


		} 
		private function setTemplateMeta(){
			//echo "string";
			$Tmeta=new Templatemeta();
			DuoWorldCommon::mapToObject(Flight::request()->data,$Tmeta);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey($Tmeta->TemplateID);
			//echo json_encode(empty($respond));
			if(empty($respond)){
				$storeRespond=$client->store()->byKeyField("TemplateID")->andStore($Tmeta);
				if($storeRespond->IsSuccess){
					 header('Content-Type: application/json');
					 echo '{"success":true,"reason":"Stored successfully  "}';
				}else{
					header('Content-Type: application/json');
					 echo '{"success":false,"reason":"Store faile  "}';
				}
			}else{
				header('Content-Type: application/json');
				echo '{"success":false,"reason":"template id Already available"}';
			}

		}
		private function updateTemplate(){
			$template=new Template();
			DuoWorldCommon::mapToObject(Flight::request()->data,$template);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
			$res=$client->get()->bykey($template->TemplateID);
			if(empty($res)){
				header('Content-Type: application/json');
				echo '{"success":false,"reason":"template not found "}';
				
			}else{
				$storeRespond=$client->store()->byKeyField("TemplateID")->andStore($template);
				if($storeRespond->IsSuccess){
					header('Content-Type: application/json');
					echo '{"success":true,"reason":"Stored successfully  "}';
				}else{
					header('Content-Type: application/json');
					echo '{"success":false,"reason":"Store faile  "}';
				}
					

			}


		} 
		private function updateTemplateMeta(){
			$Tmeta=new Templatemeta();
			DuoWorldCommon::mapToObject(Flight::request()->data,$Tmeta);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey($Tmeta->TemplateID);
			if(empty($respond)){
				header('Content-Type: application/json');
				echo '{"success":false,"reason":"template not found "}';
				
			}else{
				$storeRespond=$client->store()->byKeyField("TemplateID")->andStore($Tmeta);
				if($storeRespond->IsSuccess){
					 header('Content-Type: application/json');
					 echo '{"success":true,"reason":"Stored successfully  "}';
				}else{
					header('Content-Type: application/json');
					 echo '{"success":false,"reason":"Store faile  "}';
				}
				
			}

		}
		private function getTemplate($TemplateID){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
			$respond=$client->get()->bykey($TemplateID);
			header('Content-Type: application/json');
			echo json_encode($respond);

		}
		private function getTemplateMeta($TemplateID){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey($TemplateID);
			header('Content-Type: application/json');
			echo json_encode($respond);

		}
		private function getAllTemplate(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
			$respond=$client->get()->all();
			header('Content-Type: application/json');
			echo json_encode($respond);
		}
		private function getAllTemplateMeta(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->all();
			header('Content-Type: application/json');
			echo json_encode($respond);
		}
		private function searchTemplateMeta($searchstring){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$res=$client->get()->andSearch("*".$searchString."*");
			echo json_encode($res);
		}
		private function searchTemplate($searchstring){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templates","123");
			$res=$client->get()->andSearch("*".$searchString."*");
			echo json_encode($res);
		}
		private function bulkTemplate(){
			$fileName = Flight::request()->data->file;
			$excelReader = PHPExcel_IOFactory::createReaderForFile($fileName);
			$excelReader->setLoadAllSheets();
			$excelObj = $excelReader->load($fileName);

			$worksheetNames = $excelObj->getSheetNames($fileName);
			$DatainSheets = array();
			foreach($worksheetNames as $key => $sheetName){
			//set the current active worksheet by name
			$excelObj->setActiveSheetIndexByName($sheetName);
			//create an assoc array with the sheet name as key and the sheet contents array as value
			$DatainSheets[$sheetName] = $excelObj->getActiveSheet()->toArray(null, true,true,true);
			}
			$emailsarray=array();

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$templatedata=$client->get()->bykey(Flight::request()->data->TemplateID);
			$classList=$templatedata->classes;
			 //var_dump($classList);
			foreach ($classList as  $clas) {
				echo "$clas";
				# code...
			}
			//show the final array
			//printf(var_dump($DatainSheets));
			// echo json_encode($DatainSheets);
			foreach ($DatainSheets as $sheets) {
				foreach ($sheets as $email) {
					foreach ($email as $data) {
						$namespace=str_replace(".","",str_replace("@", "", $data)).".space.test.12thdoor.com";
						array_push($emailsarray,$namespace);
						foreach ($classList as  $clas) {
							$client = ObjectStoreClient::WithNamespace($namespace,$clas,"123");
							$respond=$client->get()->all();//andSearch('"EMAIL":"'.$data.'"');
							echo "*******************\n";
							echo str_replace(".","",str_replace("@", "", $data)).".space.test.12thdoor.com";
							echo str_replace(".","",str_replace("@", "", $data)).".space.test.12thdoor.com";
							echo json_encode($respond);
							echo "\n*******************\n";
						}
					}
				}
			}

			//echo json_encode($emailsarray);

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"templatemeta","123");
			$respond=$client->get()->bykey(Flight::request()->data->TemplateID);

			$client = ObjectStoreClient::WithNamespace("thinuk123gmailcom.space.test.12thdoor.com","invoice12thdoor","123");
														
			$respond=$client->get()->all();//andSearch("EMAIL:user4@gmail.com");
			echo json_encode($respond);






			// $excelObj->getActiveSheet()->toArray(null, true,true,true);
			// $data = $excelObj->getActiveSheet()->toArray(null, true,true,true);
			// var_dump($data);
			
		}



		

		function __construct(){
			Flight::route("GET /",function(){$this->test();});	
			Flight::route("POST /setTemplate",function(){$this->setTemplate();});	
			Flight::route("POST /setTemplaterichtext",function(){$this->setTemplaterichtext();});	
			Flight::route("POST /setTemplateMeta",function(){$this->setTemplateMeta();});

			Flight::route("POST /updateTemplate",function(){$this->updateTemplate();});	
			Flight::route("POST /updateTemplateMeta",function(){$this->updateTemplateMeta();});
			Flight::route("GET /getTemplate/@TemplateID",function($TemplateID){$this->getTemplate($TemplateID);});	
			Flight::route("GET /getTemplateMeta/@TemplateID",function($TemplateID){$this->getTemplateMeta($TemplateID);});	
			Flight::route("GET /getAllTemplate/",function(){$this->getAllTemplate();});	
			Flight::route("GET /getAllTemplateMeta/",function(){$this->getAllTemplateMeta();});
			Flight::route("GET /searchTemplateMeta/@searchstring",function($searchstring){$this->searchTemplateMeta($searchstring);});
			Flight::route("GET /searchTemplate/@searchstring",function($searchstring){$this->searchTemplate($searchstring);});
			Flight::route("POST /bulkTemplate",function(){$this->bulkTemplate();});


			

			header('Content-Type: application/json');
			header('Access-Control-Allow-Headers: Content-Type');
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Methods: GET, POST');
		
		}
	}

?>
