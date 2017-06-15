<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");

	class Account {
        public $CardOrAccount;
        public $CardOrAccountNo;
        public $CardOrAccountType;
        public $DisplayName;
        public $Expiry;
        public $NameOnCardOrAccount;
		public $Email;
        public $Bank;
        public $RequestedDate;
	}

	class AccountVerification {
		public $CardOrAccountNo;
		public $Verification;
	}

	class AccountStatus {
		public $CardOrAccountNo;
		public $Status;
		public $CustomerTenant;
	}
/*
	class AccountHolder {
		public $Name;
		public $CardOrAccountNo;
	}
*/

	class AccountService {

		public function getAccountStatus($id){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accountstatus","123");
			echo json_encode($client->get()->byKey($id));
		}

		public function getAllAccounts(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"account","123");
			echo json_encode($client->get()->all());
		}

		public function getAccount($id){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"account","123");
			echo json_encode($client->get()->byKey($id));
		}

		public function storeAccount(){
			$acc = new Account();
			DuoWorldCommon::mapToObject(Flight::request()->data, $acc);
			$acc->RequestedDate = date("M d, Y");
			$client = ObjectStoreClient::WithNamespace($acc->Bank,"account","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($acc);

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"account","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($acc);

			$digits = 4;
		
			$accV = new AccountVerification();
			$accV->CardOrAccountNo = $acc->CardOrAccountNo;
			$accV->Verification = rand(pow(10, $digits-1), pow(10, $digits)-1);

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accverification","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($accV);

			$accS = new AccountStatus();
			$accS->CardOrAccountNo = $acc->CardOrAccountNo;
			$accS->Status = "Pending";
			$accS->CustomerTenant = DuoWorldCommon::GetHost();

			$client = ObjectStoreClient::WithNamespace($acc->Bank,"accountstatus","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($accS);

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accountstatus","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($accS);
/*
			$accH = new AccountHolder();
			DuoWorldCommon::mapToObject(Flight::request()->data, $accH);
			$client = ObjectStoreClient::WithNamespace("pay.gov.lk","accountholder","123");
			$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($accH);
			*/
		}

		private function generateVerificationCode(){
			$digits = 4;
			return  generateSegment($digits). "-". generateSegment($digits). "-". generateSegment($digits). "-" .generateSegment($digits);
		}

		private function generateSegment($digits){
			return rand(pow(10, $digits-1), pow(10, $digits)-1);
		}

		public function getVerificationCode($id){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accverification","123");
			echo json_encode($client->get()->byKey($id));
		}

		public function deleteAccount($id){

		}

		function __construct(){
			Flight::route("GET /account/vcode/@id", function ($id){ $this->getVerificationCode($id); });
			Flight::route("GET /account/status/@id", function ($id){ $this->getAccountStatus($id); });
			Flight::route("GET /account", function (){ $this->getAllAccounts(); });
			Flight::route("GET /account/@id", function ($id){ $this->getAccount($id); });

			Flight::route("POST /account", function (){ $this->storeAccount();});
			Flight::route("DELETE /account/@id", function ($id){ $this->deleteAccount($id); });

		}
	}
?>
