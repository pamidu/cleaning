<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");
	class BankService {
/*
	confirmAcc gorest.EndPoint `method:"GET" path:"/bank/confirmacc/{Id:string}/" output:"ConfirmedDetails"`
	rejectAcc gorest.EndPoint `method:"GET" path:"/bank/rejectacc/{Id:string}/" output:"ConfirmedDetails"`

	getAll gorest.EndPoint `method:"GET" path:"/bank/" output:"[]Institute"`
	getOne gorest.EndPoint `method:"GET" path:"/bank/{Id:string}/" output:"Institute"`
	*/

		public function confirmAccount($accnum, $vcode){
			if ($this->verifyAccount($accnum, $vcode)){
				$this->updateAccountStatus($accnum, "Confirmed");
			}
		}

		public function rejectAccount ($accnum, $vcode){
			if ($this->verifyAccount($accnum, $vcode)){
				$this->updateAccountStatus($accnum, "Rejected");
			}
		}

		public function pendingAccount ($accnum, $vcode){
			if ($this->verifyAccount($accnum, $vcode)){
				$this->updateAccountStatus($accnum, "Pending");
			}
		}

		private function verifyAccount($accNo, $vcode){
			$isVerified = false;
			$client = ObjectStoreClient::WithNamespace("pay.gov.lk","accverification","123");
			$vObj = $client->get()->byKey($accNo);
			if ($vObj != null)
			if ($vObj->Verification == $vcode)
				$isVerified = true;

			return $isVerified;
		}

		private function updateAccountStatus($accNo, $status){
				$accS = new AccountStatus();
				$accS->CardOrAccountNo = $accNo;
				$accS->Status = $status;
				$client = ObjectStoreClient::WithNamespace("pay.gov.lk","accountstatus","123");
				$client->store()->byKeyField("CardOrAccountNo")->andStoreArray($accS);	
		}

		public function getAllBanks(){
			$client = ObjectStoreClient::WithNamespace("pay.gov.lk","bank","123");
			$allBanks = $client->get()->all();
			echo json_encode($allBanks);
		}

		public function getBank($id){
			$client = ObjectStoreClient::WithNamespace("pay.gov.lk","bank","123");
			$allBanks = $client->get()->byKey($id);
			echo json_encode($allBanks);
		}
		
		function __construct(){
			Flight::route("GET /bank/confirmaccount/@accnum/@vcode", function ($accnum, $vcode){$this->confirmAccount($accnum, $vcode);});
			Flight::route("GET /bank/rejectaccount/@accnum/@vcode", function ($accnum, $vcode){$this->rejectAccount($accnum, $vcode);});
			Flight::route("GET /bank/pendingaccount/@accnum/@vcode", function ($accnum, $vcode){$this->pendingAccount($accnum, $vcode);});
			Flight::route("GET /bank/", function (){$this->getAllBanks();});
			Flight::route("GET /bank/@id", function ($id){$this->getBank($id);});
		}
	}
?>
