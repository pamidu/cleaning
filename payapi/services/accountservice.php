<?php
	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/duoapi/cloudcharge.php");
	require_once (BASE_PATH . "/duoapi/extservices.php");
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	class Account {
        public $AccountId;
		public $guid;
        public $DeliveyAddress;
        public $BillingAddress;
        public $PhoneNumber;
        public $AccountBalance;
        public $token;
        public $AccountCards;
		//public $AccountCards;
		public $UserID;
	}
	class AccountCards{
		public $guid;
		//public $CardNo;
		public $Name;
		public $CardType;
		public $DeliveyAddress;
        public $BillingAddress;
		//public $CSV;
		public $ExpiryYear;
		public $ExpiryMonth;
		public $Active;
		public $verified;
		public $lastdigit;
	}
	class AccountCard{
		public $Email;
		public $StripeCardID;
	}
	
    class AccountMap {
        public $Class;
        public $ClassId;
        public $AccountId;
        public $UserId;
        public $TenantId;
    }
	
	class AccountService {
       public function getGUID(){
			if (function_exists('com_create_guid')){
				return com_create_guid();
			}else{
				mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
				$charid = strtoupper(md5(uniqid(rand(), true)));
				$hyphen = chr(45);// "-"
				$uuid = chr(123)// "{"
					.substr($charid, 0, 8).$hyphen
					.substr($charid, 8, 4).$hyphen
					.substr($charid,12, 4).$hyphen
					.substr($charid,16, 4).$hyphen
					.substr($charid,20,12)
					.chr(125);// "}"
				//echo 
				return $uuid;
			}
		}
		public function storeAccount($multipale) {
            $acc = new Account();
			$saveobject=null;
			//var_dump(Flight::request()->data->getData());
            DuoWorldCommon::mapToObject(Flight::request()->data->getData(),$acc);
			$authData = json_decode($_COOKIE["authData"]);
			$acc->UserID=$authData->UserID;
			$s=null;
			//var_dump($acc);
			$client = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","account",$authData->SecurityToken);
			if($multipale=="false"){
				$s1=$client->get()->bySearching("UserID:". $authData->UserID);
				if(sizeof($s1)!=0){
					
					$acc->AccountId=$s1[0]["AccountId"];
					//var_dump($s1[0]["AccountId"]);
				}
				else{
					$acc->AccountId="-999";
				}
			}
            
			
			$s=$client->get()->byKey($acc->AccountId);
			
			//var_dump()
			//var_dump(getGUID());
			if(isset($s->UserID)){
				
				if($s->UserID!=$authData->UserID){
					echo '{"Message":"Error Saving permission denied"}';
				}else{
					//$acc->AccountCards=$s->AccountCards;
					
				}
			}else{
				//var_dump(getGUID());
				$acc->AccountId="-999";
				$acc->guid=getGUID();
			}
			$striperesponse=(new CloudCharge())->card()->add($acc->token);
//var_dump($striperesponse);
			if(!$striperesponse->status){
				echo '{"Error":true,"Message":"Error adding card from stripe"}';
				return;
			}
			$stridata=$striperesponse->data[0];
			$acc->AccountCards= array();
			foreach($striperesponse->data as $cards){
				array_push($acc->AccountCards, $cards);

				//var_dump($acc->AccountCards);
				/////////////////////////////////////////
				// $cards->guid=$stridata->id;
				// //$cards->CardNo=$stridata->
				// //$cards->Name=$stridata->
				// $cards->CardType=$stridata->brand;
				// //$cards->DeliveyAddress=$stridata->
    //     		//$cards->BillingAddress=$stridata->
				// //$cards->CSV=$stridata->
				// $cards->ExpiryYear=$stridata->exp_year;
				// $cards->ExpiryMonth=$stridata->exp_month;
				// //$cards->Active=$stridata->
				// //$cards->verified=$stridata->
				// $cards->lastdigit=$stridata->last4;
				//////////////////////////////////////
				
				// if(!isset($cards["guid"])){
				// 	$cards["guid"]=getGUID();
				// 	//var_dump($acc->AccountCards[$ic]);
				// }
			}
			//echo json_encode($acc);
			//exit();
			//echo json_encode($acc);
           $x=$client->store()->byKeyField("AccountId")->andStore($acc);
			if($x->IsSuccess){
				echo json_encode($x);
				//echo '{"status":true,"Message":"succesfully saved"}';
				//var_dump($x->Data[0]->ID);
				//$acc->AccountId=$x->Data[0]->ID;
				//echo json_encode($acc);
			}else{
				echo '{"Error":true,"Message":"Error Saving permission denied"}';
			}
          
        }
		
		public function addCard(){
			$acc = new AccountCards();
			$saveobject=null;
			
			echo json_encode($acc);
		}
		
		public function getAccount(){
			$authData = json_decode($_COOKIE["authData"]);
			//var_dump($authData);
			
			$client = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","account",$authData->SecurityToken);
			$s=$client->get()->bySearching("UserID:". $authData->UserID);
			echo(json_encode($s));
		}
		
		public function getSession(){
			echo($_COOKIE["authData"]);
		}
        
        public function tagAccount() {
            $accMap = new AccountMap();
            DuoWorldCommon::mapToObject(Flight::request()->data->getData(),$accMap);
            
            $client = ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","accountMap","123");
            $client->store()->byKeyField("ClassId")->andStore($accMap);   
        }
        
        public function getAccountBalace($accId) {
            
        }
        
		function __construct(){
			Flight::route("POST /account/@multipale", function ($multipale){ $this->storeAccount($multipale);});
			Flight::route("GET /account/get", function (){ $this->getAccount(); });
			Flight::route("GET /account/getCard", function (){ $this->addCard(); });
			Flight::route("GET /account/session",function (){ $this->getSession(); });
			Flight::route("POST /account/tag", function (){ $this->tagAccount(); });
			Flight::route("GET /account/balance/@id", function ($id){ $this->getAccountBalace($id); });
		}
	}
?>
