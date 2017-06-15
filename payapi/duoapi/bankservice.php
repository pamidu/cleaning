<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");

	class AccountHolder {
		public $RequestedDate; 
		public $CardOrAccount;
		public $CardOrAccountNo;
		public $Email;
		public $Status;
		public $FirstName;
		public $LastName;
	}

	class BankService {
/*
	confirmAcc gorest.EndPoint `method:"GET" path:"/bank/confirmacc/{Id:string}/" output:"ConfirmedDetails"`
	rejectAcc gorest.EndPoint `method:"GET" path:"/bank/rejectacc/{Id:string}/" output:"ConfirmedDetails"`

	getAll gorest.EndPoint `method:"GET" path:"/bank/" output:"[]Institute"`
	getOne gorest.EndPoint `method:"GET" path:"/bank/{Id:string}/" output:"Institute"`
	*/

		public function confirmAccount($accnum, $vcode){
			$statusObj = $this->getStatusObj($accnum);
			if ($this->verifyAccount($statusObj, $vcode)){
				$this->updateAccountStatus($statusObj, "Confirmed");
			}
		}

		public function rejectAccount ($accnum, $vcode){
			$statusObj = $this->getStatusObj($accnum);
			if ($this->verifyAccount($statusObj, $vcode)){
				$this->updateAccountStatus($statusObj, "Rejected");
			}
		}

		public function pendingAccount ($accnum, $vcode){
			$statusObj = $this->getStatusObj($accnum);
			if ($this->verifyAccount($statusObj, $vcode)){
				$this->updateAccountStatus($statusObj, "Pending");
			}
		}

		private function verifyAccount($statusObj, $vcode){
			$isVerified = false;
			$client = ObjectStoreClient::WithNamespace($statusObj->CustomerTenant,"accverification","123");
			$vObj = $client->get()->byKey($statusObj->CardOrAccountNo);

			if ($vObj != null)
			if ($vObj->Verification == $vcode)
				$isVerified = true;

			return $isVerified;
		}

		private function updateAccountStatus($statusObj, $status){
				$statusObj->Status = $status;
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accountstatus","123");
				$client->store()->byKeyField("CardOrAccountNo")->andStore($statusObj);	

				$client = ObjectStoreClient::WithNamespace($statusObj->CustomerTenant,"accountstatus","123");
				$client->store()->byKeyField("CardOrAccountNo")->andStore($statusObj);	
		}

		private function getStatusObj($accNo){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accountstatus","123");
				$rawAcc = $client->get()->byKey($accNo);
				$accS = new AccountStatus();
				DuoWorldCommon::mapToObject($rawAcc, $accS);

				return $accS;
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
		
		public function getAccountHolders(){
			$client = ObjectStoreClient::WithNamespace("pay.gov.lk","accountholder","123");
			echo json_encode($client->get()->all());
		}

		public function searchAccountHolders(){
			$type = Flight::request()->query['type'];
			$key = Flight::request()->query['keyword'];
			$skip = Flight::request()->query['skip'];
			$take = Flight::request()->query['take'];

			if (isset($type))	
				$filterString = "";
			else
				$filterString = "Status:" . $type;

			if (isset($key)) {
				if (strlen($filterString) == 0){
					$filterString = $key;
				}else {
					$filterString.= " AND " . $key;
				}
			}

			if (strlen($filterString) == 0)
				$filterString = "*";
			//?type" + ty + "&skip="+ s + "&take=" + t + "&keyword=" + str
			if (!isset($type)) $type = "cust";
			$allHolders = array();
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"account","123");
			$allAccounts = $client->get()->byFiltering($filterString);

			$asClient = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"accountstatus","123");
			$proClient = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");

			foreach ($allAccounts as $account) {
				$accObj = new AccountHolder();

				$accObj->RequestedDate = $account["RequestedDate"];
				$accObj->CardOrAccount = $account["CardOrAccount"];
				$accObj->CardOrAccountNo = $account["CardOrAccountNo"];
				$accObj->Email = $account["Email"];
				
				$statusObj = $asClient->get()->byKey($accObj->CardOrAccountNo);		
				if (isset($statusObj))
					if (!isset($statusObj->isSucess)){
					$accObj->Status = $statusObj->Status;


					$proObj = $proClient->get()->byKey($account["Email"]);
					if (isset($proObj)){
						$accObj->FirstName = $proObj->firstName;
						$accObj->LastName = $proObj->lastName;
					}else{
						$accObj->FirstName = "Record";
						$accObj->LastName = "Not Found";
					}

					array_push($allHolders, $accObj);
				}

			}

			echo json_encode($allHolders);
		}

		function __construct(){
			Flight::route("GET /bank/confirmaccount/@accnum/@vcode", function ($accnum, $vcode){$this->confirmAccount($accnum, $vcode);});
			Flight::route("GET /bank/rejectaccount/@accnum/@vcode", function ($accnum, $vcode){$this->rejectAccount($accnum, $vcode);});
			Flight::route("GET /bank/pendingaccount/@accnum/@vcode", function ($accnum, $vcode){$this->pendingAccount($accnum, $vcode);});
			Flight::route("GET /bank/", function (){$this->getAllBanks();});
			Flight::route("GET /bank/@id", function ($id){$this->getBank($id);});
			
			Flight::route("GET /bank/accountholders/", function (){$this->searchAccountHolders(); });
			Flight::route("GET /bank/accountholders/search", function (){ $this->searchAccountHolders(); });
		}
	}
?>
