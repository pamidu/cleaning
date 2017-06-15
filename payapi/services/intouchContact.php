<?php


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
                 $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
            $cnt = $client->get()->byKey($email);
            echo json_encode($cnt);
               if(empty((array)$cnt)){
                             
                    $proClient = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                    $profile = $proClient->get()->byKey($email);
                    $picClient = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"profilepictures","123");
                    $proPic = $picClient->get()->byKey($email);
                
                    if((empty((array)$profile))&&(empty((array)$proPic))){
                        echo '{"Success": false, "Message": User Details  Not Available... }';
                    }else{
                        $contact = new Contact();
                        DuoWorldCommon::mapToObject($profile, $contact);
                        unset($contact->id);
                        unset($contact->bannerPicture);
                        $contact->sipuser = str_replace(array("@","."), "_", $contact->email);
                        $contact->password = "duos123";
                        $contact->profileImg = (isset($proPic->Body)) ? $proPic->Body : null;
                        $itcClient = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"intouchContact","123");
                        $data = array("SipUsername" => $contact->sipuser, "Password" => "duos123","Domain"=>"");                                                                    
                        $data_string = json_encode($data); 
                         echo json_encode($data_string); 
                                                                                                                                                                                     
                        $ch = curl_init('http://sipuserendpointservice.104.131.67.21.xip.io/DVP/API/1.0.0.0/SipUser/DuoWorldUser');                                                                      
                        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
                        curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
                           'Content-Type: application/json',                                                                                
                           'authorization: 2784365925')                                                                       
                        );                                                                                                                   
                                                                                                                          
                        $result = curl_exec($ch);
                        if(json_decode($result)->IsSuccess){
                            $response = $itcClient->store()->byKeyField("email")->andStore($contact);
                            if($response->IsSuccess)
                                echo '{"Success" : true, "Response":' . json_encode($contact) . '}';
                            else
                                echo '{"Success": false, "Message":' . $response->Message . '}';
                        }else{
                            echo '{"Success": false, "Message": Requested fail contact side }';
                        } 
                    }

                 }else{
                    $proClient = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                    $profile = $proClient->get()->byKey($email);
                    $picClient = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"profilepictures","123");
                    $proPic = $picClient->get()->byKey($email);
             
                        $contact = new Contact();
                        DuoWorldCommon::mapToObject($profile, $contact);
                        unset($contact->id);
                        unset($contact->bannerPicture);
                        $contact->sipuser = str_replace(array("@","."), "_", $contact->email);
                        $contact->password = "duos123";
                        $contact->profileImg = (isset($proPic->Body)) ? $proPic->Body : null;

                        $data = array("SipUsername" => $contact->sipuser, "Password" => "duos123","Domain"=>"");                                                                    
                        $data_string = json_encode($data); 
                        echo json_encode($data_string); 
                        $ch = curl_init('http://sipuserendpointservice.104.131.67.21.xip.io/DVP/API/1.0.0.0/SipUser/DuoWorldUser');                                                                      
                        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
                        curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
                            'Content-Type: application/json',                                                                                
                            'authorization: 2784365925')                                                                       
                        ); 
                        $result = curl_exec($ch);
                        
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
