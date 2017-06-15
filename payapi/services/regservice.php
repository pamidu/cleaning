<?php
	require_once (BASE_PATH . "/duoapi/extservices.php");
	
	class TenantOtherData {
		public $Type;
		public $Data;
	}

	class TenantBank {
		public $TenantID;
		public $BankName;
	}

	class TenantCitizen {
		public $TenantID;
		public $CitizenName;
	}

	class TenantInstitute {
		public $TenantID;
		public $InstituteName;
	}

	class UserProfile {
		public $name;
		public $phone;
		public $email;
		public $company;
		public $country;
		public $zipcode;
	}

	class UserActivation {
		public $email;
		public $isActive;
	}

	class RegistrationService {

		public function register(){
			$uiData = Flight::request()->data;
			$type = Flight::request()->query['type'];
			if (!isset($type)) $type = "cust";

			//add user to auth
			$userObj = new AddUserRequest();
			$userObj->UserID = "123";
			$userObj->Active = false;
			$userObj->EmailAddress = $uiData->Email;
			$userObj->Name = $uiData->FirstName . " " . $uiData->LastName;
			$userObj->Password = $uiData->Password;
			$userObj->ConfirmPassword = $uiData->ConfirmPassword;
			$authService = new AuthProxy("123");
			$authResponse = $authService->AddUser($userObj);
			
			if ($authResponse !=null){

				//create user profile
				$client = ObjectStoreClient::WithNamespace("duosoftware.com","profile","123");
				$proObj = new UserProfile();
				$proObj->name = $userObj->Name;
				$proObj->phone = $uiData->Mobile;
				$proObj->email = $userObj->EmailAddress;
				$proObj->company = "";
				$proObj->country = "Sri-Lanka";
				$proObj->zipcode = "001";

				$client->store()->byKeyField("email")->andStore($proObj);
			}

			Common::respondSuccess();
		}

		function activateUser($token){

			$email;
			//activated users;
			$client = ObjectStoreClient::WithNamespace("com.duosoftware.auth","activations","123");
			$activationObj =  new UserActivation();
			$activationObj->email = $email;
			$activationObj->isActive = true;
			$client->store()->byKeyField("email")->andStore($activationObj);

			
			//save tenant related data
			$tOtherData = new TenantOtherData();
			$suffix;
			$tenantName = str_replace("@","_", $email);

			switch ($type){
				case "cust":
					$suffix = "cust";
					$tOtherData->Type = "Customer";
					$tOtherData->Data = $userObj;

					$client = ObjectStoreClient::WithNamespace("pay.gov.lk","citizen","123");
					$citObj = new TenantCitizen();
					$citObj->TenantID = $tenantName . "." . $suffix;
					$client->store()->byKeyField("TenantID")->andStore($citObj);
					break;
				case "bank";
					$suffix = "bank";
					$tOtherData->Type = "Bank";
					$tOtherData->Data = $userObj;

					$client = ObjectStoreClient::WithNamespace("pay.gov.lk","bank","123");
					$bankObj = new TenantBank();
					$bankObj->TenantID = $tenantName . "." . $suffix;
					$bankObj->BankName = "";
					$client->store()->byKeyField("TenantID")->andStore($bankObj);
					break;
				case "com":
					$tOtherData->Type = "Company";
					$tOtherData->Data = $userObj;
					$suffix = "com";			

					$client = ObjectStoreClient::WithNamespace("pay.gov.lk","company","123");
					$comObj = new TenantInstitute();
					$comObj->TenantID = $tenantName . "." . $suffix;
					$client->store()->byKeyField("TenantID")->andStore($comObj);
					break;
			}

			//create tenant
			$tenantObj = new CreateTenantRequest();
			$tenantObj->Shell = "Shell";
			//$tenantObj->Statistic = "123";
			unset($tenantObj->Statistic);
			$tenantObj->Private = true;
			

			$tenantObj->OtherData = $tOtherData;
			unset($tenantObj->OtherData);
			$tenantObj->TenantID = $tenantName . "." . $suffix;
			$tenantObj->Name = $userObj->Name;

			$tenantService = new TenantProxy("123");

			/*
				{"TenantID":"smapletenat.duoworld.info","Name":"Sample Tenant","Shell":"Shell",
				"Statistic":{"DataDown":"1GB","DataUp":"1GB","NumberOfUsers":"10"},
				"Private":true,"OtherData":{"CompanyName":"DuoSoftware Pvt Ltd","SampleAttributs":"Values"}}
			*/

			$tenantResponse = $tenantService->CreateTenant($tenantObj);	
			if ($tenantResponse != null){
				//invite user
			}
			
		}

		function __construct(){
			Flight::route("POST /registration/register", function (){
				try{
					$this->register();
				}catch (Exception $e) {
					Common::respondFail("test");
				}
			});

			Flight::route("GET /registration/activate/@token", function ($token){
				try{
					$this->activate($token);
				}catch (Exception $e) {
					Common::respondFail("test");
				}
			});
		}
	}
?>
