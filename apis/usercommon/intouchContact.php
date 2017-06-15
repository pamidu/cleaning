<?php

//	class contactDetails{
//		public $email;
//		public $sipuser;
//		public $password;
//	}

    class Contact {
        public $email;
        public $name;
        public $username;
        public $zipcode;
        public $country;
        public $company;
        public $sipuser;
        public $password;
        public $profileImg;
    }


	class intouchContact {

		public function test(){
			echo "Hello World!!!";
		}
		
		public function checkRegisterd($email){
//			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
//			$respond=$client->get()->byKey($email);
//			$arr = (array)$respond;
//			if (empty($arr)) {
//				//call endpoint;
//				//if(/*endpointsuccess*/){
//					$contact=new contactDetails();
//					$contact->email=$email;
//					$atRemove=str_replace("@","_",$email);
//					$sipuseremail=str_replace(".","_",$atRemove);
//					$contact->sipuser=$sipuseremail;
//					$contact->password="duos123";
//					$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
//					$respond_save=$client->store()->byKeyField("email")->andStore($contact);
//				//}
//
//				echo json_encode($contact);
//			}
//			else{
//				echo json_encode($respond);
//			}
            
            $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
            $cnt = $client->get()->byKey($email);
            if(!isset($cnt->IsSuccess)){
                if(empty((array)$cnt)){
                    $proClient = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                    $profile = $proClient->get()->byKey($email);
                    $picClient = ObjectStoreClient::WithNamespace("duoworld.duoweb.info","profilepictures","123");
                    $proPic = $picClient->get()->byKey($email);
                    
                    $contact = new Contact();
                    DuoWorldCommon::mapToObject($profile, $contact);
                    unset($contact->id);
                    unset($contact->bannerPicture);
                    $contact->sipuser = str_replace(array("@","."), "_", $contact->email);
                    $contact->password = "duos123";
                    $contact->profileImg = (isset($proPic->Body)) ? $proPic->Body : null;
                    $itcClient = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
					$response = $itcClient->store()->byKeyField("email")->andStore($contact);
                    if($response->IsSuccess)
                        echo '{"Success" : true, "Response":' . json_encode($contact) . '}';
                    else
                        echo '{"Success": false, "Message":' . $response->Message . '}';
                }else{
                    echo '{"Success": false, "Message": Requested email address already available.}';
                }
            }

		}
		public function getAllContact(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
			$respond=$client->get()->all();
			echo json_encode($respond);
		}

		function __construct(){
			Flight::route("GET /test", function (){$this->test();});
			Flight::route("GET /checkRegisterd/@email", function ($email){
                try {
                    $this->checkRegisterd($email);
                }catch(Exception $ex) {
                    echo '{"Success": false, "Message": Error occurred while processing the request.}';
                }
            });
			Flight::route("GET /getAllContact/", function (){$this->getAllContact();});

		}
	}
?>
