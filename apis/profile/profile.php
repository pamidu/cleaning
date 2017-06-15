<?php
require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");

        
        class profile {
                public function test(){
                        echo "Hello from profile service V 1.0.1+bulk profile details update ";
                }
                        public function getProfile($email){
                       // $authObj = json_decode($_COOKIE["authData"]);
                        //$username = $authObj->Username;
                        //$mainDomain=$GLOBALS['mainDomain'];
                        //$spaceOwner =  str_replace(".", "", str_replace("@", "", $username))."." . $mainDomain;
                        $client = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                        $respond=$client->get()->bykey($email);
                        echo json_encode($respond);
                }
                public function setProfile(){
                        $ec= json_decode(Flight::request()->getBody());
                        //$authObj = json_decode($_COOKIE["authData"]);
                        //$username = $authObj->Username;
                        //$mainDomain=$GLOBALS['mainDomain'];
                        //$spaceOwner =  str_replace(".", "", str_replace("@", "", $username))."." . $mainDomain;
                        $client = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                        $storeRespond=$client->store()->byKeyField("Email")->andStore($ec);
                        echo json_encode($storeRespond);
                }
                public function getUserDataBulk(){
                   // $mainDomain=$GLOBALS['mainDomain'];
                    //$mainDomain="duoworld.com";
                    $profiledata=array();
                    $emailsarray=json_decode(Flight::request()->getBody())->email;
                    foreach ($emailsarray as $email) {
                        //$spaceOwner =str_replace(".", "", str_replace("@", "", $email)). "." . $mainDomain;
                        $client = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
                        $respond=$client->get()->bykey($email);
                        if(!empty($respond)){
                            array_push($profiledata,$respond);
                        } 
                    }
                    echo json_encode($profiledata);
                }
//                public function getProfile($email){
// //                         $authObj = json_decode($_COOKIE["authData"]);
// //                         $username = $authObj->Username;
// //                         $mainDomain=$GLOBALS['mainDomain'];
// //                         $spaceOwner =  str_replace(".", "", str_replace("@", "", $username))."." . $mainDomain;
// //                         $client = ObjectStoreClient::WithNamespace($spaceOwner,"profile","123");
// //                         $respond=$client->get()->bykey($email);
// //                         echo json_encode($respond);
//                         $client = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
//                         $respond=$client->get()->bykey($email);
//                         echo json_encode($respond);
//                 }
//                 public function setProfile(){
//                         $ec= json_decode(Flight::request()->getBody());
//                         $authObj = json_decode($_COOKIE["authData"]);
//                         $username = $authObj->Username;
//                         $mainDomain=$GLOBALS['mainDomain'];
//                         $spaceOwner =  str_replace(".", "", str_replace("@", "", $username))."." . $mainDomain;
//                         $client = ObjectStoreClient::WithNamespace($spaceOwner,"profile","123");
//                         $storeRespond=$client->store()->byKeyField("Email")->andStore($ec);
//                         echo json_encode($storeRespond);
//                 }
//                 public function getUserDataBulk(){
//                     //$mainDomain=$GLOBALS['mainDomain'];
//                     $mainDomain="duoworld.com";
//                     $profiledata=array();
//                     $emailsarray=json_decode(Flight::request()->getBody())->email;
//                     foreach ($emailsarray as $email) {
//                         $spaceOwner =str_replace(".", "", str_replace("@", "", $email)). "." . $mainDomain;
//                         $client = ObjectStoreClient::WithNamespace($spaceOwner,"profile","123");
//                         $respond=$client->get()->bykey($email);
//                         if(!empty($respond)){
//                             array_push($profiledata,$respond);
//                         } 
//                     }
//                     echo json_encode($profiledata);

//                 }
                function __construct($isHttpMode = true){
               
                        if ($isHttpMode){ 
                                $this->isHttpMode = true;
                                Flight::route("GET /userprofile/",function(){$this->test();});
                                Flight::route("GET /userprofile/@email",function($email){$this->getProfile($email);});
                                Flight::route("POST /userprofile",function(){$this->setProfile();});
                                Flight::route("POST /userprofile/getuserdatabulk",function(){$this->getUserDataBulk();});
                                
                                        
      
                                header('Content-Type: application/json');
                                header('Access-Control-Allow-Headers: Content-Type');
                                header('Access-Control-Allow-Origin: *');
                                header('Access-Control-Allow-Methods: GET, POST');
                        }
                
                }
        }
?>
